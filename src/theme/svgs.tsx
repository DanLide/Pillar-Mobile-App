import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { memo } from 'react';

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

export const SearchIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M3.5 10c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5A6.508 6.508 0 0 1 3.5 10ZM22 20.817l-5.785-5.784A7.962 7.962 0 0 0 18 10a8 8 0 1 0-8 8c1.97 0 3.771-.715 5.166-1.896l5.773 5.774L22 20.817Z"
      clipRule="evenodd"
    />
  </Svg>
));

export const StoreIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color}
      d="M20 6H4V4h16v2Zm-5.7 6c-.8.96-1.3 2.18-1.3 3.5 0 1.14.43 2.36 1 3.5v1H4v-6H3v-2l1-5h16l.7 3.5c-.66-.32-1.38-.5-2.14-.5l-.2-1H5.64l-.6 3h9.26ZM12 14H6v4h6v-4Zm10 1.5c0 2.6-3.5 6.5-3.5 6.5S15 18.1 15 15.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5Zm-2.3.1c0-.6-.6-1.2-1.2-1.2s-1.2.5-1.2 1.2c0 .6.5 1.2 1.2 1.2s1.3-.6 1.2-1.2Z"
    />
  </Svg>
));

export const QRIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} fill="" {...props}>
    <Path
      fill={props.color || '#eeeeee'}
      d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm0-2h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8 8h-1v-2h1v1h2v1h-1v1h-1v-1zm2 12v-1h-1v1h1zm-1-15v-1h-2v1h1v1h1v-1zm8-1v6h-1v-1h-4v-5h5zm-1 4v-3h-3v3h3zm-14 2h-1v1h2v-1h-1zm0 3h1v1h1v-3h-1v1h-2v2h1v-1zm5 1v2h1v-2h-1zm4-10h-1v3h1v-3zm0 5v-1h-1v1h1zm3-2h1v-1h-1v1zm-10-1h-1v1h1v-1zm2-2v5h-5v-5h5zm-1 1h-3v3h3v-3zm9 5v1h-1v-1h-2v1h-1v-1h-3v-1h-1v1h-1v1h1v2h1v-1h1v2h1v-2h3v1h-2v1h2v1h1v-3h1v1h1v2h1v-1h1v-1h-1v-1h-1v-1h1v-1h-2zm-11 8h1v-1h-1v1zm-2-3h5v5h-5v-5zm1 4h3v-3h-3v3zm12-3v-1h-1v1h1zm0 1h-1v1h-1v-1h-1v-1h1v-1h-2v-1h-1v2h-1v1h-1v3h1v-1h1v-1h2v2h1v-1h1v1h2v-1h1v-1h-2v-1zm-9-3h1v-1h-1v1zm10 2v1h1v1h1v-3h-1v1h-1zm2 4v-1h-1v1h1zm0-8v-1h-1v1h1z" />
  </Svg>
));