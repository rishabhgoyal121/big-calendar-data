"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { useCalendar } from "../contexts/calendar-context";
import { CalendarView } from "../interfaces/calendar";
import { cn } from "@/lib/utils";
import { getEventColorClass } from "../helpers/calendar-helpers";

interface ClientContainerProps {
  view: CalendarView;
}

export function ClientContainer({ view = "month" }: ClientContainerProps) {
  const { selectedDate, events, selectedUserId, badgeVariant } = useCalendar();
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    if (view === "month") {
      // Get all days in the selected month
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      setCalendarDays(days);
    }
  }, [selectedDate, view]);

  // Filter events based on selected user and current view
  const filteredEvents = events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    // Filter by selected user if a user is selected
    if (selectedUserId && event.user.id !== selectedUserId) {
      return false;
    }

    // For month view, only show events in the current month
    if (view === "month") {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);

      // Check if the event intersects with the current month
      return eventStart <= monthEnd && eventEnd >= monthStart;
    }

    return true;
  });

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        day >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
        day <= new Date(eventEnd.setHours(23, 59, 59, 999))
      );
    });
  };

  // Helper function to map event color to status type
  const mapColorToStatusType = (color: string): string => {
    // Map color names to status types
    const colorToStatusMap: Record<string, string> = {
      red: "rejected",
      yellow: "pending",
      purple: "sick",
      green: "casual",
      blue: "wfh",
      orange: "compensatory",
    };

    return colorToStatusMap[color] || "pending"; // Default to pending if color not found
  };

  const renderMonthView = () => {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="text-xl font-bold mb-4">
          {format(selectedDate, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-28 border rounded-md p-1",
                  isToday(day) ? "bg-accent/20" : ""
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday(day) ? "text-primary" : ""
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const statusType = mapColorToStatusType(event.color);
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1 py-0.5 rounded truncate",
                          badgeVariant === "dot" &&
                            "border-l-4 bg-background pl-1",
                          badgeVariant === "colored" && "text-white",
                          badgeVariant === "mixed" && "border-l-4 pl-1",
                          badgeVariant === "colored" &&
                            getEventColorClass(statusType, "bg"),
                          badgeVariant === "dot" &&
                            getEventColorClass(statusType, "border")
                        )}
                        style={
                          badgeVariant === "dot"
                            ? { fontSize: "var(--font-2xs)" }
                            : badgeVariant === "colored"
                            ? { fontSize: "var(--font-2xs)" }
                            : {
                                fontSize: "var(--font-2xs)",
                                backgroundColor: `var(--${getEventColorClass(
                                  statusType,
                                  "bg"
                                )
                                  .replace("bg-[var(--", "")
                                  .replace(")]", "")}/20)`,
                                borderLeftColor: `var(--${getEventColorClass(
                                  statusType,
                                  "border"
                                )
                                  .replace("border-[var(--", "")
                                  .replace(")]", "")})`,
                              }
                        }
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div
                      className="text-muted-foreground"
                      style={{ fontSize: "var(--font-2xs)" }}
                    >
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // You can extend this component to support other views as well
  if (view === "month") {
    return renderMonthView();
  }

  return <div>Unsupported calendar view</div>;
}
