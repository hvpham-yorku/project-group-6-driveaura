import { User, Module, Quiz, DEFAULT_USERS, DEFAULT_MODULES } from './types';

export class InMemoryRepo {
  private users = [...DEFAULT_USERS];
  private modules = [...DEFAULT_MODULES];

  // Helper to copy data so the original stays safe
  private clone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

  getUser(id: string) { return this.clone(this.users.find(u => u.id === id) || null); }
  
  saveUser(user: User) {
    const i = this.users.findIndex(u => u.id === user.id);
    if (i > -1) this.users[i] = this.clone(user);
  }

  getModule(id: string) { return this.clone(this.modules.find(m => m.id === id) || null); }
}