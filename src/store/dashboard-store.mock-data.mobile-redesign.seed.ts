import type { MockProjectSeed } from "./dashboard-store.mock-data.types";

export const mobileRedesignSeed: MockProjectSeed = {
  name: {
    en: "Mobile App Redesign",
    it: "Redesign App Mobile",
  },
  description: {
    en: "UX refresh and performance improvements for the 2026 release.",
    it: "Refresh UX e miglioramenti performance per il rilascio 2026.",
  },
  statuses: [
    {
      name: { en: "Discovery", it: "Discovery" },
      color: "#5B8FF9",
    },
    {
      name: { en: "Design", it: "Design" },
      color: "#13C2C2",
    },
    {
      name: { en: "Development", it: "Sviluppo" },
      color: "#722ED1",
    },
    {
      name: { en: "QA", it: "QA" },
      color: "#FA8C16",
    },
    {
      name: { en: "Released", it: "Rilasciato" },
      color: "#52C41A",
    },
  ],
  tasks: [
    {
      title: {
        en: "Interview 8 power users",
        it: "Intervistare 8 power user",
      },
      content: {
        en: "Focus areas: navigation friction and push notification fatigue.",
        it: "Focus: attrito navigazione e stanchezza notifiche push.",
      },
      statusIndex: 0,
      dueInDays: 4,
    },
    {
      title: {
        en: "Finalize component inventory",
        it: "Finalizzare inventario componenti",
      },
      content: {
        en: "Catalog old widgets and mark migration complexity.",
        it: "Catalogare widget legacy e segnare complessita migrazione.",
      },
      statusIndex: 1,
      dueInDays: 2,
    },
    {
      title: {
        en: "Implement new home feed layout",
        it: "Implementare nuovo layout home feed",
      },
      content: {
        en: "Behind feature flag `mobile_feed_v2`.",
        it: "Dietro feature flag `mobile_feed_v2`.",
      },
      statusIndex: 2,
      dueInDays: 6,
    },
    {
      title: {
        en: "Offline cache stress test",
        it: "Stress test cache offline",
      },
      content: {
        en: "Validate app resume after 24h in airplane mode.",
        it: "Validare resume app dopo 24h in modalita aereo.",
      },
      statusIndex: 3,
      dueInDays: 3,
    },
    {
      title: {
        en: "Beta release 2.1.0",
        it: "Beta release 2.1.0",
      },
      content: {
        en: "Published to internal testers and support champions.",
        it: "Pubblicata a tester interni e champion del supporto.",
      },
      statusIndex: 4,
      dueInDays: -1,
    },
    {
      title: {
        en: "Reduce bundle size by 15%",
        it: "Ridurre bundle size del 15%",
      },
      content: {
        en: "Split settings area and defer heavy analytics package.",
        it: "Spezzare area impostazioni e differire pacchetto analytics pesante.",
      },
      statusIndex: 2,
      dueInDays: 5,
    },
    {
      title: {
        en: "Accessibility pass on typography scale",
        it: "Pass accessibilita su scala tipografica",
      },
      content: {
        en: "Minimum contrast AA for text over gradient cards.",
        it: "Contrasto minimo AA per testo su card con gradiente.",
      },
      statusIndex: 1,
      dueInDays: 1,
    },
  ],
};
