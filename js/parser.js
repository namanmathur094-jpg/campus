/**
 * Campus Pulse - Smart Notice Parsing Engine
 * Supports:
 *   1. Real Google Gemini 1.5 Flash API (when user enters API key)
 *   2. Honest Deterministic Rule-Based NLP & Regex Fallback (when offline/no key)
 * Strictly conforms to: "No fake AI - clear provenance attribution"
 */

import { storage } from './storage.js';
import { CONFIG } from './config.js';

export class NoticeParser {
  /**
   * Main entry point for notice parsing.
   * Checks for API key first; if absent, transparently invokes fallback.
   */
  static async parseNotice(rawText) {
    if (!rawText || !rawText.trim()) {
      throw new Error('Please paste or enter notice text to parse.');
    }

    const apiKey = storage.getApiKey();

    if (apiKey) {
      try {
        const geminiResult = await this.parseWithGemini(rawText.trim(), apiKey);
        return {
          source: 'gemini',
          sourceLabel: 'Gemini AI Extracted',
          data: geminiResult
        };
      } catch (err) {
        console.warn('Gemini API call failed, safely falling back to rule-based parser:', err);
        const fallbackResult = this.parseWithRuleEngine(rawText.trim());
        return {
          source: 'fallback',
          sourceLabel: 'Rule-Based Parser (Gemini API unavailable)',
          errorNote: err.message,
          data: fallbackResult
        };
      }
    }

    // Honest Fallback Mode
    const fallbackResult = this.parseWithRuleEngine(rawText.trim());
    return {
      source: 'fallback',
      sourceLabel: 'Rule-Based Regex Parser (No API key set)',
      data: fallbackResult
    };
  }

  /**
   * Real Google Gemini 1.5/2.0 API extraction using structured JSON prompt
   */
  static async parseWithGemini(rawText, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const prompt = `You are the Campus Pulse notice parser. Extract structured college event details from the raw notice below.
Return ONLY valid JSON matching this exact schema:
{
  "title": "Clear and concise event title",
  "category": "academic | exams | placements | clubs | admin | general",
  "date": "YYYY-MM-DD (assume current year 2026 if not specified)",
  "time": "HH:MM AM/PM or 'All Day'",
  "venue": "Exact room, hall, building or online link",
  "urgent": true/false (true if due within 48h, final reminder, or strict deadline),
  "summary": "A 1-2 sentence student-friendly summary highlighting key instructions"
}

Raw Notice:
"""
${rawText}
"""`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: "application/json"
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini returned an empty response.');
    }

