module.exports = {
    "extends": "airbnb",
     "globals": {
      "localStorage": true,
      "document": true,
      "describe": true,
      "beforeAll": true,
     },
     "parser": "babel-eslint",
     "rules": {
        "linebreak-style": 0,
        "no-console": 0,
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "react/forbid-prop-types": 0,
        "prefer-destructuring": ["error", {
          "array": false,
          "object": true
        }]
    }
};