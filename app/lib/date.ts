import { format } from "date-fns";

export const formatDateTime = (date: Date) => {
  return format(date, "yyyy-MM-dd HH:mm");
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
