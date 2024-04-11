module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    // 'prettier/prettier': [
    //   {
    //     arrowParens: 'always',
    //     semi: false,
    //     trailingComma: 'none',
    //     tabWidth: 2,
    //     endOfLine: 'auto',
    //     useTabs: false,
    //     singleQuote: true,
    //     printWidth: 120,
    //     jsxSingleQuote: true
    //   }
    // ],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
}
