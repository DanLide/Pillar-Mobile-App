import { Dimensions } from 'react-native';

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
export const isIPod = WIDTH <= 320;
