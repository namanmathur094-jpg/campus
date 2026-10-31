/**
 * Campus Pulse - Application Configuration & Seed Data
 * Color Theme: Deep Navy (#172554), Blue (#2563EB), Light Grey (#F8FAFC), Teal (#14B8A6)
 */

export const CONFIG = {
  APP_NAME: 'Campus Pulse',
  VERSION: '1.0.0-buildathon',
  STORAGE_KEYS: {
    EVENTS: 'campus_pulse_events_v2',
    API_KEY: 'campus_pulse_gemini_api_key_v2',
    SETTINGS: 'campus_pulse_settings_v2'
  },
  DEFAULT_GEMINI_MODEL: 'gemini-1.5-flash',
  CATEGORIES: [
    { id: 'academic', label: 'Academic & Courses', class: 'cat-academic', icon: 'book' },
    { id: 'exams', label: 'Exams & Quizzes', class: 'cat-exams', icon: 'alert-triangle' },
    { id: 'placements', label: 'Placements & Career', class: 'cat-placements', icon: 'briefcase' },
    { id: 'clubs', label: 'Clubs & Hackathons', class: 'cat-clubs', icon: 'zap' },
    { id: 'admin', label: 'Administrative & Fees', class: 'cat-admin', icon: 'file-text' },
    { id: 'general', label: 'General Campus', class: 'cat-general', icon: 'info' }
  ]
};

// Generates realistic dates relative to today's date so demo is always live and accurate
export function generateSeedEvents() {
  const now = new Date();
  
  // Helpers to create ISO date strings relative to today
  const getRelativeDateStr = (daysOffset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  const todayStr = getRelativeDateStr(0);
  const tomorrowStr = getRelativeDateStr(1);
  const inThreeDaysStr = getRelativeDateStr(3);
  const inFiveDaysStr = getRelativeDateStr(5);
  const yesterdayStr = getRelativeDateStr(-2);

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

// WhatsApp notices students frequently copy-paste (for 1-click test in demo)
export const SAMPLE_NOTICES = [
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
