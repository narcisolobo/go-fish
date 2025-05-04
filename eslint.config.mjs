import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    "prettier"
  ),
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  },
];

export default eslintConfig;
