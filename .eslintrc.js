'use strict'

module.exports = {
  parser: 'babel-eslint',
  extends: ['standard'],
  rules: {
    // This is for the mocha tests. It should be an override, but they dont work for me
    // http://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns
    'no-unused-expressions': 0
  },
  env: {
    'browser': true,
    'node': true,
    'mocha': true
  },
  globals: {
    sinon: true,
    expect: true,
    chai: true
  }
}
