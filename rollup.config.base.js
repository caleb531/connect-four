// This file contains the Rollup configuration common to both the app config and
// test config files

module.exports = {
  output: {
    name: 'connectFour',
    sourcemap: true,
    format: 'iife',
    globals: {
      'mithril': 'm',
      'underscore': '_',
      'tiny-emitter': 'TinyEmitter',
      'fastclick': 'FastClick',
      'sw-update-manager': 'SWUpdateManager',
      'socket.io-client': 'io',
      'clipboard': 'ClipboardJS'
    }
  },
  external: [
    'mithril',
    'underscore',
    'tiny-emitter',
    'fastclick',
    'sw-update-manager',
    'socket.io-client',
    'clipboard'
  ]
};
