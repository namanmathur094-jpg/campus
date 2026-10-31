# 🎓 Campus Pulse

> **Smart Campus Notice Board & Event Hub**  
> *Built for the 3-Hour AI Buildathon*

---

## 💡 The Problem & Our Solution

### The Problem
College students receive critical campus circulars, assignment deadlines, placement drives, and club events scattered across dozens of unorganized WhatsApp groups, official circulars, and email threads. Important updates are buried under casual chats, leading to missed deadlines and registration cutoffs.

### The Solution: Campus Pulse
A centralised, zero-friction web dashboard where students can paste any messy WhatsApp message or official circular. **Campus Pulse automatically extracts**:
- **Event Title**
- **Date & Time**
- **Venue / Platform**
- **Category** (*Academic, Exams, Placements, Clubs & Hackathons, Administrative*)
- **Urgency Level** (*Urgent <48h, Today, Upcoming, Expired*)
- **1-2 sentence student summary**

---

## 🎨 Premium AI SaaS Color Palette & Design System

The application features a modern dark theme inspired by linear and modern AI SaaS dashboards:
- **Main Background (`#0B1020`)**: Deep void dark space with subtle atmospheric purple/cyan glow.
- **Sidebar (`#111827`)**: Solid high-contrast navigation column with active status pills.
- **Card Background (`#171F38`)**: Elevated dark card surface with glowing borders on hover.
- **Primary Accent (`#7C3AED`)**: Electric Violet for primary buttons, active badges, and focus rings.
- **Secondary Accent (`#22D3EE`)**: Cyan for live radar indicators, timing badges, and highlights.
- **Highlight (`#A78BFA`)**: Light violet for category icons, sparkle accents, and tags.
- **Main Text (`#F8FAFC`)**: High-contrast crisp white typography.
- **Secondary Text (`#94A3B8`)**: Readable muted slate for metadata, venues, and descriptions.

---

## 🚀 How to Run the App

Because Campus Pulse uses standard ES6+ modular JavaScript:

### Method 1: Instant 1-Click Launch (Windows)
Double-click **`start.bat`** in the project folder.  
It will automatically open your default browser to `http://localhost:8000`.

### Method 2: Python Command Line
Open terminal/PowerShell in this folder and run:
```bash
python -m http.server 8000
```
Then visit: [http://localhost:8000](http://localhost:8000)

### Method 3: Node / npx
```bash
npx serve .
```

---

## 🌟 Core Features & Implementation Details

### 1. Smart Input & Provenance (Real AI + Honest Fallback)
- **Real Gemini AI**: Paste your Google Gemini API key in the **Settings (⚙️)** modal to unlock real Google Gemini 1.5 Flash extraction and weekly synthesis.
- **Honest Fallback (Zero Fake AI)**: When no API key is provided, the app uses an offline, deterministic regex & NLP engine to extract dates, times, venues, and categories.
- **Clear Attribution**: Every notice card explicitly displays whether it was parsed by **"Gemini AI"** or **"Rule-Based NLP"**.

### 2. Today's Attention Hero Section
- Highlights events due today and urgent deadlines occurring within the next 48 hours.
- Displays relative countdowns (e.g. *Today in ~2 hrs*, *Tomorrow*).
- Features quick actions: **"Done"** (dismiss for today) and **"Share to WhatsApp"** (formatted message with emojis).

### 3. Organised View & Filters
- **Real-Time Search**: Instant filtering by keywords, title, venue, and description.
- **Status Filter Tabs**: *All Notices*, *⭐ Today*, *🚨 Urgent (<48h)*, *📅 Upcoming*, *⏰ Expired*.
- **Category Filter**: *Academic*, *Exams*, *Placements*, *Clubs & Hackathons*, *Administrative*, *General*.
- **Sorting Options**: Nearest Date First, High Urgency First, Alphabetical.

### 4. Weekly AI Summary
- Generates an executive campus briefing grouping high-priority deadlines, exams, and activities for the week.
- **1-Click WhatsApp Copy**: Formats the weekly digest with WhatsApp markdown (`*bold*`, emojis) ready to forward into class groups.
- **.ics Calendar Sync**: 1-click download of RFC 5545 `.ics` file that imports all events directly into Google Calendar, Apple Calendar, or Outlook.

### 5. LocalStorage & Portability
- All events and preferences persist in browser `localStorage`.
- Includes **"Export JSON"** and **"Import JSON"** in Settings for seamless team sharing and backup.
- **"Restore Sample Notices"** button for quick re-demonstration during judging.

---

## 📂 Project Architecture

```
Campus/
├── index.html          # Semantic HTML5 layout, modals, accessible dialogs
├── start.bat           # 1-click launch script for Windows
├── css/
│   └── style.css       # Design tokens (#172554, #2563EB, #F8FAFC, #14B8A6), responsive styles
├── js/
│   ├── config.js       # App constants, categories, sample WhatsApp notices
│   ├── storage.js      # LocalStorage CRUD, dynamic status computer, relative dates
│   ├── parser.js       # Gemini 1.5 Flash API + Honest Rule-Based NLP engine
│   ├── summary.js      # Weekly AI digest generator & .ics calendar compiler
│   ├── ui.js           # DOM rendering, cards, modals, toast feedback system
│   └── app.js          # App lifecycle, event listeners, keyboard shortcuts
└── README.md           # Documentation, pitch & setup guide
```

---

## ⏱️ Buildathon Demo Script (2-Minute Walkthrough)

1. **Overview**: Show the clean, responsive dashboard in Deep Navy `#172554` and Blue `#2563EB`. Point out the pre-seeded realistic notices (*Hackathon deadline, Mid-term exam, Google Placement talk*).
2. **Today's Attention**: Point to the top radar banner showing events requiring immediate action today. Click the checkmark to mark an item done.
3. **Smart Ingest (1-Click Test)**: Click **"+ Paste Notice"** (or press keyboard key `N`). Click one of the WhatsApp sample chips (e.g. *WhatsApp: Hackathon Call*). Click **"Extract Event Details"**.
4. **Transparency**: Point out the extraction provenance badge (`Rule-Based NLP` or `Gemini AI`). Edit any field if desired, then click **"Save to Board"**. The card immediately appears in the list with calculated status and relative time.
5. **Weekly AI Summary**: Click **"Weekly AI Summary"**. Show the structured student digest. Click **"Copy for WhatsApp Class Groups"** or **"Download .ics Calendar File"**.
6. **Search & Filter**: Type `"audi"` or click the **"Exams"** category pill to demonstrate instantaneous real-time filtering.
