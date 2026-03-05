import type { LanguageCode } from "../../shared/i18n/i18n.types";

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
