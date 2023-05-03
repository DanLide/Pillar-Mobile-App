import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const CloseIcon = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.142 0l-6.54 6.541L1.061 0 0 1.06l6.542 6.541L0 14.143l1.061 1.06 6.541-6.541 6.54 6.541 1.061-1.06-6.541-6.542 6.541-6.541L14.142 0z"
      fill={props.color}
    />
  </Svg>
);

export const ChevronIcon = (props: SvgProps) => (
  <Svg height="14.5" width="8.5" viewBox="0 0 7 12" {...props}>
    <Path
      d="M1.047 0L0 1.055 4.906 6 0 10.945 1.046 12h.002L7 6 1.047 0z"
      fill={props.color}
    />
  </Svg>
);

export const LogoutIcon = (props: SvgProps) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z"
      fill={props.color}
    />
  </Svg>
);

export const CheckMarkIcon = (props: SvgProps) => (
  <Svg width={13} height={10.5} viewBox="0 0 11 9" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.083 0L3.667 6.417l-2.75-2.75L0 4.584l2.75 2.75.917.916.916-.917L11 .917 10.083 0z"
      fill={props.color}
    />
  </Svg>
);
