module.exports = {
  preset: 'react-native',
  resetMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'd.ts'],
  moduleDirectories: ['node_modules'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!jest-?@react-native-reanimated|react-native-vision-camera)/',
  ],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
    'react-dom': 'react-native',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
  },
};
