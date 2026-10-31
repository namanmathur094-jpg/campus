/**
 * Campus Pulse - UI Controller & DOM Rendering Engine
 * Handles premium dark SaaS event card generation, filters, modal popups, and toast feedback.
 */

import { CONFIG, SAMPLE_NOTICES } from './config.js';
import { storage } from './storage.js';

export class UI {
  // SVG Icon helper for crisp zero-dependency icons
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

  /**
   * Render Stats Cards & Synchronize Sidebar Counts
   */
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

    // Sidebar Counters
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

  /**
   * Render Today's Attention Radar Section
   */
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
            <button class="btn-today-done btn-action-share" data-id="${event.id}" title="Share to WhatsApp">
              ${UI.getIcon('share', 13)}
            </button>
            <button class="btn-today-done btn-action-done" data-id="${event.id}" title="Dismiss / Mark Done">
              ${UI.getIcon('check', 13)} Done
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render Main Event Grid with Search and Filter applied
   */
  static renderEventsList(filterStatus = 'all', filterCategory = 'all', searchQuery = '', sortBy = 'date') {
    const grid = document.getElementById('eventsGrid');
    const emptyView = document.getElementById('eventsEmptyView');
    const countBadge = document.getElementById('eventsCountBadge');
    if (!grid) return;

    let events = storage.getAllEvents();

    // 1. Filter by Status
    if (filterStatus === 'today') {
      events = events.filter(e => e.isToday && e.calculatedStatus !== 'expired');
    } else if (filterStatus === 'urgent') {
      events = events.filter(e => e.calculatedStatus === 'urgent' || (e.urgent && e.calculatedStatus !== 'expired'));
    } else if (filterStatus === 'upcoming') {
      events = events.filter(e => e.calculatedStatus === 'upcoming');
    } else if (filterStatus === 'expired') {
      events = events.filter(e => e.calculatedStatus === 'expired');
    }

    // 2. Filter by Category
    if (filterCategory !== 'all') {
      events = events.filter(e => e.category === filterCategory);
    }

    // 3. Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      events = events.filter(e => 
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.summary && e.summary.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))
      );
    }

    // 4. Sort logic
    events.sort((a, b) => {
      if (sortBy === 'urgency') {
        const score = (item) => (item.calculatedStatus === 'urgent' ? 3 : item.isToday ? 2 : item.calculatedStatus === 'upcoming' ? 1 : 0);
        return score(b) - score(a);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        // Default: Date ascending
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

  /**
   * Builds single Premium Event Card HTML
   */
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
            <button class="action-icon-btn btn-card-share" data-id="${event.id}" title="Share to WhatsApp">
              ${UI.getIcon('share', 15)}
            </button>
            <button class="action-icon-btn btn-card-edit" data-id="${event.id}" title="Edit Notice">
              ${UI.getIcon('edit', 15)}
            </button>
            <button class="action-icon-btn delete btn-card-delete" data-id="${event.id}" title="Delete Notice">
              ${UI.getIcon('trash', 15)}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Render Sample Notice Quick Buttons
   */
  static renderNoticePresets() {
    const chipsContainer = document.getElementById('noticePresetChips');
    if (!chipsContainer) return;

    chipsContainer.innerHTML = SAMPLE_NOTICES.map((preset, index) => `
      <button type="button" class="preset-chip" data-preset-idx="${index}">
        ${preset.name}
      </button>
    `).join('');
  }

  /**
   * Show Toast Notification
   */
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
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, durationMs);
  }

  /**
   * Open and Close Modal Helpers
   */
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
