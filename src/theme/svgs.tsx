import React, { memo } from 'react';
import Svg, { Mask, Path, SvgProps } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

interface SvgPropsWithColors extends SvgProps {
  primaryColor?: string;
  secondaryColor?: string;
}

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

export const CloseSmallIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M15.888 7 12 10.889 8.111 7 7 8.111l3.889 3.888L7 15.888 8.111 17 12 13.111 15.888 17l1.111-1.112-3.888-3.889 3.888-3.888L15.888 7Z"
      clipRule="evenodd"
    />
  </Svg>
));

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

export const ListIcon = memo((props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#202024"
      fillRule="evenodd"
      d="M2 7h2V5H2v2Zm4.001-.249H22v-1.5H6.001v1.5Zm15.999 12H6.001v-1.5H22v1.5Zm-20 .25h2v-2H2v2Zm20-6.251H6.001v-1.499H22v1.499Zm-20 .251h2v-2H2v2Z"
      clipRule="evenodd"
    />
  </Svg>
));

export const AffirmativeIcon = memo(
  ({ primaryColor, secondaryColor, ...props }: SvgPropsWithColors) => (
    <Svg width={17} height={17} fill="none" {...props}>
      <Mask
        id="a"
        width={16}
        height={16}
        x={0.249}
        y={0.25}
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <Path fill="#fff" d="M.249.25h16v16h-16z" />
        <Path
          fillRule="evenodd"
          d="m11.347 5.924.629.674-5.01 4.676-1.95-1.95.652-.651 1.32 1.32 4.359-4.07ZM8.498 2.25a6.257 6.257 0 0 0-6.25 6.25 6.257 6.257 0 0 0 6.25 6.25 6.257 6.257 0 0 0 6.25-6.25 6.257 6.257 0 0 0-6.25-6.25Z"
          clipRule="evenodd"
        />
      </Mask>
      <Path
        fill={primaryColor}
        fillRule="evenodd"
        d="m11.347 5.924.629.674-5.01 4.676-1.95-1.95.652-.651 1.32 1.32 4.359-4.07ZM8.498 2.25a6.257 6.257 0 0 0-6.25 6.25 6.257 6.257 0 0 0 6.25 6.25 6.257 6.257 0 0 0 6.25-6.25 6.257 6.257 0 0 0-6.25-6.25Z"
        clipRule="evenodd"
      />
      <Path
        fill={secondaryColor}
        d="M11.347 5.924 12.443 4.9l-1.024-1.096-1.096 1.023 1.024 1.097Zm.629.674 1.023 1.096 1.097-1.024-1.024-1.096-1.096 1.024Zm-5.01 4.676-1.062 1.06L6.93 13.36l1.06-.989-1.024-1.096Zm-1.95-1.95-1.06-1.06-1.06 1.06 1.06 1.061 1.06-1.06Zm.652-.651 1.061-1.06L5.67 6.55 4.608 7.612l1.06 1.06Zm1.32 1.32-1.062 1.06 1.025 1.025 1.06-.99-1.024-1.096Zm3.262-3.045.63.674 2.192-2.048-.63-.674-2.192 2.048Zm.702-1.447-5.01 4.676 2.047 2.194 5.01-4.677-2.047-2.193Zm-2.926 4.712L6.077 8.264l-2.121 2.121 1.948 1.95 2.122-2.122Zm-1.949.172.652-.652-2.121-2.121-.652.652 2.121 2.121Zm-1.47-.652 1.32 1.32 2.121-2.121-1.319-1.32-2.122 2.121ZM8.01 11.09l4.36-4.068-2.047-2.194-4.36 4.068L8.01 11.09ZM8.5.75C4.225.75.749 4.225.749 8.5h3a4.758 4.758 0 0 1 4.75-4.75v-3ZM.749 8.5c0 4.275 3.476 7.75 7.75 7.75v-3a4.758 4.758 0 0 1-4.75-4.75h-3Zm7.75 7.75c4.275 0 7.75-3.475 7.75-7.75h-3a4.757 4.757 0 0 1-4.75 4.75v3Zm7.75-7.75c0-4.275-3.475-7.75-7.75-7.75v3a4.757 4.757 0 0 1 4.75 4.75h3Z"
        mask="url(#a)"
      />
    </Svg>
  ),
);

