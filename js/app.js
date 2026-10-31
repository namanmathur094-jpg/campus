/**
 * Campus Pulse - Complete Universal Application Controller
 * Premium AI SaaS Campus Notice Centraliser
 * Works natively in both file:/// and http:// environments without CORS restrictions.
 */

// ============================================================================
// 1. CONFIGURATION & REALISTIC SEED DATA
// ============================================================================
const CONFIG = {
  APP_NAME: 'Campus Pulse',
  VERSION: '2.0.0-saas',
  STORAGE_KEYS: {
    EVENTS: 'campus_pulse_events_v2',
    API_KEY: 'campus_pulse_gemini_api_key_v2',
    SETTINGS: 'campus_pulse_settings_v2'
  },
  DEFAULT_GEMINI_MODEL: 'gemini-1.5-flash',
  CATEGORIES: [
    { id: 'academic', label: 'Academic & Courses', class: 'cat-academic', icon: 'book' },
    { id: 'exams', label: 'Exams & Quizzes', class: 'cat-exams', icon: 'alert' },
    { id: 'placements', label: 'Placements & Career', class: 'cat-placements', icon: 'briefcase' },
    { id: 'clubs', label: 'Clubs & Hackathons', class: 'cat-clubs', icon: 'sparkles' },
    { id: 'admin', label: 'Administrative & Fees', class: 'cat-admin', icon: 'file' },
    { id: 'general', label: 'General Campus', class: 'cat-general', icon: 'info' }
  ]
};

