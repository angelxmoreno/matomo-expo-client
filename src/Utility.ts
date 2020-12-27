import {Dimensions} from 'react-native';
import * as Localization from 'expo-localization';
import * as Linking from 'expo-linking';
import {QueryParams} from 'expo-linking';

export default class Utility {
    static getResolution(): string {
        return `${Dimensions.get('window').width}x${Dimensions.get('window').height}`;
    }
    
    static getLocale(): string {
        return Localization.locale;
    }
    
    static genRanHex(size = 16): string {
        return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }
    
    static buildUrl(path: string, query?: Record<string, unknown> | QueryParams): string {
        return Linking.makeUrl(path, query as QueryParams);
    }
}
