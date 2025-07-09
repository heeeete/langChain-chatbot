/** @type {import("prettier").Config} */
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/app.css',
  tailwindFunctions: ['clsx'],
  tailwindAttributes: [],
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 90,
};
