Base64.js
=========

Base64.js is convert Base64/URLSafe64 string.

# Document

https://github.com/uupaa/Base64.js/wiki/Base64

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

# for Developers

1. Install development dependency tools

    ```sh
    $ brew install closure-compiler
    $ brew install node
    $ npm install -g plato
    ```

2. Clone Repository and Install

    ```sh
    $ git clone git@github.com:uupaa/Base64.js.git
    $ cd Base64.js
    $ npm install
    ```

3. Build and Minify

    `$ npm run build`

4. Test

    `$ npm run test`

5. Lint

    `$ npm run lint`

6. Perf

    http://jsperf.com/uupaa-base64/

