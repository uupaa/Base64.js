var ModuleTestBase64 = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

global["BENCHMARK"] = true;

if (console) {
    if (!console.table) {
        console.table = console.dir;
    }
}

var test = new Test("Base64", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    }).add([
        testBase64,
        testBase64EncodeAndDecode,
        testBase64atobAndbtoa,
        testBase64Random,
        testBase64Issues2,
    ]);

if (_runOnBrowser || _runOnNodeWebKit) {
    //test.add([]);
} else if (_runOnWorker) {
    //test.add([]);
} else if (_runOnNode) {
    //test.add([]);
}

function testBase64(test, pass, miss) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.btoa(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testBase64EncodeAndDecode(test, pass, miss) {

    function _test(source) {
        var base64 = Base64.encode( Codec.StringToUint8Array(source) );
        var revert = Codec.Uint8ArrayToString( Base64.decode(base64) );

        return source === revert;
    }

    var source = "1234567890ABCDEFGHIJKLMN"; // -> "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"

    if (_test(source)) {
        if (_test(source + source)) {
            if (_test((source + source).slice(2, 20))) {
                test.done(pass());
                return;
            }
        }
    }
    test.done(miss());
}

function testBase64atobAndbtoa(test, pass, miss) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.btoa(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testBase64Random(test, pass, miss) {

    function _testEncodeTypedArray(source) {
        var typedSource = new Uint8Array(source);
        var typedBase64 = Base64.encode( typedSource );
        var typedRevert = Base64.decode( typedBase64 );

        return JSON.stringify(Array.prototype.slice.call(typedSource)) ===
               JSON.stringify(Array.prototype.slice.call(typedRevert));
    }

    function _random(times) {
        var decimal = true;

        for (var i = 0, iz = times; i < iz; ++i) {
            var jz = (random.next(decimal) & 0xff) + 10;
            var ary = [];

            for (var j = 0; j < jz; ++j) {
                ary.push( random.next(decimal) & 0xff );
            }
            if ( !_testEncodeTypedArray(ary) ) {
                return false;
            }
        }
        return true;
    }

    var random = new Random(); // Random.js
    var times = 1000;

    if (_random(times)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testBase64Issues2(test, pass, miss) {
    var source = "nuko";
    var b64 = "";
    var revert = "";

    if (_runOnNode) {
        // wrong way
        b64 = Base64.btoa(source);
        revert = Base64.atob(b64);
        //console.log(source, b64, revert);
        // good way
        b64 = new Buffer(source, "base64").toString("binary")
        revert = new Buffer(b64.toString(), "binary").toString("base64");
        //console.log(source, b64, revert);
    } else {
        b64 = atob(source);
        revert = btoa(b64);
        //console.log(source, b64, revert);
    }

    if (source === revert) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

return test.run().clone();

})((this || 0).self || global);

