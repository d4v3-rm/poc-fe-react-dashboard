import dayjs from "dayjs";

export const isOverdue = (isoDate: string | null): boolean => {
  if (!isoDate) {
    return false;
  }

  const due = dayjs(isoDate).endOf("day");
  return due.isBefore(dayjs());
};

export const isToday = (isoDate: string | null): boolean => {
  if (!isoDate) {
    return false;
  }

  return dayjs(isoDate).isSame(dayjs(), "day");
};

export const isWithinNextWeek = (isoDate: string | null): boolean => {
  if (!isoDate) {
    return false;
  }

  const due = dayjs(isoDate);
  const today = dayjs().startOf("day");
  const endWindow = today.add(7, "day").endOf("day");

  return (
    due.isAfter(today.subtract(1, "millisecond")) &&
    due.isBefore(endWindow.add(1, "millisecond"))
  );
};

export const formatDueDate = (
  isoDate: string | null,
  language: "en" | "it",
): string => {
  if (!isoDate) {
    return language === "it" ? "Nessuna scadenza" : "No due date";
  }

  return dayjs(isoDate)
    .locale(language)
    .format(language === "it" ? "DD MMM YYYY" : "MMM D, YYYY");
};
