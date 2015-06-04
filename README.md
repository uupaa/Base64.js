# Base64.js [![Build Status](https://travis-ci.org/uupaa/Base64.js.svg)](https://travis-ci.org/uupaa/Base64.js)

[![npm](https://nodei.co/npm/uupaa.base64.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.base64.js/)



- Base64.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/Base64.js/wiki/Base64)

## Browser and NW.js(node-webkit)

```js
<script src="<your-install-dir>/lib/WebModule.js"></script>
<script src="<your-install-dir>/lib/Base64.js"></script>
<script>
console.log( WebModule.Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
</script>
```

## WebWorkers

```js
importScripts("<your-install-dir>lib/WebModule.js");
importScripts("<your-install-dir>lib/Base64.js");

```

## Node.js

```js
require("<your-install-dir>lib/WebModule.js");
require("<your-install-dir>lib/Base64.js");

```

