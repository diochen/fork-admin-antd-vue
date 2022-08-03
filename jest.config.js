const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  // 告訴Jest需要匹配的文件字尾
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  // 別名設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // 匹配哪些文件進行測試
  testMatch: ['**/tests/unit/**/*.spec.ts?(x)'],
  // 不進行匹配的目錄
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  // 匹配到 .vue 文件的時候用 vue-jest處理， 匹配到.js文件的時候用 babel-jest 處理
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest',
    '^.+\\.(t|j)sx?$': 'ts-jest'
  }
}