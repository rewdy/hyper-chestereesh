const fs = require("fs");
const sass = require("sass");
const nunjucks = require("nunjucks");
const prettier = require("prettier");

(() => {
  // Step 1, compile sass
  const sassResult = sass.compile("./src/style.scss", { sourceMap: false });
  const indent = "      ";
  const indentedCss = sassResult.css
    .split("\n")
    .map((line, i) => (i > 0 ? indent + line : line))
    .join("\n");

  // Step 2, inject into index
  const configWithCss = nunjucks.render("./src/theme.js", { css: indentedCss });

  const prefix = `// HYPER-AM 😴\n// --
// This file is compiled from src/theme.js. Do not edit directly.\n\n`;
  const configWithPrefix = `${prefix}${configWithCss}`;

  // Step 3, format
  const configFormatted = prettier.format(configWithPrefix, {
    parser: "babel",
  });

  // Step 4, write it
  try {
    fs.writeFileSync("./index.js", configFormatted);
  } catch (err) {
    console.error("🚨", err);
  }
})();
