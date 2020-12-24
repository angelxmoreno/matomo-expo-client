export default class FakeConstants {
    sessionId = 'sessionId';
    sessionCounter = 0;

    newSession(): void {
        this.sessionCounter++;
        this.sessionId = 'sessionId-' + this.sessionCounter;
    }

    resetSession(): void {
        this.sessionId = 'sessionId';
        this.sessionCounter = 0;
    }
}
