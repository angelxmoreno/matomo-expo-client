import TestableVisitTracker from "./testable/TestableVisitTracker";
import {CacheableInterface} from "uuid2hex-client-js";
import Constants from 'expo-constants';

export default class VisitTracker extends TestableVisitTracker {
    constructor(storageEngine: CacheableInterface, storageKey = '@visitTracker') {
        super(storageEngine, storageKey, Constants)
    }
}
