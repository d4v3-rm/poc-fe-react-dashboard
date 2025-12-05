import type { LanguageCode } from '../../features/tasks/task.types';

export const DEFAULT_STATUS_TEMPLATES: Record<LanguageCode, Array<{ name: string; color: string }>> = {
  en: [
    { name: 'Backlog', color: '#5B8FF9' },
    { name: 'In Progress', color: '#F6BD16' },
    { name: 'Done', color: '#5AD8A6' },
  ],
  it: [
    { name: 'Backlog', color: '#5B8FF9' },
    { name: 'In Corso', color: '#F6BD16' },
    { name: 'Completato', color: '#5AD8A6' },
  ],
};

export const DEFAULT_PROJECT_NAME: Record<LanguageCode, string> = {
  en: 'My First Project',
  it: 'Il Mio Primo Progetto',
};
