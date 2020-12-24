import TestableMatomoExpo from "./testable/TestableMatomoExpo";
import {BaseMatomoExpoParams} from "./types";
import VisitTracker from "./VisitTracker";
import UUID2HexClient, {CacheableInterface} from "uuid2hex-client-js";
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export interface MatomoExpoParams extends BaseMatomoExpoParams {
    storageEngine: CacheableInterface
    uuidServiceUrl: string
}

export default class MatomoExpo extends TestableMatomoExpo {
        constructor({
                    idsite,
                    serverUrl,
                    enabled = true,
                    log = true,
                    userParams = {},
                    storageEngine,
                    uuidServiceUrl,
                }: MatomoExpoParams) {
        const visitTracker = new VisitTracker(storageEngine, '@MatomoExpo_visitTracker');
        const uuid2hexClient = new UUID2HexClient(uuidServiceUrl, undefined, storageEngine, '@MatomoExpo_uuid2hexClient')
        super({
            idsite,
            serverUrl,
            enabled,
            log,
            userParams,
            visitTracker,
            uuid2hexClient,
            constants: Constants,
            device: Device,
        })
    }
}
