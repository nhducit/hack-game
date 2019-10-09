const withCSS = require("@zeit/next-css");
const withImages = require("next-images");

module.exports = withImages(
  withCSS({
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty"
      };

      return config;
    }
  })
);
