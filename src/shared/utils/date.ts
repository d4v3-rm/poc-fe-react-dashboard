import dayjs from "dayjs";
import { i18n } from "../i18n/i18n";

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
    return i18n.t("task.form.noDueDate", { lng: language });
  }

  return dayjs(isoDate)
    .locale(language)
    .format(language === "it" ? "DD MMM YYYY" : "MMM D, YYYY");
};
