# Modulus logger

[![version](https://img.shields.io/npm/v/@modulus/logger.svg?style=flat-square)][version]
[![build](https://img.shields.io/travis/onmodulus/logger.svg?style=flat-square)][build]
[![coverage](https://img.shields.io/codeclimate/coverage/github/onmodulus/logger.svg?style=flat-square)][coverage]
[![code climate](https://img.shields.io/codeclimate/github/onmodulus/logger.svg?style=flat-square)][climate]
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]

A Winston wrapper with a simplified interface.

## Install

`npm install @modulus/logger`

## Usage

The returned object is a [winston] logger instance, so all behavior is
documented on that project. The addition of a namespace prefix mimics behavior
of our other favorite logger: [debug].

```
const Logger = require('@modulus/logger')('namespace');

Logger.info('message', { example: true });

// writes to process.stdout
// 2015-11-28T01:38:45.979Z INFO namespace message {"example":true}
```

### Log level

The default log level is `info`, but can be configured using the environment
variable `LOG_LEVEL`.

### Exceptions

All uncaught exceptions are automatically logged to `stderr` and the process is
exited. There is no need to add an additional handler.

[winston]: https://www.npmjs.com/package/winston
[debug]: https://www.npmjs.com/package/debug

[version]: https://www.npmjs.com/package/@modulus/logger
[build]: https://travis-ci.org/onmodulus/logger
[coverage]: https://codeclimate.com/github/onmodulus/logger/coverage
[climate]: https://codeclimate.com/github/onmodulus/logger/code
[license]: https://raw.githubusercontent.com/onmodulus/logger/master/LICENSE
