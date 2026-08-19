module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^expo-constants$': '<rootDir>/src/api/__tests__/__mocks__/expo-constants.js',
    '^expo-secure-store$': '<rootDir>/src/api/__tests__/__mocks__/expo-secure-store.js',
  },
};
