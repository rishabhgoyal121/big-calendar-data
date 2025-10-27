"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { ClientContainer } from "@/components/calendar/components/client-container";
import { IEvent, IUser } from "@/components/calendar/interfaces/calendar";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BigCalendarProps {
  events: IEvent[];
  users: IUser[];
  initialDate?: Date;
}

export function BigCalendar({
  events,
  users,
  initialDate = new Date(),
}: BigCalendarProps) {
  const [baseDate, setBaseDate] = useState(initialDate);

  // Navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setBaseDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setBaseDate(newDate);
  };

  const goToCurrentMonth = () => {
    setBaseDate(new Date());
  };

  // Update when baseDate changes
  useEffect(() => {
    // Notify the calendar to update its view
    document.dispatchEvent(
      new CustomEvent("setDate", {
        detail: baseDate,
      })
    );
  }, [baseDate]);

  return (
    <div className="m-4 p-4 w-[95%] overflow-scroll border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Leave Calendar</h2>
      <CalendarProvider events={events} users={users} initialDate={baseDate}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm">
            <Badge className="mx-1 bg-[var(--status-rejected)] text-white border-transparent hover:bg-[var(--status-rejected-hover)]">
              Rejected
            </Badge>
            <Badge className="mx-1 bg-[var(--status-pending)] text-white border-transparent hover:bg-[var(--status-pending-hover)]">
              Pending
            </Badge>
            <Badge className="mx-1 bg-[var(--status-sick)] text-white border-transparent hover:bg-[var(--status-sick-hover)]">
              Sick
            </Badge>
            <Badge className="mx-1 bg-[var(--status-casual)] text-white border-transparent hover:bg-[var(--status-casual-hover)]">
              Casual
            </Badge>
            <Badge className="mx-1 bg-[var(--status-wfh)] text-white border-transparent hover:bg-[var(--status-wfh-hover)]">
              Work From Home
            </Badge>
            <Badge className="mx-1 bg-[var(--status-compensatory)] text-white border-transparent hover:bg-[var(--status-compensatory-hover)]">
              Compensatory
            </Badge>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-2"
              onClick={goToPreviousMonth}
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mx-1"
              onClick={goToCurrentMonth}
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={goToNextMonth}
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ClientContainer view="month" />
      </CalendarProvider>
    </div>
  );
}

export default BigCalendar;
