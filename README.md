=========
Base64.js
=========

![](https://travis-ci.org/uupaa/Base64.js.png)

Convert Base64/URLSafe64 string.

# Document

- [Base64.js wiki](https://github.com/uupaa/Base64.js/wiki/Base64)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


# How to use

```js
<script src="lib/Base64.js">
<script>
// for Browser
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
</script>
```

```js
// for WebWorkers
importScripts("lib/Base64.js");
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
```

```js
// for Node.js
var Base64 = require("lib/Base64.js");
console.log( Base64("1234567890ABCDEFGHIJKLMN") ); // MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O
```

