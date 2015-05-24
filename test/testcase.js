var ModuleTestBase64 = (function(global) {

global["BENCHMARK"] = true;

var test = new Test("Base64", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        testBase64_btoa,
        testBase64_encode,
        testBase64_random,
        testBase64_issues2,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testBase64_btoa(test, pass, miss) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.btoa(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testBase64_encode(test, pass, miss) {

    function _test(source) {
        var base64 = Base64.encode( TypedArray.fromString(source) );
        var revert = TypedArray.toString( Base64.decode(base64) );

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

function testBase64_random(test, pass, miss) {

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

function testBase64_issues2(test, pass, miss) {
    var source = "nuko";
    var b64 = "";
    var revert = "";

    if (global.IS_NODE) {
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

return test.run();

})(GLOBAL);

