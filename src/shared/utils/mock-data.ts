import dayjs from 'dayjs';
import type { ProjectItem } from '../../features/projects/project.types';
import type { LanguageCode, TaskItem, TaskStatus } from '../../features/tasks/task.types';
import { createId } from './id';

const nowIso = (): string => new Date().toISOString();

type LocalizedText = Record<LanguageCode, string>;

type MockTaskSeed = {
  title: LocalizedText;
  content: LocalizedText;
  statusIndex: number;
  dueInDays: number | null;
};

type MockProjectSeed = {
  name: LocalizedText;
  description: LocalizedText;
  statuses: Array<{ name: LocalizedText; color: string }>;
  tasks: MockTaskSeed[];
};

const mockSeeds: MockProjectSeed[] = [
  {
    name: {
      en: 'Product Launch Q2',
      it: 'Lancio Prodotto Q2',
    },
    description: {
      en: 'Operational checklist for the public release.',
      it: 'Checklist operativa per il rilascio pubblico.',
    },
    statuses: [
      {
        name: { en: 'Backlog', it: 'Backlog' },
        color: '#5B8FF9',
      },
      {
        name: { en: 'In Progress', it: 'In Corso' },
        color: '#F6BD16',
      },
      {
        name: { en: 'Done', it: 'Completato' },
        color: '#5AD8A6',
      },
    ],
    tasks: [
      {
        title: {
          en: 'Prepare release notes',
          it: 'Preparare release notes',
        },
        content: {
          en: '## Scope\n- Features included\n- Known limitations\n\nOwner: **PM Team**',
          it: '## Ambito\n- Feature incluse\n- Limitazioni note\n\nOwner: **Team PM**',
        },
        statusIndex: 0,
        dueInDays: 2,
      },
      {
        title: {
          en: 'Finalize onboarding flow',
          it: 'Finalizzare onboarding',
        },
        content: {
          en: 'Update first-run copy and validate analytics events.',
          it: 'Aggiornare i testi iniziali e validare gli eventi analytics.',
        },
        statusIndex: 1,
        dueInDays: 1,
      },
      {
        title: {
          en: 'QA smoke test',
          it: 'Smoke test QA',
        },
        content: {
          en: '- Login\n- Billing\n- Notification center\n\nMark blockers immediately.',
          it: '- Login\n- Billing\n- Centro notifiche\n\nSegnare subito i blocker.',
        },
        statusIndex: 1,
        dueInDays: -1,
      },
      {
        title: {
          en: 'Security checklist signed',
          it: 'Checklist sicurezza firmata',
        },
        content: {
          en: 'Completed after infra review.',
          it: 'Completata dopo revisione infrastruttura.',
        },
        statusIndex: 2,
        dueInDays: -3,
      },
    ],
  },
  {
    name: {
      en: 'Customer Ops Board',
      it: 'Board Operativa Clienti',
    },
    description: {
      en: 'Post-sales activities and service handover.',
      it: 'Attivita post-vendita e handover di servizio.',
    },
    statuses: [
      {
        name: { en: 'To Plan', it: 'Da Pianificare' },
        color: '#5B8FF9',
      },
      {
        name: { en: 'Executing', it: 'In Esecuzione' },
        color: '#13C2C2',
      },
      {
        name: { en: 'Completed', it: 'Completato' },
        color: '#52C41A',
      },
    ],
    tasks: [
      {
        title: {
          en: 'Kick-off with ACME',
          it: 'Kick-off con ACME',
        },
        content: {
          en: 'Agenda:\n1. Goals\n2. Timeline\n3. Risks',
          it: 'Agenda:\n1. Obiettivi\n2. Timeline\n3. Rischi',
        },
        statusIndex: 0,
        dueInDays: 4,
      },
      {
        title: {
          en: 'Migrate support macros',
          it: 'Migrare macro supporto',
        },
        content: {
          en: 'Import templates and verify permissions.',
          it: 'Importare template e verificare i permessi.',
        },
        statusIndex: 1,
        dueInDays: 6,
      },
      {
        title: {
          en: 'Close training round',
          it: 'Chiudere sessione training',
        },
        content: {
          en: 'Attendance > 90% and quiz submitted.',
          it: 'Partecipazione > 90% e quiz inviato.',
        },
        statusIndex: 2,
        dueInDays: -2,
      },
    ],
  },
];

const createStatusList = (
  language: LanguageCode,
  statuses: MockProjectSeed['statuses'],
  timestamp: string,
): TaskStatus[] =>
  statuses.map((status) => ({
    id: createId(),
    name: status.name[language],
    color: status.color,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

const createTaskList = (
  language: LanguageCode,
  statuses: TaskStatus[],
  tasks: MockTaskSeed[],
): TaskItem[] => {
  const statusOrder = new Map<string, number>();
  statuses.forEach((status) => statusOrder.set(status.id, 0));

  return tasks.map((task, taskIndex) => {
    const status = statuses[task.statusIndex] ?? statuses[0];
    const currentOrder = statusOrder.get(status.id) ?? 0;
    statusOrder.set(status.id, currentOrder + 1);

    const createdAt = dayjs().subtract(taskIndex, 'hour').toISOString();

    return {
      id: createId(),
      title: task.title[language],
      content: task.content[language],
      statusId: status.id,
      dueDate:
        task.dueInDays === null
          ? null
          : dayjs().add(task.dueInDays, 'day').endOf('day').toISOString(),
      order: currentOrder,
      createdAt,
      updatedAt: createdAt,
    };
  });
};

export const buildMockProjects = (language: LanguageCode): ProjectItem[] =>
  mockSeeds.map((seed) => {
    const timestamp = nowIso();
    const statuses = createStatusList(language, seed.statuses, timestamp);

    return {
      id: createId(),
      name: seed.name[language],
      description: seed.description[language],
      createdAt: timestamp,
      updatedAt: timestamp,
      statuses,
      tasks: createTaskList(language, statuses, seed.tasks),
    };
  });
