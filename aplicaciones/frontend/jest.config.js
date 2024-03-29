module.exports = {
    transform: {
      '^.+\\.svelte$': 'svelte-jester',
      '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'svelte'],
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [
        "@testing-library/jest-dom/extend-expect"
    ]
  }