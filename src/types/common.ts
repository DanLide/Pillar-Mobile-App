import { colors, fonts } from 'src/theme';

export type IColors = typeof colors[keyof typeof colors];
export type IFonts = typeof fonts[keyof typeof fonts];
