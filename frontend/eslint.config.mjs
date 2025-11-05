import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["coverage/**", ".eslintrc.cjs"]
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        process: "readonly"
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react/no-unescaped-entities": "warn"
    }
  },
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}"
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
]);
