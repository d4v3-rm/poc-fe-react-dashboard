import type { LanguageCode } from "../../features/tasks/task.types";
import type { ThemeColors } from "../../store/dashboard-store.types";

export const DEFAULT_STATUS_TEMPLATES: Record<
  LanguageCode,
  Array<{ name: string; color: string }>
> = {
  en: [
    { name: "Backlog", color: "#5B8FF9" },
    { name: "In Progress", color: "#F6BD16" },
    { name: "Done", color: "#5AD8A6" },
  ],
  it: [
    { name: "Backlog", color: "#5B8FF9" },
    { name: "In Corso", color: "#F6BD16" },
    { name: "Completato", color: "#5AD8A6" },
  ],
};

export const DEFAULT_PROJECT_NAME: Record<LanguageCode, string> = {
  en: "My First Project",
  it: "Il Mio Primo Progetto",
};

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "#0D8BFF",
};

export const THEME_COLOR_PRESETS: string[] = [
  "#0D8BFF",
  "#1FA77A",
  "#E89D1B",
  "#E6485D",
  "#722ED1",
  "#2F54EB",
  "#13C2C2",
  "#FA8C16",
];
