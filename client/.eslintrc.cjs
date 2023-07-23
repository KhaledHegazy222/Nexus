module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-plugin/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "eslint-plugin"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
