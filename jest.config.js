module.exports = {
  // If you collect coverage, set the following item true
  // collectCoverage: true,
  // Please uncomment the following item when collecting coverage
  // collectCoverageFrom: [
  //   "src/**/*.{js,jsx,ts,tsx}",
  //   "!src/**/*.d.ts"
  // ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests",
  ],
  setupFileAfterEnv: [
    "<rootDir>/src/setupTests.ts",
  ],
  testMatch: [
    "<rootDir>/**/tests/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  transform: {
    "^.+\\>(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/jest/cssTransfroms.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
  ],
  verbose: true,
}