// Generates local ISO dates (YYYY-MM-DD) avoiding UTC shifts
function getLocalISODate(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateSeedEvents() {
  const todayStr = getLocalISODate(0);
  const tomorrowStr = getLocalISODate(1);
  const inThreeDaysStr = getLocalISODate(3);
  const inFiveDaysStr = getLocalISODate(5);
  const yesterdayStr = getLocalISODate(-2);

  return [
    {
      id: 'cp_seed_1',
      title: '🚨 Urgent: Hackathon 2026 Team Registration Deadline',
      category: 'clubs',
      date: todayStr,
      time: '11:59 PM',
      venue: 'Online Portal (hack.campus.edu)',
      urgent: true,
      summary: 'Final call for submitting 3-4 member teams for the Annual Inter-College AI Hackathon. Shortlisted teams get cloud credits and mentorship.',
      rawNotice: 'ATTENTION ALL STUDENTS! Final reminder that registrations for the Campus AI Buildathon close TONIGHT at 11:59 PM sharp. Submit team details at hack.campus.edu. Late entries will NOT be accepted under any circumstances!',
      source: 'gemini',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cp_seed_2',
      title: 'Mid-Term Examination Schedule & Hall Tickets Release',
      category: 'exams',
      date: tomorrowStr,
      time: '09:30 AM',
      venue: 'Examination Wing - Block B',
      urgent: true,
      summary: 'Download hall tickets from student portal. Students must carry valid physical college ID cards to enter the examination hall.',
      rawNotice: 'CIRCULAR: Mid-semester examinations commence tomorrow at 9:30 AM in Block B. Students must bring printed hall tickets and physical ID cards. No mobile phones or smartwatches allowed inside halls.',
      source: 'fallback',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cp_seed_3',
      title: 'Google & Microsoft Campus Placement Pre-Placement Talk',
      category: 'placements',
      date: inThreeDaysStr,
      time: '02:00 PM',
      venue: 'Main Auditorium & YouTube Stream',
      urgent: false,
      summary: 'Mandatory briefing for final and pre-final year students regarding upcoming Software Engineering internship and full-time hiring drives.',
      rawNotice: 'Training & Placement Cell Notice: Pre-placement talk by visiting tech recruiters on ' + inThreeDaysStr + ' at 2:00 PM in the Main Auditorium. Formal dress code mandatory. Bring two hard copies of updated resumes.',
      source: 'gemini',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cp_seed_4',
      title: 'Robotics & AI Club: Hands-on Autonomous Drone Workshop',
      category: 'clubs',
      date: inFiveDaysStr,
      time: '04:00 PM',
      venue: 'Advanced Robotics Lab, Room 304',
      urgent: false,
      summary: 'Learn ROS 2, computer vision obstacle detection, and flight controllers. Hardware kits will be provided on spot.',
      rawNotice: 'Join the Robotics Club this week on ' + inFiveDaysStr + ' at 4:00 PM in Lab 304 for our hands-on drone workshop! Free for all enrolled engineering students. Bring your laptops with Python installed.',
      source: 'fallback',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cp_seed_5',
      title: 'Odd-Semester Tuition Fee Submission with Concession',
      category: 'admin',
      date: yesterdayStr,
      time: '05:00 PM',
      venue: 'Accounts Counter & ERP Gateway',
      urgent: false,
      summary: 'Last date for semester fee payments before standard late fee surcharge of Rs. 500/day applies.',
      rawNotice: 'Accounts Section Notice: All students must clear semester dues by ' + yesterdayStr + ' 5:00 PM. Failure to clear dues will lock grade viewing on student portal.',
      source: 'fallback',
      createdAt: new Date().toISOString()
    }
  ];
}

const SAMPLE_NOTICES = [
  {
    name: '⚡ WhatsApp: Hackathon Call',
    text: `*URGENT NOTICE - TECH FEST 2026*
Hey everyone! Team registration for the Smart India & Campus AI Hackathon closes *TODAY at 11:59 PM*.
Venue: Online Portal & Final demo at Audi 2.
Eligibility: Teams of 2 to 4 students.
Prizes worth ₹1,50,000 + Internship fast-tracks.
Register immediately: bit.ly/campus-hack-2026. Do not miss this deadline!`
  },
  {
    name: '📝 WhatsApp: Exam Form Notice',
    text: `*OFFICIAL CIRCULAR: Midterm Makeup Exams*
Date: Tomorrow, Nov 1, 2026
Time: 10:00 AM to 1:00 PM
Venue: Seminar Hall 1, Admin Block
All students who missed the internal assessments due to medical leave must submit signed medical certificates and report at 9:45 AM sharp with College ID. Latecomers will not be entertained.`
  },
  {
    name: '💼 Email: Placement Drive',
    text: `Subject: Campus Placement Drive - Amazon & Atlassian (Software Engineer Interns)
Date: Friday, Nov 6, 2026
Time: 09:00 AM
Venue: Computer Center Lab 5 (Ground Floor)
Eligible branches: CSE, IT, ECE with CGPA 7.5+.
Round 1: Online Coding Assessment (DSA & System Design).
Make sure your laptops are fully charged and carry your resume.`
  },
  {
    name: '🎭 Notice: Cultural Fest Auditions',
    text: `*VIBRANCE 2026 - AUDITIONS ANNOUNCEMENT*
The Music and Dramatics Club is hosting open auditions for the Annual Inter-University Fest!
Date: Saturday, Nov 7, 2026
Time: 3:30 PM onwards
Venue: Open Air Theatre (OAT)
Categories: Western Vocals, Classical Dance, Street Play, Stand-up Comedy.
All interested students should register at the student council desk.`
  }
];

// ============================================================================
// 2. STORAGE & STATUS COMPUTATION ENGINE
// ============================================================================
class StorageService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.EVENTS;
    this.apiKeyStorage = CONFIG.STORAGE_KEYS.API_KEY;
    this.init();
  }

  init() {
    try {
      if (typeof localStorage !== 'undefined') {
        const existing = localStorage.getItem(this.storageKey);
        if (!existing) {
          this.resetToSeedData();
        }
      }
    } catch (err) {
      console.warn('localStorage access failed, fallback to memory', err);
    }
  }

  resetToSeedData() {
    const seeds = generateSeedEvents();
    this.saveAll(seeds);
    return seeds;
  }

  getAllEvents() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(this.storageKey);
      const events = data ? JSON.parse(data) : [];
      return events.map(e => this.enrichEventWithStatus(e));
    } catch (err) {
      console.error('Failed to parse events from storage', err);
      return [];
    }
  }

  saveAll(events) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(events));
      }
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }

  addEvent(eventData) {
    const events = this.getAllEvents();
    const newEvent = {
      id: 'cp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...eventData
    };
    events.unshift(newEvent);
    this.saveAll(events);
    return this.enrichEventWithStatus(newEvent);
  }

  updateEvent(id, updatedFields) {
    const events = this.getAllEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedFields, updatedAt: new Date().toISOString() };
      this.saveAll(events);
      return this.enrichEventWithStatus(events[index]);
    }
    return null;
  }

  deleteEvent(id) {
    let events = this.getAllEvents();
    events = events.filter(e => e.id !== id);
    this.saveAll(events);
    return events;
  }

  getEventById(id) {
    const events = this.getAllEvents();
    return events.find(e => e.id === id) || null;
  }

  /**
   * Dynamically calculates status: Urgent, Upcoming, Expired, and Today
   * strictly using local client system timestamp.
   */
  enrichEventWithStatus(event) {
    const now = new Date();
    const todayStr = getLocalISODate(0);
    const eventDateStr = event.date || todayStr;
    const isToday = eventDateStr === todayStr;

    // Parse target date and time into local datetime
    let hours = 23;
    let minutes = 59;
    if (event.time) {
      const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
      }
    }

    const [y, m, d] = eventDateStr.split('-').map(Number);
    const eventDateTime = new Date(y, (m || 1) - 1, d || 1, hours, minutes, 0);

    const diffMs = eventDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let calculatedStatus = 'upcoming';
    let isUrgent = Boolean(event.urgent);

    if (diffMs < 0 && Math.abs(diffHours) > 3) {
      calculatedStatus = 'expired';
    } else if (isToday) {
      calculatedStatus = 'today';
      if (diffHours >= -3 && diffHours <= 24) {
        isUrgent = true;
      }
    } else if (diffHours > 0 && diffHours <= 48) {
      calculatedStatus = 'urgent';
      isUrgent = true;
    } else if (diffHours > 48) {
      calculatedStatus = 'upcoming';
    }

    // Force urgent if manually tagged and not expired
    if (event.urgent && calculatedStatus !== 'expired') {
      isUrgent = true;
      if (calculatedStatus === 'upcoming') {
        calculatedStatus = 'urgent';
      }
    }

    const relativeTime = this.formatRelativeTime(diffMs, isToday, event.date, event.time);

    return {
      ...event,
      calculatedStatus,
      isToday,
      isUrgent,
      relativeTime
    };
  }

  formatRelativeTime(diffMs, isToday, dateStr, timeStr) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      if (Math.abs(diffHours) < 24) return 'Earlier today';
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
    }

    if (isToday) {
      if (diffHours <= 0) return 'Happening right now!';
      if (diffHours === 1) return 'In ~1 hour today';
      return `Today in ~${diffHours} hrs`;
    }

    if (diffDays === 1) {
      return `Tomorrow (${timeStr || 'All Day'})`;
    }

    if (diffDays <= 7) {
      return `In ${diffDays} days (${dateStr})`;
    }

    return dateStr;
  }

  getTodayAttentionEvents() {
    const all = this.getAllEvents();
    return all.filter(e => (e.isToday || e.calculatedStatus === 'urgent') && e.calculatedStatus !== 'expired');
  }

  getStats() {
    const all = this.getAllEvents();
    const today = all.filter(e => e.isToday && e.calculatedStatus !== 'expired').length;
    const urgent = all.filter(e => e.calculatedStatus === 'urgent').length;
    const upcoming = all.filter(e => e.calculatedStatus === 'upcoming').length;
    const expired = all.filter(e => e.calculatedStatus === 'expired').length;

    return {
      total: all.length,
      today,
      urgent,
      upcoming,
      expired
    };
  }

  getApiKey() {
    try {
      return localStorage.getItem(this.apiKeyStorage) || '';
    } catch {
      return '';
    }
  }

  setApiKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem(this.apiKeyStorage, key.trim());
      } else {
        localStorage.removeItem(this.apiKeyStorage);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  hasApiKey() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  exportJSON() {
    const events = this.getAllEvents();
    return JSON.stringify(events, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.saveAll(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  }
}

const storage = new StorageService();

// ============================================================================
// 3. NOTICE PARSER ENGINE (REAL GEMINI AI + HONEST FALLBACK)
// ============================================================================
class NoticeParser {
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
          sourceLabel: 'Gemini 1.5 Flash AI',
          data: geminiResult
        };
      } catch (err) {
        console.warn('Gemini API call failed, safely falling back to rule-based parser:', err);
        const fallbackResult = this.parseWithRuleEngine(rawText.trim());
        return {
          source: 'fallback',
          sourceLabel: 'Rule-Based NLP Parser (Gemini API unavailable)',
          errorNote: err.message,
          data: fallbackResult
        };
      }
    }

    // Honest Fallback Mode
    const fallbackResult = this.parseWithRuleEngine(rawText.trim());
    return {
      source: 'fallback',
      sourceLabel: 'Rule-Based NLP Parser',
      data: fallbackResult
    };
  }

  static async parseWithGemini(rawText, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const prompt = `You are the Campus Pulse notice parser. Extract structured college event details from the raw notice below.
Return ONLY valid JSON matching this exact schema:
{
  "title": "Clear and concise event title",
  "category": "academic | exams | placements | clubs | admin | general",
  "date": "YYYY-MM-DD",
  "time": "HH:MM AM/PM or 'All Day'",
  "venue": "Exact room, hall, building or online link",
  "urgent": true/false,
  "summary": "A 1-2 sentence student-friendly summary highlighting key instructions"
}

Raw Notice:
"""
${rawText}
"""`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
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

    const cleanJson = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const todayStr = getLocalISODate(0);

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

  static parseWithRuleEngine(text) {
    const todayStr = getLocalISODate(0);
    const lower = text.toLowerCase();

    // 1. Extract Date
    let extractedDate = todayStr;
    if (lower.includes('tomorrow')) {
      extractedDate = getLocalISODate(1);
    } else if (lower.includes('today') || lower.includes('tonight')) {
      extractedDate = todayStr;
    } else {
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthRegex = new RegExp(`(?:(\\d{1,2})(?:st|nd|rd|th)?\\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+(\\d{1,2})?(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`, 'i');
      const match = text.match(monthRegex);

      if (match) {
        const monthIndex = monthNames.findIndex(m => match[2].toLowerCase().startsWith(m));
        const day = parseInt(match[1] || match[3] || '1', 10);
        const year = match[4] ? parseInt(match[4], 10) : new Date().getFullYear();
        if (monthIndex !== -1 && day >= 1 && day <= 31) {
          const parsedD = new Date(year, monthIndex, day);
          const y = parsedD.getFullYear();
          const m = String(parsedD.getMonth() + 1).padStart(2, '0');
          const d = String(parsedD.getDate()).padStart(2, '0');
          extractedDate = `${y}-${m}-${d}`;
        }
      } else {
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
    let extractedVenue = 'Campus Main Grounds';
    const venueRegex = /(?:venue|location|reporting at|room|hall|auditorium|audi|lab|oat|theatre|block|center|centre|portal)[\s:]+([^\n\r]+)/i;
    const venueMatch = text.match(venueRegex);
    if (venueMatch && venueMatch[1]) {
      let v = venueMatch[1].trim();
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

    // 4. Extract Category
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

// ============================================================================
// 4. WEEKLY AI SUMMARY ENGINE & .ICS EXPORTER
// ============================================================================
class SummaryService {
  static async generateWeeklySummary() {
    const events = storage.getAllEvents();
    if (!events || events.length === 0) {
      return {
        source: 'none',
        sourceLabel: 'Campus Pulse Engine',
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
          sourceLabel: 'Rule-Based Schedule Synthesizer (API unavailable)',
          markdown: fallback
        };
      }
    }

    const fallback = this.generateFallbackSummary(events);
    return {
      source: 'fallback',
      sourceLabel: 'Rule-Based Weekly Schedule Synthesizer',
      markdown: fallback
    };
  }

  static async generateWithGemini(events, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;
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
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 }
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
      lines.push(`✅ **TODAY'S STATUS:** No urgent deadlines due right now! You are ahead of schedule.`);
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

// ============================================================================
// 5. UI CONTROLLER & DOM RENDERING
// ============================================================================
class UI {
  static getIcon(name, size = 16) {
    const icons = {
      calendar: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      mapPin: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
      alert: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      sparkles: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
      check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      trash: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
      edit: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
      share: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
    };
    return icons[name] || '';
  }

  static renderStats() {
    const stats = storage.getStats();
    const hasKey = storage.hasApiKey();

    const elTotal = document.getElementById('statTotalEvents');
    const elToday = document.getElementById('statTodayEvents');
    const elUrgent = document.getElementById('statUrgentEvents');
    const elAiStatus = document.getElementById('statAiMode');

    if (elTotal) elTotal.textContent = stats.total;
    if (elToday) elToday.textContent = stats.today;
    if (elUrgent) elUrgent.textContent = stats.urgent;
    if (elAiStatus) {
      elAiStatus.textContent = hasKey ? 'Gemini 1.5' : 'Rule-Based';
    }

    // Synchronize Sidebar Counts
    const sAll = document.getElementById('sidebarCountAll');
    const sToday = document.getElementById('sidebarCountToday');
    const sUrgent = document.getElementById('sidebarCountUrgent');
    const sUpcoming = document.getElementById('sidebarCountUpcoming');
    const sEngine = document.getElementById('sidebarEngineStatus');

    if (sAll) sAll.textContent = stats.total;
    if (sToday) sToday.textContent = stats.today;
    if (sUrgent) sUrgent.textContent = stats.urgent;
    if (sUpcoming) sUpcoming.textContent = stats.upcoming;
    if (sEngine) {
      sEngine.textContent = hasKey ? 'Gemini 1.5 Active' : 'Rule-Based Active';
    }
  }

  static renderTodayAttention() {
    const container = document.getElementById('todayCardsGrid');
    const emptyState = document.getElementById('todayEmptyState');
    if (!container) return;

    const todayEvents = storage.getTodayAttentionEvents();

    if (todayEvents.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = todayEvents.map(event => `
      <div class="today-card" data-id="${event.id}">
        <div>
          <div class="today-card-meta">
            <span class="today-time-badge">
              ${UI.getIcon('clock', 13)} ${event.time || 'All Day'}
            </span>
            <span class="today-category-tag">${event.category}</span>
          </div>
          <h4 class="today-card-title">${event.title}</h4>
          <div class="today-card-venue">
            ${UI.getIcon('mapPin', 13)} ${event.venue || 'Campus Main'}
          </div>
        </div>
        <div class="today-card-footer">
          <span style="font-size:0.75rem; color:var(--cyan-secondary); font-weight:600;">
            ${event.relativeTime}
          </span>
          <div style="display:flex; gap:0.375rem;">
            <button type="button" class="btn-today-done btn-action-share" data-id="${event.id}" title="Share to WhatsApp">
              ${UI.getIcon('share', 13)}
            </button>
            <button type="button" class="btn-today-done btn-action-done" data-id="${event.id}" title="Dismiss / Mark Done">
              ${UI.getIcon('check', 13)} Done
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  static renderEventsList(filterStatus = 'all', filterCategory = 'all', searchQuery = '', sortBy = 'date', filterDate = '') {
    const grid = document.getElementById('eventsGrid');
    const emptyView = document.getElementById('eventsEmptyView');
    const countBadge = document.getElementById('eventsCountBadge');
    if (!grid) return;

    let events = storage.getAllEvents();

    // 1. Status Filter
    if (filterStatus === 'today') {
      events = events.filter(e => e.isToday && e.calculatedStatus !== 'expired');
    } else if (filterStatus === 'urgent') {
      events = events.filter(e => e.calculatedStatus === 'urgent' || (e.urgent && e.calculatedStatus !== 'expired'));
    } else if (filterStatus === 'upcoming') {
      events = events.filter(e => e.calculatedStatus === 'upcoming');
    } else if (filterStatus === 'expired') {
      events = events.filter(e => e.calculatedStatus === 'expired');
    }

    // 2. Category Filter
    if (filterCategory !== 'all') {
      events = events.filter(e => e.category === filterCategory);
    }

    // 3. Specific Date Picker Filter
    if (filterDate && filterDate.trim()) {
      events = events.filter(e => e.date === filterDate.trim());
    }

    // 4. Search Query Filter (Searches Title, Category, Venue, and Summary)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      events = events.filter(e => 
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.summary && e.summary.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))
      );
    }

    // 5. Sort Logic
    events.sort((a, b) => {
      if (sortBy === 'urgency') {
        const score = (item) => (item.calculatedStatus === 'urgent' ? 3 : item.isToday ? 2 : item.calculatedStatus === 'upcoming' ? 1 : 0);
        return score(b) - score(a);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    if (countBadge) countBadge.textContent = `${events.length} notice${events.length === 1 ? '' : 's'}`;

    if (events.length === 0) {
      grid.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';

    grid.innerHTML = events.map(event => UI.createEventCardHTML(event)).join('');
  }

  static createEventCardHTML(event) {
    const catConfig = CONFIG.CATEGORIES.find(c => c.id === event.category) || {
      label: event.category,
      class: 'cat-general'
    };

    let statusBadgeHTML = '';
    if (event.calculatedStatus === 'urgent') {
      statusBadgeHTML = `<span class="badge-status status-badge-urgent">${UI.getIcon('alert', 12)} Urgent Deadline</span>`;
    } else if (event.calculatedStatus === 'today') {
      statusBadgeHTML = `<span class="badge-status status-badge-today">${UI.getIcon('sparkles', 12)} Today's Notice</span>`;
    } else if (event.calculatedStatus === 'upcoming') {
      statusBadgeHTML = `<span class="badge-status status-badge-upcoming">${UI.getIcon('calendar', 12)} Upcoming</span>`;
    } else {
      statusBadgeHTML = `<span class="badge-status status-badge-expired">${UI.getIcon('clock', 12)} Expired</span>`;
    }

    const provenanceHTML = event.source === 'gemini' 
      ? `<span class="source-provenance-tag gemini">${UI.getIcon('sparkles', 11)} Gemini AI</span>`
      : `<span class="source-provenance-tag fallback">Rule-Based NLP</span>`;

    return `
      <article class="event-card status-${event.calculatedStatus}" data-id="${event.id}">
        <div class="card-top-row">
          <div class="card-badges-left">
            <span class="badge-category ${catConfig.class}">
              ${catConfig.label}
            </span>
            ${statusBadgeHTML}
          </div>
          ${provenanceHTML}
        </div>

        <h3 class="card-title">${event.title}</h3>
        <p class="card-summary">${event.summary || 'No additional summary provided.'}</p>

        <div class="card-details-list">
          <div class="detail-item">
            ${UI.getIcon('calendar', 14)}
            <span><strong>Date:</strong> ${event.date}</span>
          </div>
          <div class="detail-item time">
            ${UI.getIcon('clock', 14)}
            <span><strong>Time:</strong> ${event.time || 'All Day'}</span>
          </div>
          <div class="detail-item venue">
            ${UI.getIcon('mapPin', 14)}
            <span><strong>Venue:</strong> ${event.venue || 'Campus Main'}</span>
          </div>
        </div>

        <div class="card-footer">
          <span class="card-relative-time">${event.relativeTime}</span>
          <div class="card-actions-group">
            <button type="button" class="action-icon-btn btn-card-share" data-id="${event.id}" title="Share to WhatsApp">
              ${UI.getIcon('share', 15)}
            </button>
            <button type="button" class="action-icon-btn btn-card-edit" data-id="${event.id}" title="Edit Notice">
              ${UI.getIcon('edit', 15)}
            </button>
            <button type="button" class="action-icon-btn delete btn-card-delete" data-id="${event.id}" title="Delete Notice">
              ${UI.getIcon('trash', 15)}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Renders a real-time Preview Card inside the Smart Input Modal
   */
  static renderPreviewCard(data) {
    const cardContainer = document.getElementById('extractedPreviewCard');
    if (!cardContainer) return;

    const catConfig = CONFIG.CATEGORIES.find(c => c.id === data.category) || {
      label: data.category || 'General',
      class: 'cat-general'
    };

    const statusPill = data.urgent
      ? `<span class="badge-status status-badge-urgent">${UI.getIcon('alert', 12)} Urgent Deadline</span>`
      : `<span class="badge-status status-badge-upcoming">${UI.getIcon('calendar', 12)} Upcoming</span>`;

    cardContainer.innerHTML = `
      <div class="card-top-row">
        <div class="card-badges-left">
          <span class="badge-category ${catConfig.class}">${catConfig.label}</span>
          ${statusPill}
        </div>
        <span class="source-provenance-tag ${data.source === 'gemini' ? 'gemini' : 'fallback'}">
          ${data.source === 'gemini' ? '✨ Gemini AI' : '⚙️ Rule-Based NLP'}
        </span>
      </div>

      <h3 class="card-title" style="margin-top: 0.35rem;">${data.title || 'Untitled Event'}</h3>
      <p class="card-summary">${data.summary || 'Summary will appear here.'}</p>

      <div class="card-details-list" style="margin-bottom: 0.5rem;">
        <div class="detail-item">
          ${UI.getIcon('calendar', 14)}
          <span><strong>Date:</strong> ${data.date || 'YYYY-MM-DD'}</span>
        </div>
        <div class="detail-item time">
          ${UI.getIcon('clock', 14)}
          <span><strong>Time:</strong> ${data.time || 'All Day'}</span>
        </div>
        <div class="detail-item venue">
          ${UI.getIcon('mapPin', 14)}
          <span><strong>Venue:</strong> ${data.venue || 'Campus Main Grounds'}</span>
        </div>
      </div>
    `;
  }

  static renderNoticePresets() {
    const chipsContainer = document.getElementById('noticePresetChips');
    if (!chipsContainer) return;

    chipsContainer.innerHTML = SAMPLE_NOTICES.map((preset, index) => `
      <button type="button" class="preset-chip" data-preset-idx="${index}">
        ${preset.name}
      </button>
    `).join('');
  }

  static showToast(message, type = 'info', durationMs = 3200) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, durationMs);
  }

  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      const input = modal.querySelector('input, textarea');
      if (input) input.focus();
    }
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}

// ============================================================================
// 6. MAIN APPLICATION COORDINATOR
// ============================================================================
class CampusPulseApp {
  constructor() {
    this.currentFilterStatus = 'all';
    this.currentFilterCategory = 'all';
    this.currentFilterDate = '';
    this.currentSearchQuery = '';
    this.currentSortBy = 'date';
    this.editingEventId = null;
    this.lastExtractedData = null;
  }

  init() {
    this.renderAll();
    this.bindEvents();
    this.updateEngineIndicator();
    UI.renderNoticePresets();

    console.log('Campus Pulse SaaS initialized successfully. Ready.');
  }

  renderAll() {
    const dateLabel = document.getElementById('todayCurrentDateStr');
    if (dateLabel) {
      dateLabel.textContent = `Today: ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    // Sync sidebar status active class
    document.querySelectorAll('[data-sidebar-status]').forEach(link => {
      if (link.dataset.sidebarStatus === this.currentFilterStatus) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Sync toolbar tabs active class
    document.querySelectorAll('.tab-btn').forEach(tab => {
      if (tab.dataset.status === this.currentFilterStatus) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    UI.renderStats();
    UI.renderTodayAttention();
    UI.renderEventsList(
      this.currentFilterStatus,
      this.currentFilterCategory,
      this.currentSearchQuery,
      this.currentSortBy,
      this.currentFilterDate
    );
  }

  updateEngineIndicator() {
    const hasKey = storage.hasApiKey();
    const indicator = document.getElementById('engineStatusIndicator');
    if (indicator) {
      if (hasKey) {
        indicator.className = 'engine-status-pill gemini';
        indicator.innerHTML = `${UI.getIcon('sparkles', 14)} Google Gemini 1.5 Flash Active`;
      } else {
        indicator.className = 'engine-status-pill fallback';
        indicator.innerHTML = `⚙️ Rule-Based NLP Parser Active (Offline Mode)`;
      }
    }
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar && backdrop) {
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        this.closeMobileSidebar();
      } else {
        sidebar.classList.add('open');
        backdrop.classList.add('active');
      }
    }
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  bindEvents() {
    // 1. Open Modals & Quick Actions
    const openIngest = () => {
      this.resetIngestModal();
      UI.openModal('modalNoticeIngest');
    };

    document.getElementById('btnOpenIngest')?.addEventListener('click', openIngest);
    document.getElementById('btnHeroAddNotice')?.addEventListener('click', openIngest);

    const openSummary = () => {
      this.handleOpenWeeklySummary();
    };

    document.getElementById('btnOpenSummary')?.addEventListener('click', openSummary);
    document.getElementById('btnSidebarSummary')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileSidebar();
      openSummary();
    });

    const openSettings = () => {
      this.populateSettings();
      UI.openModal('modalSettings');
    };

    document.getElementById('btnOpenSettings')?.addEventListener('click', openSettings);
    document.getElementById('btnSidebarSettings')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileSidebar();
      openSettings();
    });

    // Mobile Sidebar Toggle
    document.getElementById('btnToggleMobileSidebar')?.addEventListener('click', () => {
      this.toggleMobileSidebar();
    });

    document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
      this.closeMobileSidebar();
    });

    // Sidebar Status Links Click
    document.querySelectorAll('[data-sidebar-status]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentFilterStatus = link.dataset.sidebarStatus;
        this.renderAll();
        this.closeMobileSidebar();
      });
    });

    // Sidebar Category Links Click
    document.querySelectorAll('[data-sidebar-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.sidebarCategory;
        this.currentFilterCategory = cat;
        const catSelect = document.getElementById('filterCategorySelect');
        if (catSelect) catSelect.value = cat;
        this.renderAll();
        this.closeMobileSidebar();
      });
    });

    // Topbar Search & Toolbar Search Box Synchronizer
    const topbarSearch = document.getElementById('topbarSearchInput');
    const searchInput = document.getElementById('searchInput');

    const handleSearchInput = (val) => {
      this.currentSearchQuery = val;
      if (topbarSearch && topbarSearch.value !== val) topbarSearch.value = val;
      if (searchInput && searchInput.value !== val) searchInput.value = val;
      this.renderAll();
    };

    topbarSearch?.addEventListener('input', (e) => handleSearchInput(e.target.value));
    searchInput?.addEventListener('input', (e) => handleSearchInput(e.target.value));

    // Specific Date Picker Filter
    const dateFilterInput = document.getElementById('filterDateInput');
    const btnResetDate = document.getElementById('btnResetDateFilter');

    dateFilterInput?.addEventListener('change', (e) => {
      this.currentFilterDate = e.target.value;
      if (btnResetDate) {
        btnResetDate.style.display = e.target.value ? 'inline-flex' : 'none';
      }
      this.renderAll();
    });

    btnResetDate?.addEventListener('click', () => {
      this.currentFilterDate = '';
      if (dateFilterInput) dateFilterInput.value = '';
      btnResetDate.style.display = 'none';
      this.renderAll();
    });

    // Close Modal Buttons & Overlay Clicks
    document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) UI.closeModal(modal.id);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          UI.closeModal(overlay.id);
        }
      });
    });

    // Notice Presets Chips
    document.getElementById('noticePresetChips')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.preset-chip');
      if (chip) {
        const idx = parseInt(chip.dataset.presetIdx, 10);
        const preset = SAMPLE_NOTICES[idx];
        if (preset) {
          const textarea = document.getElementById('rawNoticeInput');
          if (textarea) {
            textarea.value = preset.text;
            textarea.focus();
            const errAlert = document.getElementById('ingestErrorAlert');
            if (errAlert) errAlert.style.display = 'none';
            UI.showToast(`Loaded sample: "${preset.name}"`, 'info', 2000);
          }
        }
      }
    });

    // Smart Notice Extraction Trigger
    document.getElementById('btnExtractNotice')?.addEventListener('click', () => {
      this.handleExtractNotice();
    });

    // Save Extracted Notice (handles both btnSaveEvent and btnSaveNotice)
    const saveHandler = () => this.handleSaveNotice();
    document.getElementById('btnSaveEvent')?.addEventListener('click', saveHandler);
    document.getElementById('btnSaveNotice')?.addEventListener('click', saveHandler);

    // Live Preview Card Form Updaters (Updates the preview card as user types in review fields)
    const reviewInputs = [
      'inputEventTitle', 'inputEventCategory', 'inputEventDate',
      'inputEventTime', 'inputEventVenue', 'inputEventSummary', 'inputEventUrgent'
    ];
    reviewInputs.forEach(inputId => {
      const el = document.getElementById(inputId);
      el?.addEventListener('input', () => this.syncPreviewCardFromForm());
      el?.addEventListener('change', () => this.syncPreviewCardFromForm());
    });

    // Status Filter Tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilterStatus = tab.dataset.status;
        this.renderAll();
      });
    });

    // Category Filter Dropdown
    document.getElementById('filterCategorySelect')?.addEventListener('change', (e) => {
      this.currentFilterCategory = e.target.value;
      this.renderAll();
    });

    // Sort Dropdown
    document.getElementById('sortBySelect')?.addEventListener('change', (e) => {
      this.currentSortBy = e.target.value;
      this.renderAll();
    });

    // Card Actions Delegate (Edit, Delete, Share)
    document.getElementById('eventsGrid')?.addEventListener('click', (e) => {
      const btnDelete = e.target.closest('.btn-card-delete');
      const btnEdit = e.target.closest('.btn-card-edit');
      const btnShare = e.target.closest('.btn-card-share');

      if (btnDelete) {
        const id = btnDelete.dataset.id;
        this.handleDeleteEvent(id);
      } else if (btnEdit) {
        const id = btnEdit.dataset.id;
        this.handleEditEvent(id);
      } else if (btnShare) {
        const id = btnShare.dataset.id;
        this.handleShareEvent(id);
      }
    });

    // Today Attention Card Actions Delegate (Done, Share)
    document.getElementById('todayCardsGrid')?.addEventListener('click', (e) => {
      const btnDone = e.target.closest('.btn-action-done');
      const btnShare = e.target.closest('.btn-action-share');

      if (btnDone) {
        const id = btnDone.dataset.id;
        this.handleMarkDone(id);
      } else if (btnShare) {
        const id = btnShare.dataset.id;
        this.handleShareEvent(id);
      }
    });

    // Weekly Summary Actions
    document.getElementById('btnRegenerateSummary')?.addEventListener('click', () => {
      this.handleOpenWeeklySummary();
    });

    document.getElementById('btnCopySummaryWhatsApp')?.addEventListener('click', () => {
      this.handleCopySummaryWhatsApp();
    });

    document.getElementById('btnDownloadCalendarICS')?.addEventListener('click', () => {
      this.handleDownloadICS();
    });

    // Settings Actions
    document.getElementById('btnSaveApiKey')?.addEventListener('click', () => {
      const input = document.getElementById('apiKeyInput');
      const key = input ? input.value.trim() : '';
      storage.setApiKey(key);
      this.updateEngineIndicator();
      this.renderAll();
      UI.showToast(key ? 'Gemini API key saved!' : 'API key cleared. Switched to offline parser.', 'success');
      UI.closeModal('modalSettings');
    });

    document.getElementById('btnTestApiKey')?.addEventListener('click', () => {
      this.handleTestApiKey();
    });

    document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
      if (confirm('Reset all notices to default realistic college sample events?')) {
        storage.resetToSeedData();
        this.renderAll();
        UI.showToast('Demo notices restored successfully!', 'success');
        UI.closeModal('modalSettings');
      }
    });

    document.getElementById('btnExportJSON')?.addEventListener('click', () => {
      const json = storage.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campus_pulse_export_${getLocalISODate(0)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      UI.showToast('Notices exported as JSON file', 'info');
    });

    document.getElementById('btnImportJSON')?.addEventListener('click', () => {
      const fileInput = document.getElementById('importFileInput');
      fileInput?.click();
    });

    document.getElementById('importFileInput')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const success = storage.importJSON(event.target.result);
          if (success) {
            this.renderAll();
            UI.showToast('Notices imported successfully!', 'success');
            UI.closeModal('modalSettings');
          } else {
            UI.showToast('Invalid JSON file format', 'urgent');
          }
        };
        reader.readAsText(file);
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) UI.closeModal(openModal.id);
      }
      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openIngest();
      }
    });
  }

  resetIngestModal() {
    this.editingEventId = null;
    this.lastExtractedData = null;

    const modalTitle = document.getElementById('ingestModalTitle');
    if (modalTitle) modalTitle.textContent = 'Smart Notice Input';

    const rawInput = document.getElementById('rawNoticeInput');
    if (rawInput) rawInput.value = '';

    const errAlert = document.getElementById('ingestErrorAlert');
    if (errAlert) errAlert.style.display = 'none';

    const previewWrap = document.getElementById('extractedPreviewWrapper');
    if (previewWrap) previewWrap.style.display = 'none';

    const reviewSection = document.getElementById('extractedReviewSection');
    if (reviewSection) reviewSection.style.display = 'none';

    document.getElementById('inputEventTitle').value = '';
    document.getElementById('inputEventCategory').value = 'general';
    document.getElementById('inputEventDate').value = getLocalISODate(0);
    document.getElementById('inputEventTime').value = '10:00 AM';
    document.getElementById('inputEventVenue').value = '';
    document.getElementById('inputEventUrgent').checked = false;
    document.getElementById('inputEventSummary').value = '';
  }

  syncPreviewCardFromForm() {
    const title = document.getElementById('inputEventTitle')?.value || '';
    const category = document.getElementById('inputEventCategory')?.value || 'general';
    const date = document.getElementById('inputEventDate')?.value || '';
    const time = document.getElementById('inputEventTime')?.value || '';
    const venue = document.getElementById('inputEventVenue')?.value || '';
    const urgent = document.getElementById('inputEventUrgent')?.checked || false;
    const summary = document.getElementById('inputEventSummary')?.value || '';

    UI.renderPreviewCard({
      title,
      category,
      date,
      time,
      venue,
      urgent,
      summary,
      source: this.lastExtractedData ? this.lastExtractedData.source : 'fallback'
    });
  }

  async handleExtractNotice() {
    const rawInput = document.getElementById('rawNoticeInput');
    const text = rawInput ? rawInput.value.trim() : '';
    const errAlert = document.getElementById('ingestErrorAlert');

    if (!text) {
      if (errAlert) {
        errAlert.innerHTML = '<span>⚠️ Notice text cannot be empty! Paste a message or pick a sample notice above.</span>';
        errAlert.style.display = 'flex';
      }
      UI.showToast('Please paste a college notice or select a sample notice first.', 'urgent');
      rawInput?.focus();
      return;
    }

    if (errAlert) errAlert.style.display = 'none';

    const btn = document.getElementById('btnExtractNotice');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Extracting details...`;

    try {
      const result = await NoticeParser.parseNotice(text);
      this.lastExtractedData = result;

      // Populate review form fields
      document.getElementById('inputEventTitle').value = result.data.title;
      document.getElementById('inputEventCategory').value = result.data.category;
      document.getElementById('inputEventDate').value = result.data.date;
      document.getElementById('inputEventTime').value = result.data.time;
      document.getElementById('inputEventVenue').value = result.data.venue;
      document.getElementById('inputEventUrgent').checked = result.data.urgent;
      document.getElementById('inputEventSummary').value = result.data.summary;

      // Render the Extracted Preview Card
      UI.renderPreviewCard({
        ...result.data,
        source: result.source
      });

      const previewWrap = document.getElementById('extractedPreviewWrapper');
      if (previewWrap) previewWrap.style.display = 'flex';

      const reviewSection = document.getElementById('extractedReviewSection');
      if (reviewSection) {
        reviewSection.style.display = 'flex';
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const provenanceBadge = document.getElementById('extractionProvenanceBadge');
      if (provenanceBadge) {
        provenanceBadge.textContent = result.sourceLabel;
        provenanceBadge.className = result.source === 'gemini' 
          ? 'source-provenance-tag gemini' 
          : 'source-provenance-tag fallback';
      }

      UI.showToast(`Details extracted successfully via ${result.source === 'gemini' ? 'Gemini AI' : 'Rule-Based Engine'}!`, 'success');
    } catch (err) {
      if (errAlert) {
        errAlert.innerHTML = `<span>⚠️ ${err.message}</span>`;
        errAlert.style.display = 'flex';
      }
      UI.showToast(`Extraction error: ${err.message}`, 'urgent');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  handleSaveNotice() {
    const title = document.getElementById('inputEventTitle')?.value.trim();
    const category = document.getElementById('inputEventCategory')?.value;
    const date = document.getElementById('inputEventDate')?.value;
    const time = document.getElementById('inputEventTime')?.value.trim();
    const venue = document.getElementById('inputEventVenue')?.value.trim();
    const urgent = document.getElementById('inputEventUrgent')?.checked;
    const summary = document.getElementById('inputEventSummary')?.value.trim();
    const rawNotice = document.getElementById('rawNoticeInput')?.value.trim() || '';
    const errAlert = document.getElementById('ingestErrorAlert');

    if (!title) {
      if (errAlert) {
        errAlert.innerHTML = '<span>⚠️ Please provide an event title before saving.</span>';
        errAlert.style.display = 'flex';
      }
      UI.showToast('Please provide an event title.', 'urgent');
      document.getElementById('inputEventTitle')?.focus();
      return;
    }
    if (!date) {
      if (errAlert) {
        errAlert.innerHTML = '<span>⚠️ Please select a valid event date before saving.</span>';
        errAlert.style.display = 'flex';
      }
      UI.showToast('Please select a valid event date.', 'urgent');
      document.getElementById('inputEventDate')?.focus();
      return;
    }

    if (errAlert) errAlert.style.display = 'none';

    const payload = {
      title,
      category,
      date,
      time: time || 'All Day',
      venue: venue || 'Campus Main Grounds',
      urgent: Boolean(urgent),
      summary: summary || title,
      rawNotice,
      source: this.lastExtractedData ? this.lastExtractedData.source : 'fallback'
    };

    if (this.editingEventId) {
      storage.updateEvent(this.editingEventId, payload);
      UI.showToast(`Updated "${title}"`, 'success');
    } else {
      storage.addEvent(payload);
      UI.showToast(`Saved "${title}" to Campus Pulse!`, 'success');
    }

    this.renderAll();
    UI.closeModal('modalNoticeIngest');
  }

  handleEditEvent(id) {
    const event = storage.getEventById(id);
    if (!event) return;

    this.editingEventId = id;
    this.lastExtractedData = { source: event.source || 'fallback' };

    const modalTitle = document.getElementById('ingestModalTitle');
    if (modalTitle) modalTitle.textContent = 'Edit Campus Notice';

    document.getElementById('rawNoticeInput').value = event.rawNotice || event.summary || '';
    document.getElementById('inputEventTitle').value = event.title;
    document.getElementById('inputEventCategory').value = event.category;
    document.getElementById('inputEventDate').value = event.date;
    document.getElementById('inputEventTime').value = event.time || '';
    document.getElementById('inputEventVenue').value = event.venue || '';
    document.getElementById('inputEventUrgent').checked = Boolean(event.urgent);
    document.getElementById('inputEventSummary').value = event.summary || '';

    // Render Preview Card
    UI.renderPreviewCard({
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      urgent: event.urgent,
      summary: event.summary,
      source: event.source
    });

    const previewWrap = document.getElementById('extractedPreviewWrapper');
    if (previewWrap) previewWrap.style.display = 'flex';

    const reviewSection = document.getElementById('extractedReviewSection');
    if (reviewSection) reviewSection.style.display = 'flex';

    UI.openModal('modalNoticeIngest');
  }

  handleDeleteEvent(id) {
    const event = storage.getEventById(id);
    if (confirm(`Are you sure you want to remove "${event ? event.title : 'this notice'}"?`)) {
      storage.deleteEvent(id);
      this.renderAll();
      UI.showToast('Notice removed.', 'info');
    }
  }

  handleMarkDone(id) {
    const event = storage.getEventById(id);
    storage.updateEvent(id, { urgent: false });
    this.renderAll();
    UI.showToast(`Marked "${event?.title || 'Notice'}" as completed for today.`, 'success');
  }

  handleShareEvent(id) {
    const event = storage.getEventById(id);
    if (!event) return;

    const message = `📢 *${event.title}*\n` +
      `📅 *Date:* ${event.date} (${event.time})\n` +
      `📍 *Venue:* ${event.venue}\n` +
      `ℹ️ ${event.summary}\n\n` +
      `Organised via *Campus Pulse* 🚀`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => {
          UI.showToast('Notice formatted & copied for WhatsApp!', 'success');
        })
        .catch(() => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
        });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    }
  }

  async handleOpenWeeklySummary() {
    UI.openModal('modalWeeklySummary');
    const contentBox = document.getElementById('summaryContent');
    const badge = document.getElementById('summaryProvenanceBadge');

    if (contentBox) {
      contentBox.innerHTML = `<div style="text-align:center; padding:2rem;"><span class="spinner"></span> Synthesizing weekly campus briefing...</div>`;
    }

    try {
      const summaryResult = await SummaryService.generateWeeklySummary();
      if (contentBox) {
        contentBox.textContent = summaryResult.markdown;
      }
      if (badge) {
        badge.textContent = summaryResult.sourceLabel || 'Summary Engine';
      }
    } catch (err) {
      if (contentBox) {
        contentBox.textContent = `Unable to generate summary: ${err.message}`;
      }
    }
  }

  handleCopySummaryWhatsApp() {
    const content = document.getElementById('summaryContent')?.textContent;
    if (!content) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        UI.showToast('Weekly digest copied to clipboard!', 'success');
      });
    }
  }

  handleDownloadICS() {
    const events = storage.getAllEvents();
    const icsData = SummaryService.generateICS(events);

    if (!icsData) {
      UI.showToast('No active events to export.', 'urgent');
      return;
    }

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campus_Pulse_Schedule_${getLocalISODate(0)}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    UI.showToast('Calendar .ics file downloaded! Ready to import.', 'success');
  }

  populateSettings() {
    const input = document.getElementById('apiKeyInput');
    if (input) {
      input.value = storage.getApiKey();
    }
  }

  async handleTestApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input ? input.value.trim() : '';
    if (!key) {
      UI.showToast('Please enter an API key to test.', 'urgent');
      return;
    }

    const btn = document.getElementById('btnTestApiKey');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Testing...`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.DEFAULT_GEMINI_MODEL}?key=${key}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        UI.showToast('Key valid! Google Gemini connected.', 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        UI.showToast(`Key error: ${errData.error?.message || 'Unauthorized'}`, 'urgent');
      }
    } catch (e) {
      UI.showToast(`Connection failed: ${e.message}`, 'urgent');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

// ============================================================================
// 7. ROBUST INSTANT BOOTSTRAPPER (Fires regardless of DOM timing or protocol)
// ============================================================================
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.storage = storage;
  window.NoticeParser = NoticeParser;
  window.SummaryService = SummaryService;
  window.UI = UI;
  window.SAMPLE_NOTICES = SAMPLE_NOTICES;
}

function bootCampusPulse() {
  if (!window.CampusPulse) {
    window.CampusPulse = new CampusPulseApp();
    window.CampusPulse.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCampusPulse);
} else {
  bootCampusPulse();
}
