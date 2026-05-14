import { Card } from "@/components/shared/card";
import { calendarConfig, scheduleData } from "@/lib/constants/calendar";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CalendarPage() {
  const locale = (await getLocale()) as "en" | "id";
  const t = await getTranslations("calendar");

  const firstDay = (new Date(calendarConfig.year, calendarConfig.monthIndex, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= 31; day += 1) cells.push(day);

  return (
    <div className="space-y-4">
      <Card>
        <p className="mb-3 text-sm text-textSecondary">{calendarConfig.monthLabel[locale]}</p>
        <div className="grid grid-cols-7 gap-1">
          {calendarConfig.weekdayLabels[locale].map((day) => (
            <p key={day} className="text-center text-xs text-textSecondary">{day}</p>
          ))}
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
            const hasPost = (calendarConfig.postDays as readonly number[]).includes(day);
            const isToday = day === calendarConfig.today;
            return (
              <div key={day} className={`flex aspect-square items-center justify-center rounded-md border text-xs ${hasPost ? "border-borderSoft bg-surfaceSecondary" : "border-transparent"} ${isToday ? "ring-1 ring-accent" : ""}`}>
                {day}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-textSecondary">{t("weekPlan")}</p>
        {scheduleData.map((item) => (
          <Card key={item.day} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full" style={{ background: item.color }} />
            <div>
              <p className="text-xs text-textSecondary">{item.day}</p>
              <p className="text-sm font-medium">{item.topic}</p>
              <p className="text-xs text-textSecondary">{item.type}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
