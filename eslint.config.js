import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["**/node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Попередження для невикористаних змінних, але ігноруємо ті, що починаються з "_"
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Забороняємо використання неоголошених змінних
      "no-undef": "error",
      // Дозволяємо console.log для дебагу
      "no-console": "off",
      // Вимагаємо подвійні лапки
      "quotes": ["warn", "double"],
      // Вимагаємо крапки з комою
      "semi": ["warn", "always"]
    }
  }
];