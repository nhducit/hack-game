const tailwindcss = require("tailwindcss");
// postcss.config.js
// const purgecss = require("@fullhuman/postcss-purgecss")({
//   // Specify the paths to all of the template files in your project
//   content: [
//     "./src/**/*.html",
//     "./src/**/*.tsx"
//     // etc.
//   ],
//   // Include any special characters you're using in this regular expression
//   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
// });

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
module.exports = {
  plugins: [
    require("postcss-easy-import"),
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer")
    // ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ]
};
