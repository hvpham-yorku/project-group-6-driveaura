import type { Module, User } from "./types";
import { DEFAULT_MODULES, DEFAULT_USERS } from "./types";

/**
 * Simple in-memory repo used by core services.
 * (Can be swapped later for Firebase/DB-backed persistence.)
 */
export class InMemoryRepo {
  private usersById = new Map<string, User>();
  private modulesById = new Map<string, Module>();

  constructor(opts?: { users?: User[]; modules?: Module[] }) {
    const users = opts?.users ?? DEFAULT_USERS;
    const modules = opts?.modules ?? DEFAULT_MODULES;

    users.forEach((u) => this.usersById.set(u.id, u));
    modules.forEach((m) => this.modulesById.set(m.id, m));
  }

  getUser(userId: string): User | undefined {
    return this.usersById.get(userId);
  }

  getModule(moduleId: string): Module | undefined {
    return this.modulesById.get(moduleId);
  }
}

