import type { LanguageCode } from "../shared/i18n/i18n.types";

export type LocalizedText = Record<LanguageCode, string>;

export type MockTaskSeed = {
  title: LocalizedText;
  content: LocalizedText;
  statusIndex: number;
  dueInDays: number | null;
  tags?: string[];
};

export type MockProjectSeed = {
  name: LocalizedText;
  description: LocalizedText;
  tags?: string[];
  statuses: Array<{ name: LocalizedText; color: string }>;
  tasks: MockTaskSeed[];
};
