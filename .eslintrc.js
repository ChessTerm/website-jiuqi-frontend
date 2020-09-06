module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
  ],
  rules: {
    "array-bracket-newline": "off",
    "array-bracket-spacing": ["warn", "never"],
    "block-spacing": ["warn", "always"],
    "comma-dangle": ["warn", "always-multiline"],
    "comma-spacing": ["warn", {
      "before": false,
      "after": true,
    }],
    "curly": ["warn", "multi-line"],
    "eol-last": ["warn", "always"],
    "import/no-mutable-exports": "off",
    "keyword-spacing": ["warn", {
      "before": true,
      "after": true,
    }],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["warn", "always"],
    "multiline-ternary": "off",
    "new-cap": ["error", {
      "newIsCap": true,
      "capIsNew": false,
    }],
    "no-console": ["warn", {
      "allow": ["warn", "error"],
    }],
    "no-extra-semi": "error",
    "no-multi-spaces": ["warn", {
      "ignoreEOLComments": true,
    }],
    "no-return-assign": "off",
    "no-trailing-spaces": ["error", {
      "skipBlankLines": true,
    }],
    "object-curly-spacing": ["warn", "always", {
      "arraysInObjects": false,
      "objectsInObjects": false,
    }],
    "padded-blocks": "off",
    "prefer-promise-reject-errors": "off",
    "quotes": ["warn", "double", {
      "allowTemplateLiterals": true,
      "avoidEscape": true,
    }],
    "quote-props": ["warn", "consistent"],
    "semi": ["error", "never", {
      "beforeStatementContinuationChars": "never",
    }],
    "space-before-blocks": ["warn", "always"],
    "space-before-function-paren": ["warn", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always",
    }],
    "space-in-parens": ["warn", "never"],
    "space-unary-ops": ["warn", {
      "words": true,
      "nonwords": false,
    }],
    "spaced-comment": ["warn", "always"],
    "switch-colon-spacing": ["warn", {
      "after": true,
      "before": false,
    }],
    "vue/html-closing-bracket-newline": ["warn", {
      "singleline": "never",
      "multiline": "never",
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": {
        "max": 3,
        "allowFirstLine": true,
      },
    }],
  },
}
