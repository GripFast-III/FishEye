module.exports = {
  extends: ["semistandard"],
  rules: {
    eqeqeq: "warn",
    indent: ["warn", 2, { SwitchCase: 1 }],
    multilineTernary: ["warn", "always-multiline"],
  },
};
