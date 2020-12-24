import { Dimensions } from 'react-native';
import * as Localization from 'expo-localization';

export const getResolution = (): string => `${Dimensions.get('window').width}x${Dimensions.get('window').height}`;

export const getLocale = (): string => Localization.locale;
