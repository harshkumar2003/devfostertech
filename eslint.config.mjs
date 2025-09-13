// eslint.config.mjs
import next from "eslint-config-next";

export default [
  ...next(),
  {
    rules: {
      // ✅ You can add custom ESLint rules here if you want
      "no-unused-vars": "warn",
      "react/no-unescaped-entities": "off"
    }
  }
];
