import type { MockProjectSeed } from "./dashboard-store.mock-data.types";

export const salesPipelineSeed: MockProjectSeed = {
  name: {
    en: "Sales Pipeline Ops",
    it: "Ops Pipeline Commerciale",
  },
  description: {
    en: "Weekly execution board shared by SDR, AE and Revenue Operations.",
    it: "Board settimanale condivisa da SDR, AE e Revenue Operations.",
  },
  statuses: [
    {
      name: { en: "To Plan", it: "Da Pianificare" },
      color: "#5B8FF9",
    },
    {
      name: { en: "Executing", it: "In Esecuzione" },
      color: "#13C2C2",
    },
    {
      name: { en: "Waiting Customer", it: "In Attesa Cliente" },
      color: "#FA8C16",
    },
    {
      name: { en: "Completed", it: "Completato" },
      color: "#52C41A",
    },
  ],
  tasks: [
    {
      title: {
        en: "Prepare demo script for ACME",
        it: "Preparare script demo per ACME",
      },
      content: {
        en: "Cover use cases: procurement approval and monthly reporting.",
        it: "Copertura use case: approvazione acquisti e report mensile.",
      },
      statusIndex: 0,
      dueInDays: 2,
    },
    {
      title: {
        en: "Sync CRM fields with finance taxonomy",
        it: "Allineare campi CRM con tassonomia finance",
      },
      content: {
        en: "- Deal type mapping\n- Region mapping\n- Validation in sandbox",
        it: "- Mapping tipo deal\n- Mapping regioni\n- Validazione in sandbox",
      },
      statusIndex: 1,
      dueInDays: 5,
    },
    {
      title: {
        en: "Follow up legal clause redlines",
        it: "Follow up redline clausole legali",
      },
      content: {
        en: "Waiting external counsel feedback before final quote.",
        it: "In attesa feedback consulente esterno prima del preventivo finale.",
      },
      statusIndex: 2,
      dueInDays: 1,
    },
    {
      title: {
        en: "Refresh competitor battle cards",
        it: "Aggiornare battle card competitor",
      },
      content: {
        en: "Update objections and win themes from latest deals.",
        it: "Aggiornare obiezioni e temi di vittoria dagli ultimi deal.",
      },
      statusIndex: 1,
      dueInDays: 7,
    },
    {
      title: {
        en: "Prospecting sequence QA",
        it: "QA sequenza prospecting",
      },
      content: {
        en: "Check personalization tokens and unsubscribe logic.",
        it: "Controllare token di personalizzazione e logica unsubscribe.",
      },
      statusIndex: 0,
      dueInDays: 3,
    },
    {
      title: {
        en: "QBR deck approved",
        it: "Deck QBR approvato",
      },
      content: {
        en: "Approved by CRO. Shared with regional managers.",
        it: "Approvato dal CRO. Condiviso con i manager regionali.",
      },
      statusIndex: 3,
      dueInDays: -2,
    },
  ],
};
