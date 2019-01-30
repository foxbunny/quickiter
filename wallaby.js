module.exports = () => {
  return {
    files: [
      'package.json',
      'lib/**/*.js',
      '!lib/**/*.test.js',
    ],
    tests: [
      'lib/**/*.test.js',
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
  };
};
