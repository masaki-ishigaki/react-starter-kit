module.exports = {
  plugins: ["stylelint-scss"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-rational-order",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "max-line-length": null,
    "function-url-quotes": "never",
    "no-descending-specificity": null,
    "font-weight-notation": null,
    "font-family-no-missing-generic-family-keyword": null,
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
  },
}