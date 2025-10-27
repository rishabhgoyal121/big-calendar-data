import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { IEvent } from "../interfaces/calendar";

/**
 * Gets all days in a month including days from adjacent months to fill calendar grid
 */
export function getCalendarMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Formats an event's time for display
 */
export function formatEventTime(event: IEvent): string {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
}

/**
 * Checks if an event spans multiple days
 */
export function isMultiDayEvent(event: IEvent): boolean {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd");
}

/**
 * Returns CSS styles based on event type
 */
export function getEventColorClass(
  eventType: string,
  variant: "bg" | "text" | "border" = "bg"
): string {
  // Map event types to CSS variable names
  const colorMap: Record<string, string> = {
    rejected: "status-rejected",
    pending: "status-pending",
    sick: "status-sick",
    casual: "status-casual",
    wfh: "status-wfh",
    compensatory: "status-compensatory",
    // Add default case
    default: "status-pending",
  };

  const color = colorMap[eventType.toLowerCase()] || colorMap.default;

  // Return appropriate CSS class using the variable
  if (variant === "bg") {
    return `bg-[var(--${color})]`;
  } else if (variant === "text") {
    return `text-[var(--${color})]`;
  } else {
    return `border-[var(--${color})]`;
  }
}
