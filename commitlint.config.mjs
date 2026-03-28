export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Cursor / tooling often uses sentence case after the colon (e.g. "feat: Add auth").
    "subject-case": [0],
    "header-max-length": [2, "always", 120],
  },
};
