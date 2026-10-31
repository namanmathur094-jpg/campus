/**
 * Campus Pulse - Weekly AI Summary Engine
 * Generates an executive briefing for students using:
 *   1. Real Google Gemini API (when configured)
 *   2. Honest Algorithmic Schedule Synthesizer (when offline)
 * Includes 1-click WhatsApp copy and .ics iCalendar export.
 */

import { storage } from './storage.js';
import { CONFIG } from './config.js';

export class SummaryService {
  /**
   * Generates a weekly briefing based on stored events.
   */
  static async generateWeeklySummary() {
    const events = storage.getAllEvents();
    
    if (!events || events.length === 0) {
      return {
        source: 'none',
        markdown: 'No campus events currently recorded. Paste notices to build your weekly schedule!'
      };
    }

    const apiKey = storage.getApiKey();

    if (apiKey) {
      try {
        const aiSummary = await this.generateWithGemini(events, apiKey);
        return {
          source: 'gemini',
          sourceLabel: 'Gemini 1.5 Flash AI Synthesis',
          markdown: aiSummary
        };
      } catch (err) {
        console.warn('Gemini summary failed, using fallback synthesizer:', err);
        const fallback = this.generateFallbackSummary(events);
        return {
          source: 'fallback',
          sourceLabel: 'Rule-Based Weekly Schedule Synthesizer (API unavailable)',
          markdown: fallback
        };
      }
    }

    const fallback = this.generateFallbackSummary(events);
    return {
      source: 'fallback',
      sourceLabel: 'Rule-Based Weekly Schedule Synthesizer (No API key set)',
      markdown: fallback
    };
  }

  /**
   * Real Gemini API Call for Weekly Synthesis
   */
  static async generateWithGemini(events, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Filter upcoming & today events
    const relevantEvents = events.filter(e => e.calculatedStatus !== 'expired').slice(0, 10);
    const eventSummaryList = relevantEvents.map(e => 
      `- [${e.category.toUpperCase()}] "${e.title}" on ${e.date} at ${e.time} (Venue: ${e.venue}, Urgent: ${e.urgent ? 'YES' : 'NO'}). Notes: ${e.summary}`
    ).join('\n');

    const prompt = `You are Campus Pulse AI, a smart college productivity assistant.
Create an engaging, scannable "Weekly Campus Pulse Digest" for college students based on these active events:

${eventSummaryList}

Formatting instructions:
1. Start with an energetic 1-sentence campus outlook.
2. Section: "🚨 HIGH PRIORITY & DEADLINES" (Bullet points with dates).
3. Section: "📚 ACADEMICS & EXAMS" (Key preparations needed).
4. Section: "🎯 CAREER & ACTIVITIES" (Hackathons, placements, club events).
5. Section: "💡 PRO-TIP FOR THE WEEK" (Actionable advice for student survival).
Use clear bullet points and emojis. Keep the tone friendly, crisp, and motivating.`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No summary returned by Gemini');
    return text.trim();
  }

  /**
   * Honest Algorithmic Schedule Synthesizer (Zero hallucination, deterministic grouping)
   */
  static generateFallbackSummary(events) {
    const today = new Date();
    const activeEvents = events.filter(e => e.calculatedStatus !== 'expired');

    const urgentEvents = activeEvents.filter(e => e.calculatedStatus === 'urgent' || e.isToday);
    const upcomingEvents = activeEvents.filter(e => e.calculatedStatus === 'upcoming');

    let lines = [];
    lines.push(`📅 **CAMPUS PULSE WEEKLY DIGEST**`);
    lines.push(`Generated on ${today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}`);
    lines.push(`Total Active Notices Tracked: ${activeEvents.length}\n`);

    if (urgentEvents.length > 0) {
      lines.push(`🚨 **URGENT DEADLINES & TODAY'S ATTENTION:**`);
      urgentEvents.forEach(e => {
        lines.push(`• **${e.title}**`);
        lines.push(`  ⏰ When: ${e.date} (${e.time}) | 📍 Venue: ${e.venue}`);
        lines.push(`  ℹ️ ${e.summary}`);
      });
      lines.push('');
    } else {
      lines.push(`✅ **TODAY'S STATUS:** No urgent deadlines due right now! Great job staying ahead.`);
      lines.push('');
    }

    if (upcomingEvents.length > 0) {
      lines.push(`🗓️ **UPCOMING THIS WEEK & BEYOND:**`);
      upcomingEvents.forEach(e => {
        lines.push(`• **${e.title}** [${e.category.toUpperCase()}]`);
        lines.push(`  📅 Date: ${e.date} at ${e.time} | 📍 ${e.venue}`);
      });
      lines.push('');
    }

    lines.push(`💡 **STUDENT PRO-TIP:**`);
    lines.push(`Sync your calendar reminders at least 3 hours before registration and exam submission deadlines to avoid portal server crashes.`);

    return lines.join('\n');
  }

  /**
   * Generates a downloadable .ics iCalendar file for all active events.
   */
  static generateICS(events) {
    const active = events.filter(e => e.calculatedStatus !== 'expired');
    if (active.length === 0) return null;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Campus Pulse//College Events Hub//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Campus Pulse Events'
    ];

    active.forEach(e => {
      // Format DTSTART YYYYMMDDTHHMMSS
      const dateDigits = e.date.replace(/-/g, '');
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${e.id}@campuspulse.edu`);
      icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${dateDigits}`);
      icsContent.push(`SUMMARY:${e.title.replace(/[,;]/g, ' ')}`);
      icsContent.push(`DESCRIPTION:${(e.summary || '').replace(/\n/g, ' ')}`);
      icsContent.push(`LOCATION:${(e.venue || '').replace(/[,;]/g, ' ')}`);
      icsContent.push(`CATEGORIES:${e.category.toUpperCase()}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  }
}
