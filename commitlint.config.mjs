export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Cursor / tooling often uses sentence case after the colon (e.g. "feat: Add auth").
    "subject-case": [0],
    "header-max-length": [2, "always", 120],
    // Git / Cursor "generate commit" usually emits the body as one long line; default 100 breaks that.
    "body-max-line-length": [0],
  },
};
