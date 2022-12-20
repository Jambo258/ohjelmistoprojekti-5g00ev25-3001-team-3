module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  modulePathIgnorePatterns: ['/dist/', '/build/'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura']
}
