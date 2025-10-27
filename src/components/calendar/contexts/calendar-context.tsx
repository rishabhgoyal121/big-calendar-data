"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IEvent, IUser, BadgeVariant } from "../interfaces/calendar";

interface CalendarContextProps {
  events: IEvent[];
  users: IUser[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  badgeVariant: BadgeVariant;
  setBadgeVariant: (variant: BadgeVariant) => void;
}

interface CalendarProviderProps {
  children: ReactNode;
  events: IEvent[];
  users: IUser[];
  initialDate?: Date;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(
  undefined
);

export function CalendarProvider({
  children,
  events,
  users,
  initialDate,
}: CalendarProviderProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate || new Date()
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>("colored");

  // Listen for custom setDate events
  useEffect(() => {
    const handleSetDate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail instanceof Date) {
        setSelectedDate(customEvent.detail);
      }
    };

    // Add event listener
    document.addEventListener("setDate", handleSetDate as EventListener);

    // Clean up
    return () => {
      document.removeEventListener("setDate", handleSetDate as EventListener);
    };
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        events,
        users,
        selectedDate,
        setSelectedDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return context;
}
