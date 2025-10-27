import BigCalendar from "@/components/big-calendar";
import { IEvent, IUser } from "../components/calendar/interfaces/calendar";
import { leaveData } from "@/data/leave-data";
export default function Home() {
  // Transform leave data to event format for the calendar
  const leaveEvents: IEvent[] = leaveData.data.output.map((leave) => {
    // Function to get color based on leave status
    const getLeaveColor = (status: string, leaveType: string) => {
      if (status === "Rejected") return "red";
      if (status === "Pending") return "yellow";

      // For approved leaves, assign colors based on leave type
      switch (leaveType) {
        case "Sick Leave":
          return "purple";
        case "Casual Leave":
          return "green";
        case "Earned Leave":
          return "blue";
        case "Compensatory Leave":
          return "orange";
        case "Work From Home":
          return "blue";
        case "Weekend Work Leave":
          return "green";
        default:
          return "blue";
      }
    };

    // Convert YYYY-MM-DD to ISO string with time
    const toISOWithTime = (dateStr: string, isEnd: boolean = false) => {
      const date = new Date(dateStr);
      if (isEnd) {
        // End of day for end date
        date.setHours(23, 59, 59);
      } else {
        // Start of day for start date
        date.setHours(9, 0, 0);
      }
      return date.toISOString();
    };

    return {
      id: leave.id.toString(),
      title: `${leave.employee_name} | ${leave.leave_type}`,
      description: leave.reason || "No reason provided",
      startDate: toISOWithTime(leave.start_date),
      endDate: toISOWithTime(leave.end_date, true),
      color: getLeaveColor(leave.status, leave.leave_type),
      user: {
        id: leave.employee_id.toString(),
        name: leave.employee_name,
      },
    };
  });

  // Extract unique users from leave data
  const leaveUsers: IUser[] = Array.from(
    new Map(
      leaveData.data.output.map((leave) => [
        leave.employee_id,
        {
          id: leave.employee_id.toString(),
          name: leave.employee_name,
          // Add organization as additional info
          picturePath: undefined,
        },
      ])
    ).values()
  );
  return (
    <main>
      <BigCalendar events={leaveEvents} users={leaveUsers} />
    </main>
  );
}
