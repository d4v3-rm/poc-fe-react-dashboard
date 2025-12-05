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
      en: 'Platform Reliability Sprint',
      it: 'Sprint Affidabilita Piattaforma',
    },
    description: {
      en: 'Quarterly reliability backlog focused on SLO, incidents and hardening.',
      it: 'Backlog trimestrale su SLO, incidenti e hardening infrastrutturale.',
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
        name: { en: 'Review', it: 'Revisione' },
        color: '#13C2C2',
      },
      {
        name: { en: 'Blocked', it: 'Bloccato' },
        color: '#FF4D4F',
      },
      {
        name: { en: 'Done', it: 'Completato' },
        color: '#5AD8A6',
      },
    ],
    tasks: [
      {
        title: {
          en: 'Define API Gateway SLO and alerts',
          it: 'Definire SLO API Gateway e alert',
        },
        content: {
          en: '## Target\n- Availability: **99.95%**\n- Latency p95 < **220ms**\n\nAdd alert routing for PagerDuty.',
          it: '## Target\n- Availability: **99.95%**\n- Latenza p95 < **220ms**\n\nAggiungere routing alert su PagerDuty.',
        },
        statusIndex: 2,
        dueInDays: 3,
      },
      {
        title: {
          en: 'Add synthetic checks for checkout',
          it: 'Aggiungere controlli sintetici checkout',
        },
        content: {
          en: 'Probe critical path every 2 minutes from EU and US regions.',
          it: 'Monitorare il percorso critico ogni 2 minuti da regioni EU e US.',
        },
        statusIndex: 1,
        dueInDays: 2,
      },
      {
        title: {
          en: 'Create Redis failover runbook',
          it: 'Creare runbook failover Redis',
        },
        content: {
          en: '- Recovery steps\n- Decision tree\n- Validation checklist',
          it: '- Step di recovery\n- Decision tree\n- Checklist di validazione',
        },
        statusIndex: 0,
        dueInDays: 5,
      },
      {
        title: {
          en: 'Patch CVE on image processor',
          it: 'Patch CVE su image processor',
        },
        content: {
          en: 'Dependency update blocked by legacy plugin compatibility.',
          it: 'Aggiornamento bloccato da compatibilita plugin legacy.',
        },
        statusIndex: 3,
        dueInDays: -1,
      },
      {
        title: {
          en: 'Postmortem template approved',
          it: 'Template postmortem approvato',
        },
        content: {
          en: 'Standard template validated with Incident Commander group.',
          it: 'Template standard validato con il gruppo Incident Commander.',
        },
        statusIndex: 4,
        dueInDays: -4,
      },
      {
        title: {
          en: 'Run chaos test on staging',
          it: 'Eseguire chaos test su staging',
        },
        content: {
          en: 'Inject packet loss on app nodes and measure retry behavior.',
          it: 'Iniettare packet loss sui nodi applicativi e misurare i retry.',
        },
        statusIndex: 0,
        dueInDays: 8,
      },
      {
        title: {
          en: 'Update escalation policy v3',
          it: 'Aggiornare policy di escalation v3',
        },
        content: {
          en: 'Map severity levels to responders and backup contacts.',
          it: 'Mappare severita con responder e contatti di backup.',
        },
        statusIndex: 1,
        dueInDays: 1,
      },
      {
        title: {
          en: 'Database restore drill',
          it: 'Test ripristino database',
        },
        content: {
          en: 'Restore latest backup in isolated env and compare checksum.',
          it: 'Ripristinare ultimo backup in ambiente isolato e confrontare checksum.',
        },
        statusIndex: 2,
        dueInDays: 6,
      },
    ],
  },
  {
    name: {
      en: 'Sales Pipeline Ops',
      it: 'Ops Pipeline Commerciale',
    },
    description: {
      en: 'Weekly execution board shared by SDR, AE and Revenue Operations.',
      it: 'Board settimanale condivisa da SDR, AE e Revenue Operations.',
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
        name: { en: 'Waiting Customer', it: 'In Attesa Cliente' },
        color: '#FA8C16',
      },
      {
        name: { en: 'Completed', it: 'Completato' },
        color: '#52C41A',
      },
    ],
    tasks: [
      {
        title: {
          en: 'Prepare demo script for ACME',
          it: 'Preparare script demo per ACME',
        },
        content: {
          en: 'Cover use cases: procurement approval and monthly reporting.',
          it: 'Copertura use case: approvazione acquisti e report mensile.',
        },
        statusIndex: 0,
        dueInDays: 2,
      },
      {
        title: {
          en: 'Sync CRM fields with finance taxonomy',
          it: 'Allineare campi CRM con tassonomia finance',
        },
        content: {
          en: '- Deal type mapping\n- Region mapping\n- Validation in sandbox',
          it: '- Mapping tipo deal\n- Mapping regioni\n- Validazione in sandbox',
        },
        statusIndex: 1,
        dueInDays: 5,
      },
      {
        title: {
          en: 'Follow up legal clause redlines',
          it: 'Follow up redline clausole legali',
        },
        content: {
          en: 'Waiting external counsel feedback before final quote.',
          it: 'In attesa feedback consulente esterno prima del preventivo finale.',
        },
        statusIndex: 2,
        dueInDays: 1,
      },
      {
        title: {
          en: 'Refresh competitor battle cards',
          it: 'Aggiornare battle card competitor',
        },
        content: {
          en: 'Update objections and win themes from latest deals.',
          it: 'Aggiornare obiezioni e temi di vittoria dagli ultimi deal.',
        },
        statusIndex: 1,
        dueInDays: 7,
      },
      {
        title: {
          en: 'Prospecting sequence QA',
          it: 'QA sequenza prospecting',
        },
        content: {
          en: 'Check personalization tokens and unsubscribe logic.',
          it: 'Controllare token di personalizzazione e logica unsubscribe.',
        },
        statusIndex: 0,
        dueInDays: 3,
      },
      {
        title: {
          en: 'QBR deck approved',
          it: 'Deck QBR approvato',
        },
        content: {
          en: 'Approved by CRO. Shared with regional managers.',
          it: 'Approvato dal CRO. Condiviso con i manager regionali.',
        },
        statusIndex: 3,
        dueInDays: -2,
      },
    ],
  },
  {
    name: {
      en: 'Mobile App Redesign',
      it: 'Redesign App Mobile',
    },
    description: {
      en: 'UX refresh and performance improvements for the 2026 release.',
      it: 'Refresh UX e miglioramenti performance per il rilascio 2026.',
    },
    statuses: [
      {
        name: { en: 'Discovery', it: 'Discovery' },
        color: '#5B8FF9',
      },
      {
        name: { en: 'Design', it: 'Design' },
        color: '#13C2C2',
      },
      {
        name: { en: 'Development', it: 'Sviluppo' },
        color: '#722ED1',
      },
      {
        name: { en: 'QA', it: 'QA' },
        color: '#FA8C16',
      },
      {
        name: { en: 'Released', it: 'Rilasciato' },
        color: '#52C41A',
      },
    ],
    tasks: [
      {
        title: {
          en: 'Interview 8 power users',
          it: 'Intervistare 8 power user',
        },
        content: {
          en: 'Focus areas: navigation friction and push notification fatigue.',
          it: 'Focus: attrito navigazione e stanchezza notifiche push.',
        },
        statusIndex: 0,
        dueInDays: 4,
      },
      {
        title: {
          en: 'Finalize component inventory',
          it: 'Finalizzare inventario componenti',
        },
        content: {
          en: 'Catalog old widgets and mark migration complexity.',
          it: 'Catalogare widget legacy e segnare complessita migrazione.',
        },
        statusIndex: 1,
        dueInDays: 2,
      },
      {
        title: {
          en: 'Implement new home feed layout',
          it: 'Implementare nuovo layout home feed',
        },
        content: {
          en: 'Behind feature flag `mobile_feed_v2`.',
          it: 'Dietro feature flag `mobile_feed_v2`.',
        },
        statusIndex: 2,
        dueInDays: 6,
      },
      {
        title: {
          en: 'Offline cache stress test',
          it: 'Stress test cache offline',
        },
        content: {
          en: 'Validate app resume after 24h in airplane mode.',
          it: 'Validare resume app dopo 24h in modalita aereo.',
        },
        statusIndex: 3,
        dueInDays: 3,
      },
      {
        title: {
          en: 'Beta release 2.1.0',
          it: 'Beta release 2.1.0',
        },
        content: {
          en: 'Published to internal testers and support champions.',
          it: 'Pubblicata a tester interni e champion del supporto.',
        },
        statusIndex: 4,
        dueInDays: -1,
      },
      {
        title: {
          en: 'Reduce bundle size by 15%',
          it: 'Ridurre bundle size del 15%',
        },
        content: {
          en: 'Split settings area and defer heavy analytics package.',
          it: 'Spezzare area impostazioni e differire pacchetto analytics pesante.',
        },
        statusIndex: 2,
        dueInDays: 5,
      },
      {
        title: {
          en: 'Accessibility pass on typography scale',
          it: 'Pass accessibilita su scala tipografica',
        },
        content: {
          en: 'Minimum contrast AA for text over gradient cards.',
          it: 'Contrasto minimo AA per testo su card con gradiente.',
        },
        statusIndex: 1,
        dueInDays: 1,
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
