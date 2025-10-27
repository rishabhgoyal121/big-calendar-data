export interface IUser {
  id: string;
  name: string;
  picturePath?: string; // Optional avatar image
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  color: "blue" | "green" | "red" | "yellow" | "purple" | "orange";
  user: {
    id: string;
    name: string;
  };
}

export type BadgeVariant = "dot" | "colored" | "mixed";

export type CalendarView = "day" | "week" | "month" | "year" | "agenda";
