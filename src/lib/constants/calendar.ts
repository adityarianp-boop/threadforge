export type ScheduleItem = { day: string; topic: string; type: string; color: string; date: number };

export const calendarConfig = {
  year: 2026,
  monthIndex: 4,
  monthLabel: { en: "May 2026", id: "Mei 2026" },
  weekdayLabels: {
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    id: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
  },
  today: 8,
  postDays: [8, 11, 13, 15, 18, 20, 22, 25]
} as const;

export const scheduleData: ScheduleItem[] = [
  { day: "Jumat, 8 Mei", topic: "Kenapa ROAS tinggi belum tentu bisnis untung", type: "Insight Post", color: "#7F77DD", date: 8 },
  { day: "Senin, 11 Mei", topic: "Story: klien yang buang 20 juta karena landing page bocor", type: "Real Story", color: "#1D9E75", date: 11 },
  { day: "Rabu, 13 Mei", topic: "Myth: yang penting traffic dulu", type: "Myth Busting", color: "#D85A30", date: 13 },
  { day: "Jumat, 15 Mei", topic: "5 hal yang saya cek sebelum naikkan budget ads", type: "Practical Tips", color: "#BA7517", date: 15 },
  { day: "Senin, 18 Mei", topic: "Hot take: funnel itu bukan sains, itu seni", type: "Hot Take", color: "#D4537E", date: 18 }
];
