import type { MockProjectSeed } from "./dashboard-store.mock-data.types";

export const platformReliabilitySeed: MockProjectSeed = {
  name: {
    en: "Platform Reliability Sprint",
    it: "Sprint Affidabilita Piattaforma",
  },
  description: {
    en: "Quarterly reliability backlog focused on SLO, incidents and hardening.",
    it: "Backlog trimestrale su SLO, incidenti e hardening infrastrutturale.",
  },
  statuses: [
    {
      name: { en: "Backlog", it: "Backlog" },
      color: "#5B8FF9",
    },
    {
      name: { en: "In Progress", it: "In Corso" },
      color: "#F6BD16",
    },
    {
      name: { en: "Review", it: "Revisione" },
      color: "#13C2C2",
    },
    {
      name: { en: "Blocked", it: "Bloccato" },
      color: "#FF4D4F",
    },
    {
      name: { en: "Done", it: "Completato" },
      color: "#5AD8A6",
    },
  ],
  tasks: [
    {
      title: {
        en: "Define API Gateway SLO and alerts",
        it: "Definire SLO API Gateway e alert",
      },
      content: {
        en: "## Target\n- Availability: **99.95%**\n- Latency p95 < **220ms**\n\nAdd alert routing for PagerDuty.",
        it: "## Target\n- Availability: **99.95%**\n- Latenza p95 < **220ms**\n\nAggiungere routing alert su PagerDuty.",
      },
      statusIndex: 2,
      dueInDays: 3,
    },
    {
      title: {
        en: "Add synthetic checks for checkout",
        it: "Aggiungere controlli sintetici checkout",
      },
      content: {
        en: "Probe critical path every 2 minutes from EU and US regions.",
        it: "Monitorare il percorso critico ogni 2 minuti da regioni EU e US.",
      },
      statusIndex: 1,
      dueInDays: 2,
    },
    {
      title: {
        en: "Create Redis failover runbook",
        it: "Creare runbook failover Redis",
      },
      content: {
        en: "- Recovery steps\n- Decision tree\n- Validation checklist",
        it: "- Step di recovery\n- Decision tree\n- Checklist di validazione",
      },
      statusIndex: 0,
      dueInDays: 5,
    },
    {
      title: {
        en: "Patch CVE on image processor",
        it: "Patch CVE su image processor",
      },
      content: {
        en: "Dependency update blocked by legacy plugin compatibility.",
        it: "Aggiornamento bloccato da compatibilita plugin legacy.",
      },
      statusIndex: 3,
      dueInDays: -1,
    },
    {
      title: {
        en: "Postmortem template approved",
        it: "Template postmortem approvato",
      },
      content: {
        en: "Standard template validated with Incident Commander group.",
        it: "Template standard validato con il gruppo Incident Commander.",
      },
      statusIndex: 4,
      dueInDays: -4,
    },
    {
      title: {
        en: "Run chaos test on staging",
        it: "Eseguire chaos test su staging",
      },
      content: {
        en: "Inject packet loss on app nodes and measure retry behavior.",
        it: "Iniettare packet loss sui nodi applicativi e misurare i retry.",
      },
      statusIndex: 0,
      dueInDays: 8,
    },
    {
      title: {
        en: "Update escalation policy v3",
        it: "Aggiornare policy di escalation v3",
      },
      content: {
        en: "Map severity levels to responders and backup contacts.",
        it: "Mappare severita con responder e contatti di backup.",
      },
      statusIndex: 1,
      dueInDays: 1,
    },
    {
      title: {
        en: "Database restore drill",
        it: "Test ripristino database",
      },
      content: {
        en: "Restore latest backup in isolated env and compare checksum.",
        it: "Ripristinare ultimo backup in ambiente isolato e confrontare checksum.",
      },
      statusIndex: 2,
      dueInDays: 6,
    },
  ],
};
