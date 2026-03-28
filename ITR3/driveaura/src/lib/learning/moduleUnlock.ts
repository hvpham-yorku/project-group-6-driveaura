import { MODULES, type LicenseLevel, type ModuleItem } from "@/app/modules/data";

export function getOrderedModulesForLicense(license: LicenseLevel): ModuleItem[] {
  return MODULES.filter((m) => m.licenseLevel === license);
}

/** Next module unlocks only after the previous module's quiz has been passed at least once. */
export function isModuleUnlocked(moduleId: string, passedQuizIds: Set<string>): boolean {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return false;
  const order = getOrderedModulesForLicense(mod.licenseLevel);
  const idx = order.findIndex((m) => m.id === moduleId);
  if (idx <= 0) return true;
  const prevId = order[idx - 1]!.id;
  return passedQuizIds.has(prevId);
}
