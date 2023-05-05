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

export const RefundIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 12c0 4.273 3.477 7.75 7.75 7.75S20 16.273 20 12s-3.477-7.75-7.75-7.75a7.68 7.68 0 00-4.569 1.5h2.569v1.5H5V2h1.5v2.761a9.176 9.176 0 015.75-2.011c5.101 0 9.25 4.149 9.25 9.25s-4.149 9.25-9.25 9.25S3 17.101 3 12h1.5z"
      fill={props.color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.018 16.901V15.62a2.71 2.71 0 00.877-.299c.256-.144.469-.316.641-.515.171-.199.302-.42.394-.661a2.025 2.025 0 00.004-1.455 1.935 1.935 0 00-.393-.63 2.445 2.445 0 00-.65-.488 3.18 3.18 0 00-.893-.299l-.957-.179c-.244-.048-.423-.132-.539-.252a.6.6 0 01-.173-.441c0-.195.089-.372.267-.529.178-.158.418-.237.719-.237.217 0 .398.032.541.094.142.064.262.141.351.232a.91.91 0 01.206.294c.044.104.074.199.089.283l1.428-.409a2.743 2.743 0 00-.18-.552 2.017 2.017 0 00-.351-.54 2.355 2.355 0 00-.567-.452 2.62 2.62 0 00-.814-.294V7h-1.207v1.27a2.96 2.96 0 00-.803.278 2.378 2.378 0 00-.65.489c-.186.195-.332.42-.438.672a2.14 2.14 0 00-.156.819c0 .531.172.986.514 1.364.344.378.82.623 1.428.736l.976.178c.238.042.426.126.563.252.136.126.205.28.205.462a.65.65 0 01-.268.541c-.18.136-.426.204-.74.204-.246 0-.457-.033-.637-.099a1.315 1.315 0 01-.445-.268 1.23 1.23 0 01-.279-.393 1.456 1.456 0 01-.12-.468l-1.461.346c.022.225.082.457.18.699.098.241.24.467.43.677.189.21.424.392.703.546.281.154.613.262.998.325v1.271h1.207z"
      fill={props.color}
    />
  </Svg>
));
