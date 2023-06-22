module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-transform-private-methods', { loose: true }],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
