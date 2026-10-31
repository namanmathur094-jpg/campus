/**
 * Campus Pulse - Storage & Status Computation Engine
 * Manages localStorage, dynamic priority status, and CRUD operations.
 */

import { CONFIG, generateSeedEvents } from './config.js';

export class StorageService {
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
      localStorage.setItem(this.storageKey, JSON.stringify(events));
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
   * based on the current local system timestamp.
   */
  enrichEventWithStatus(event) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Parse event date
    const eventDateStr = event.date || todayStr;
    const isToday = eventDateStr === todayStr;

    // Create target datetime approximation for comparison
    let eventDateTime = new Date(eventDateStr + 'T23:59:59');
    if (event.time) {
      const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        eventDateTime = new Date(eventDateStr);
        eventDateTime.setHours(hours, minutes, 0, 0);
      }
    }

    const diffMs = eventDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let calculatedStatus = 'upcoming';
    let isUrgent = Boolean(event.urgent);

    if (diffMs < 0 && Math.abs(diffHours) > 3) {
      calculatedStatus = 'expired';
    } else if (isToday) {
      calculatedStatus = 'today';
      // If it's today and within 12 hours, it's also urgent
      if (diffHours >= -3 && diffHours <= 24) {
        isUrgent = true;
      }
    } else if (diffHours > 0 && diffHours <= 48) {
      calculatedStatus = 'urgent';
      isUrgent = true;
    } else if (diffHours > 48) {
      calculatedStatus = 'upcoming';
    }

    // Relative Time String for UX
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
    // Return events that are marked today, or urgent (<48h) and not expired
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

  // API Key Accessors
  getApiKey() {
    return localStorage.getItem(this.apiKeyStorage) || '';
  }

  setApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(this.apiKeyStorage, key.trim());
    } else {
      localStorage.removeItem(this.apiKeyStorage);
    }
  }

  hasApiKey() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  // Backup & Restore
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

export const storage = new StorageService();
