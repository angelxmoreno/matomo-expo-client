import TestableVisitTracker from '../../src/testable/TestableVisitTracker';
import { Constants } from 'expo-constants';
import { expect } from 'chai';
import FakeAsyncStorage from '../utils/FakeAsyncStorage';
import FakeConstants from '../utils/FakeConstants';

describe('TestableVisitTracker', function () {
    const visitTrackerPrefix = '@testVisitTracker';
    const fakeStorageEngine = new FakeAsyncStorage();
    const fakeConstants = new FakeConstants();

    const newVisitTracker = () => {
        fakeStorageEngine.clearAll();
        fakeConstants.resetSession();
        return new TestableVisitTracker(fakeStorageEngine, visitTrackerPrefix, (fakeConstants as unknown) as Constants);
    };

    describe('build', function () {
        describe('firstVisitDate', function () {
            it('sets a first visit on a first visit', async function () {
                const visitTracker = newVisitTracker();
                await visitTracker.build();
                expect(visitTracker.firstVisitDate).to.be.a('date');
                expect(visitTracker.firstVisitDate).to.equal(visitTracker.currentVisitDate);
            });

            it('keeps the first visit on subsequent visit', async function () {
                const visitTracker = newVisitTracker();
                await visitTracker.build();

                const firstVisitDate = visitTracker.firstVisitDate;
                fakeConstants.newSession();
                await visitTracker.build();

                expect(visitTracker.firstVisitDate).to.be.a('date');
                expect(visitTracker.firstVisitDate?.toString()).to.equal(firstVisitDate?.toString());
                expect(visitTracker.firstVisitDate).not.to.equal(visitTracker.currentVisitDate);
            });
        });

        describe('lastVisitDate', function () {
            it('is undefined until a new session is created', async function () {
                const visitTracker = newVisitTracker();
                expect(visitTracker.lastVisitDate).to.be.undefined;
                await visitTracker.build();
                expect(visitTracker.lastVisitDate).to.be.undefined;
                fakeConstants.newSession();
                await visitTracker.build();
                expect(visitTracker.lastVisitDate).not.to.be.undefined;
            });

            it('is the last visit when a new session is created', async function () {
                const visitTracker = newVisitTracker();
                await visitTracker.build();
                const currentVisitDate = visitTracker.currentVisitDate;
                expect(visitTracker.lastVisitDate).to.be.undefined;
                expect(currentVisitDate).not.to.be.undefined;

                fakeConstants.newSession();
                await visitTracker.build();
                expect(visitTracker.lastVisitDate?.getTime()).to.equal(currentVisitDate?.getTime());
                expect(visitTracker.currentVisitDate?.getTime()).not.to.equal(currentVisitDate?.getTime());
            });
        });
    });
});
