import { Constants } from 'expo-constants';
import { CacheableInterface } from 'uuid2hex-client-js';

export type Visit = {
    sessionId: string;
    date: Date;
};

type VisitState = {
    firstVisit?: Visit;
    lastVisit?: Visit;
    currentVisit?: Visit;
    totalVisits: number;
};

const initialVisitState = {
    firstVisit: undefined,
    lastVisit: undefined,
    currentVisit: undefined,
    totalVisits: 0,
};

const toDate = (str: string | Date | undefined) => {
    if (typeof str === 'string') {
        return new Date(str);
    }

    return str;
};

export default class VisitTracker {
    protected state: VisitState = initialVisitState;
    protected storageKey: string;
    protected storageEngine: CacheableInterface;
    protected constants: Constants;

    constructor(storageEngine: CacheableInterface, storageKey = '@visitTracker', constants: Constants) {
        this.storageKey = storageKey;
        this.storageEngine = storageEngine;
        this.constants = constants;
    }

    get firstVisitDate(): Date | undefined {
        return toDate(this.state.firstVisit?.date);
    }

    get lastVisitDate(): Date | undefined {
        return toDate(this.state.lastVisit?.date);
    }

    get currentVisitDate(): Date | undefined {
        return toDate(this.state.currentVisit?.date);
    }

    get totalVisits(): number {
        return this.state.totalVisits;
    }

    get sessionId(): string {
        return this.state.currentVisit?.sessionId || '';
    }

    async build(): Promise<VisitTracker> {
        await this.getState();
        const visit: Visit = {
            sessionId: this.constants.sessionId,
            date: new Date(),
        };

        if (!this.state.firstVisit) {
            this.state.firstVisit = visit;
        }

        if (this.state.currentVisit && this.state.currentVisit.sessionId !== visit.sessionId) {
            this.state.lastVisit = this.state.currentVisit;
        }

        if (!this.state.currentVisit || this.state.currentVisit.sessionId !== visit.sessionId) {
            this.state.currentVisit = visit;
            this.state.totalVisits++;
        }

        await this.saveState();

        return this;
    }

    protected async saveState(): Promise<void> {
        await this.storageEngine.setItem(this.storageKey, JSON.stringify(this.state));
    }

    protected async getState(): Promise<void> {
        const stateString = await this.storageEngine.getItem(this.storageKey);
        if (stateString !== null) {
            this.state = JSON.parse(stateString);
        }
    }
}
