import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "coverage/**",
      "node_modules/**",
      "__MACOSX/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2024,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        xit: "readonly"
      }
    },
    rules: {
      "block-scoped-var": "error",
      "brace-style": ["error", "1tbs"],
      "consistent-return": "error",
      "curly": "error",
      "no-else-return": "error",
      "no-eq-null": "error",
      "no-extra-parens": ["error", "functions"],
      "no-floating-decimal": "error",
      "no-lonely-if": "error",
      "no-mixed-spaces-and-tabs": "off",
      "no-nested-ternary": "error",
      "no-path-concat": "error",
      "no-redeclare": "error",
      "no-self-compare": "error",
      "semi-spacing": "error",
      "no-trailing-spaces": "error",
      "no-undef": "off",
      "no-underscore-dangle": "off",
      "no-unused-vars": ["error", { "args": "none", "vars": "all" }],
      "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
      "quotes": ["warn", "double", { "avoidEscape": true }],
      "radix": "error",
      "semi": ["error", "always"],
      "sort-vars": "error",
      "space-unary-ops": "error",
      "wrap-iife": ["error", "inside"]
    }
  }
];
