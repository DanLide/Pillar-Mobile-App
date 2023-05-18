module.exports = {
  preset: 'react-native',
  resetMocks: false,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
};