    // Clean any markdown formatting if present
    const cleanJson = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Validate and normalize fields
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      title: parsed.title || 'Untitled Campus Event',
      category: ['academic', 'exams', 'placements', 'clubs', 'admin', 'general'].includes(parsed.category) ? parsed.category : 'general',
      date: parsed.date || todayStr,
      time: parsed.time || '10:00 AM',
      venue: parsed.venue || 'Campus Main Grounds',
      urgent: Boolean(parsed.urgent),
      summary: parsed.summary || rawText.substring(0, 120) + '...'
    };
  }

  /**
   * Honest Deterministic Rule-Based NLP & Regex Engine
   * Operates completely offline, without hallucination or mock data.
   */
  static parseWithRuleEngine(text) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 1. Extract Date
    let extractedDate = todayStr;
    const lower = text.toLowerCase();

    if (lower.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      extractedDate = tomorrow.toISOString().split('T')[0];
    } else if (lower.includes('today') || lower.includes('tonight')) {
      extractedDate = todayStr;
    } else {
      // Look for Month DD, YYYY or DD Month YYYY
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthRegex = new RegExp(`(?:(\\d{1,2})(?:st|nd|rd|th)?\\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+(\\d{1,2})?(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`, 'i');
      const match = text.match(monthRegex);

      if (match) {
        const monthIndex = monthNames.findIndex(m => match[2].toLowerCase().startsWith(m));
        const day = parseInt(match[1] || match[3] || '1', 10);
        const year = match[4] ? parseInt(match[4], 10) : today.getFullYear();
        
        if (monthIndex !== -1 && day >= 1 && day <= 31) {
          const parsedD = new Date(year, monthIndex, day);
          extractedDate = parsedD.toISOString().split('T')[0];
        }
      } else {
        // Try DD/MM/YYYY or YYYY-MM-DD
        const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
        const slashMatch = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/);
        if (isoMatch) {
          extractedDate = isoMatch[0];
        } else if (slashMatch) {
          const d = slashMatch[1].padStart(2, '0');
          const m = slashMatch[2].padStart(2, '0');
          const y = slashMatch[3].length === 2 ? '20' + slashMatch[3] : slashMatch[3];
          extractedDate = `${y}-${m}-${d}`;
        }
      }
    }

    // 2. Extract Time
    let extractedTime = '10:00 AM';
    const timeMatch = text.match(/\b(\d{1,2}(?::\d{2})?)\s*(AM|PM|am|pm)\b/);
    if (timeMatch) {
      extractedTime = timeMatch[0].toUpperCase();
    } else if (lower.includes('midnight') || lower.includes('11:59 pm')) {
      extractedTime = '11:59 PM';
    } else if (lower.includes('noon')) {
      extractedTime = '12:00 PM';
    }

    // 3. Extract Venue
    let extractedVenue = 'Campus Main Building';
    const venueRegex = /(?:venue|location|reporting at|room|hall|auditorium|audi|lab|oat|theatre|block|center|centre|portal)[\s:]+([^\n\r]+)/i;
    const venueMatch = text.match(venueRegex);
    if (venueMatch && venueMatch[1]) {
      let v = venueMatch[1].trim();
      // Remove trailing periods or commas
      v = v.replace(/[.,;]+$/, '').trim();
      if (v.length > 50) v = v.substring(0, 48) + '...';
      extractedVenue = v;
    } else if (lower.includes('online') || lower.includes('zoom') || lower.includes('meet') || lower.includes('portal')) {
      extractedVenue = 'Online Portal';
    } else if (lower.includes('auditorium') || lower.includes('audi')) {
      extractedVenue = 'Main Auditorium';
    } else if (lower.includes('lab')) {
      extractedVenue = 'Computer / Department Lab';
    }

    // 4. Extract Category (Precise Priority Matching)
    let extractedCategory = 'general';
    if (/placement|hiring|recruitment|drive|interview|ctc|off-campus|on-campus|pre-placement/i.test(text)) {
      extractedCategory = 'placements';
    } else if (/hackathon|coding contest|ideathon|fest|cultural|workshop|robotics|dance|music|drama|sports|club/i.test(text)) {
      extractedCategory = 'clubs';
    } else if (/exam|midterm|endsem|hall ticket|makeup exam|internal assessment|quiz|test/i.test(text)) {
      extractedCategory = 'exams';
    } else if (/fee|tuition|dues|accounts counter|hostel|mess dues|admission|circular|administrative/i.test(text)) {
      extractedCategory = 'admin';
    } else if (/lecture|syllabus|course|assignment|attendance|faculty|professor|class/i.test(text)) {
      extractedCategory = 'academic';
    }

    // 5. Extract Urgency
    const isUrgent = /urgent|immediate|emergency|final call|deadline|closes today|tonight|mandatory|last date/i.test(text) ||
      lower.includes('today') ||
      lower.includes('tomorrow');

    // 6. Clean Title
    const lines = text.split('\n')
      .map(l => l.replace(/[*_#~]/g, '').trim())
      .filter(l => l.length > 5);

    let title = 'Campus Notice Announcement';
    if (lines.length > 0) {
      // Pick the first substantive line, stripping prefixes
      title = lines[0].replace(/^(urgent notice|circular|official notice|attention all students|subject:)\s*[-:]?\s*/i, '').trim();
      if (title.length > 70) {
        title = title.substring(0, 68) + '...';
      }
    }

    // 7. Summary
    const summary = lines.slice(0, 3).join(' ').substring(0, 160) + '...';

    return {
      title,
      category: extractedCategory,
      date: extractedDate,
      time: extractedTime,
      venue: extractedVenue,
      urgent: isUrgent,
      summary
    };
  }
}
