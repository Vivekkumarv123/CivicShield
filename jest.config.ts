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
    "app/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!app/layout.tsx",
    "!app/page.tsx",
    "!app/manifest.ts",
    "!app/globals.css",
    "!components/ElectionJourney.tsx",
    "!components/ElectionReadiness.tsx",
    "!components/Hero.tsx",
    "!components/LanguageSwitcher.tsx",
    "!components/MythVsFact.tsx",
  ],

  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },

  transformIgnorePatterns: [
    'node_modules/(?!(uncrypto|@upstash|ai|@ai-sdk)/)',
  ],
};

export default config;