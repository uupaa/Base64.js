# Base64.js [![Build Status](https://travis-ci.org/uupaa/Base64.js.png)](http://travis-ci.org/uupaa/Base64.js)

[![npm](https://nodei.co/npm/uupaa.base64.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.base64.js/)

Convert Base64/URLSafe64 string.

## Document

- [Base64.js wiki](https://github.com/uupaa/Base64.js/wiki/Base64)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```js
<script src="lib/Base64.js">
<script>
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
</script>
```

### WebWorkers

```js
importScripts("lib/Base64.js");
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
```

### Node.js

```js
var Base64 = require("lib/Base64.js");
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
```

