module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "es6": true,
        "browser": true
    },
    "parserOptions": {
        "sourceType": "module", // allows import and export
         "ecmaVersion": 8
    },
    "rules": {
         "no-console": "off"
    },
    "globals": {
        "console": "readonly",
        "PUBLICPATH": "readonly",
        "module": "readonly",
        "process": "readonly"
    }
}