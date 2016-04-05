// Base64 test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.VERIFY  = true;
    WebModule.VERBOSE = true;
    WebModule.PUBLISH = true;

    importScripts("../../node_modules/uupaa.random.js/lib/Random.js");
    importScripts("../../node_modules/uupaa.typedarray.js/lib/TypedArray.js");
    importScripts("../wmtools.js");
    importScripts("../../lib/Base64.js");
    importScripts("../../release/Base64.w.min.js");
    importScripts("../testcase.js");

    self.postMessage(self.unitTest);
};

