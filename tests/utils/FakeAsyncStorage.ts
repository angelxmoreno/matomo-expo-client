import { CacheableInterface } from 'uuid2hex-client-js';

export default class FakeAsyncStorage implements CacheableInterface {
    memory: Record<string, string> = {};

    clearAll(): void {
        this.memory = {};
    }

    async getItem(key: string): Promise<string | null> {
        return this.memory[key] || null;
    }

    async removeItem(key: string): Promise<void> {
        delete this.memory[key];
    }

    async setItem(key: string, value: string): Promise<void> {
        this.memory[key] = value;
    }
}
