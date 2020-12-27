//@SuppressWarnings("SpellCheckingInspection")

import TestableVisitTracker from './TestableVisitTracker';
import {
    BaseMatomoExpoParams,
    ContentRequestParams,
    EventRequestParams,
    RecommendedParams,
    RequiredParams,
    UserParams,
    ValidRequestParams,
} from '../types';
import UUID2HexClient from 'uuid2hex-client-js';
import Utility from '../Utility';
import { Constants } from 'expo-constants';
import axios from 'axios';

export interface TestableMatomoExpoParams extends BaseMatomoExpoParams {
    visitTracker: TestableVisitTracker;
    uuid2hexClient: UUID2HexClient;
    constants: Constants;
    device: Record<string, unknown>;
}

export type EventTrackingData = {
    category: string;
    action: string;
    name?: string;
    value?: number;
};

export type ContentInteractionData = {
    content_name: string;
    content_piece?: string;
    target?: string;
    interaction?: string;
};
export default class TestableMatomoExpo {
    protected idsite: number;
    protected serverUrl: string;
    protected enabled: boolean;
    protected log: boolean;
    protected userParams: UserParams;
    protected visitTracker: TestableVisitTracker;
    protected uuid2hexClient: UUID2HexClient;
    protected constants: Constants;
    protected device: Record<string, unknown>;

    constructor({
        idsite,
        serverUrl,
        enabled = true,
        log = true,
        userParams = {},
        visitTracker,
        uuid2hexClient,
        constants,
        device,
    }: TestableMatomoExpoParams) {
        this.idsite = idsite;
        this.serverUrl = serverUrl;
        this.enabled = enabled;
        this.log = log;
        this.userParams = userParams;
        this.visitTracker = visitTracker;
        this.uuid2hexClient = uuid2hexClient;
        this.constants = constants;
        this.device = device;
    }

    setUserId(id: string): void {
        this.userParams.uid = id;
    }

    async trackScreenView(path: string, query?: Record<string, unknown>): Promise<string> {
        const pv_id = Utility.genRanHex();
        await this.doTrack({
            ...(await this.buildDefaultParams()),
            action_name: path,
            url: Utility.buildUrl(path, query),
            pv_id,
        });

        return pv_id;
    }

    async trackContentInteraction(data: ContentInteractionData, pv_id?: string): Promise<void> {
        const { content_name, content_piece, target, interaction } = data;

        const payload: ContentRequestParams = {
            ...(await this.buildDefaultParams()),
            c_n: content_name,
            c_p: content_piece,
            c_t: target,
            c_i: interaction,
        };

        await this.doTrack({
            pv_id,
            ...payload,
        });
    }

    async trackEvent(data: EventTrackingData, pv_id?: string): Promise<void> {
        const { category, action, name, value } = data;

        const payload: EventRequestParams = {
            ...(await this.buildDefaultParams()),
            e_c: category,
            e_a: action,
            e_n: name,
            e_v: value,
        };

        await this.doTrack({
            pv_id,
            ...payload,
        });
    }

    protected getDeviceInfo(): Record<string, unknown> {
        const deviceInfo = {
            isDevice: this.device.isDevice,
            brand: this.device.brand,
            manufacturer: this.device.manufacturer,
            modelName: this.device.modelName,
            modelId: this.device.modelId,
            designName: this.device.designName,
            productName: this.device.productName,
            deviceYearClass: this.device.deviceYearClass,
            totalMemory: this.device.totalMemory,
            osName: this.device.osName,
            osVersion: this.device.osVersion,
            osBuildId: this.device.osBuildId,
            osInternalBuildId: this.device.osInternalBuildId,
            osBuildFingerprint: this.device.osBuildFingerprint,
            platformApiLevel: this.device.platformApiLevel,
            deviceName: this.device.deviceName,
            appOwnership: this.constants.appOwnership,
            expoVersion: this.constants.expoVersion,
            installationId: this.constants.installationId,
            nativeAppVersion: this.constants.nativeAppVersion,
            nativeBuildVersion: this.constants.nativeBuildVersion,
            sessionId: this.constants.sessionId,
            statusBarHeight: this.constants.statusBarHeight,
        };

        const deviceVars = {};
        Object.keys(deviceInfo).forEach((key: string, index: number) => {
            deviceVars[(index + 1).toString(10)] = [key, deviceInfo[key]];
        });

        return deviceVars;
    }

    protected async buildDefaultParams(): Promise<ValidRequestParams> {
        const requiredParams: RequiredParams = {
            idsite: this.idsite,
            rec: 1,
        };

        const recommendedParams: RecommendedParams = {
            _id: (await this.uuid2hexClient.getHex(this.constants.installationId)) || undefined,
            rand: Utility.genRanHex(),
        };

        await this.visitTracker.build();
        const now = new Date();
        const userParams: UserParams = {
            _idvc: this.visitTracker.totalVisits,
            _viewts: this.visitTracker.lastVisitDate,
            _idts: this.visitTracker.firstVisitDate,
            res: Utility.getResolution(),
            h: now.getHours(),
            m: now.getMinutes(),
            s: now.getSeconds(),
            ua: (await this.constants.getWebViewUserAgentAsync()) || undefined,
            lang: Utility.getLocale(),
            _cvar: this.getDeviceInfo(),
        };

        return {
            ...requiredParams,
            ...recommendedParams,
            ...userParams,
            ...this.userParams,
        };
    }

    protected async doTrack(data: ValidRequestParams): Promise<void> {
        try {
            await axios.get(this.serverUrl, {
                params: data,
            });

            // @TODO log success
        } catch (error) {
            // @TODO log error
        }
    }
}
