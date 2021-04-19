const { postcss } = require("svelte-preprocess");
module.exports = {
  preprocess: [postcss({ postcss: true })]
};

// se ha agregado { postcss: true }