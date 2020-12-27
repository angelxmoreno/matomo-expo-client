//@SuppressWarnings("SpellCheckingInspection")

import TestableVisitTracker from './TestableVisitTracker';
import {BaseMatomoExpoParams, RecommendedParams, RequiredParams, UserParams, ValidRequestParams} from '../types';
import UUID2HexClient from 'uuid2hex-client-js';
import Utility from '../Utility';
import {Constants} from 'expo-constants';


export interface TestableMatomoExpoParams extends BaseMatomoExpoParams {
    visitTracker: TestableVisitTracker;
    uuid2hexClient: UUID2HexClient;
    constants: Constants;
    device: Record<string, unknown>;
}

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

    protected getDeviceInfo() {
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
        console.log('ValidRequestParams', data);
    }
}