export const ErrorIcon = memo(
  ({ primaryColor, secondaryColor, ...props }: SvgPropsWithColors) => (
    <Svg width={17} height={17} fill="none" {...props}>
      <Mask
        id="a"
        width={16}
        height={16}
        x={0.249}
        y={0.25}
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <Path fill="#fff" d="M.249.25h16v16h-16z" />
        <Path
          fillRule="evenodd"
          d="M9.169 11.653c0 .364-.3.66-.67.66a.665.665 0 1 1 0-1.329c.375 0 .67.294.67.669ZM8.163 10.02l-.195-5.333H9.07l-.185 5.333h-.723ZM8.5 2.25a6.257 6.257 0 0 0-6.25 6.25 6.257 6.257 0 0 0 6.25 6.25 6.258 6.258 0 0 0 6.25-6.25 6.257 6.257 0 0 0-6.25-6.25Z"
          clipRule="evenodd"
        />
      </Mask>
      <Path
        fill={primaryColor}
        fillRule="evenodd"
        d="M9.169 11.653c0 .364-.3.66-.67.66a.665.665 0 1 1 0-1.329c.375 0 .67.294.67.669ZM8.163 10.02l-.195-5.333H9.07l-.185 5.333h-.723ZM8.5 2.25a6.257 6.257 0 0 0-6.25 6.25 6.257 6.257 0 0 0 6.25 6.25 6.258 6.258 0 0 0 6.25-6.25 6.257 6.257 0 0 0-6.25-6.25Z"
        clipRule="evenodd"
      />
      <Path
        fill={secondaryColor}
        d="m8.163 10.02-1.499.056.053 1.444h1.446v-1.5Zm-.195-5.333v-1.5H6.412l.057 1.555 1.499-.055Zm1.103 0 1.499.052.054-1.552H9.07v1.5Zm-.185 5.333v1.5h1.449l.05-1.447-1.5-.053Zm-1.217 1.633c0-.486.393-.84.83-.84v3c1.177 0 2.17-.947 2.17-2.16h-3Zm.83-.84c.438 0 .831.354.831.84h-3c0 1.213.993 2.16 2.17 2.16v-3Zm.831.84a.838.838 0 0 1-.83.831v-3c-1.204 0-2.17.965-2.17 2.169h3Zm-.83.831a.838.838 0 0 1-.831-.831h3a2.162 2.162 0 0 0-2.17-2.169v3Zm1.162-2.518-.195-5.334-2.998.11.195 5.333 2.998-.11Zm-1.694-3.78H9.07v-3H7.968v3Zm-.396-1.551-.185 5.334 2.998.104.185-5.334-2.998-.104ZM8.886 8.52h-.723v3h.723v-3ZM8.499.75C4.224.75.749 4.224.749 8.5h3a4.757 4.757 0 0 1 4.75-4.75v-3ZM.749 8.5c0 4.274 3.475 7.75 7.75 7.75v-3a4.757 4.757 0 0 1-4.75-4.75h-3Zm7.75 7.75c4.274 0 7.75-3.476 7.75-7.75h-3a4.758 4.758 0 0 1-4.75 4.75v3Zm7.75-7.75c0-4.276-3.476-7.75-7.75-7.75v3a4.757 4.757 0 0 1 4.75 4.75h3Z"
        mask="url(#a)"
      />
    </Svg>
  ),
);

export const ListAffirmativeIcon = memo(
  ({ color, primaryColor, secondaryColor }: SvgPropsWithColors) => (
    <View style={styles.iconRelative}>
      <ListIcon color={color} />
      <AffirmativeIcon
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        style={styles.iconAbsolute}
      />
    </View>
  ),
);

export const ListErrorIcon = memo(
  ({ color, primaryColor, secondaryColor }: SvgPropsWithColors) => (
    <View style={styles.iconRelative}>
      <ListIcon color={color} />
      <ErrorIcon
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        style={styles.iconAbsolute}
      />
    </View>
  ),
);

const styles = StyleSheet.create({
  iconRelative: { position: 'relative' },
  iconAbsolute: { position: 'absolute', bottom: -3, right: -6 },
});
