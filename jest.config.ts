import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.ts',
    'app/api/**/*.ts',
    'components/**/*.tsx'
  ],
  coverageThreshold: {
    global: {
      lines: 50,
      functions: 50,
      branches: 50,
      statements: 50,
    },
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
};

export default config;
