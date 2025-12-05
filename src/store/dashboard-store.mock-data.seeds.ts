import type { MockProjectSeed } from "./dashboard-store.mock-data.types";
import { mobileRedesignSeed } from "./dashboard-store.mock-data.mobile-redesign.seed";
import { platformReliabilitySeed } from "./dashboard-store.mock-data.platform-reliability.seed";
import { salesPipelineSeed } from "./dashboard-store.mock-data.sales-pipeline.seed";

export const dashboardMockSeeds: MockProjectSeed[] = [
  platformReliabilitySeed,
  salesPipelineSeed,
  mobileRedesignSeed,
];
