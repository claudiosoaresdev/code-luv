/** @type {import('lint-staged').Configuration} */
const config = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml,yaml,css}': ['prettier --write'],
}

export default config
