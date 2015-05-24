# Base64.js [![Build Status](https://travis-ci.org/uupaa/Base64.js.png)](http://travis-ci.org/uupaa/Base64.js)

[![npm](https://nodei.co/npm/uupaa.base64.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.base64.js/)

Convert Base64/URLSafe64 string.

## Document

- [Base64.js wiki](https://github.com/uupaa/Base64.js/wiki/Base64)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

### Browser and node-webkit

```js
<script src="lib/Base64.js"></script>
<script>
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
</script>
```

### WebWorkers

```js
importScripts("lib/Base64.js");

```

### Node.js

```js
require("lib/Base64.js");

```

