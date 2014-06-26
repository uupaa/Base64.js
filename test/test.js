var ModuleTestBase64 = (function(global) {

return new Test("Base64", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true,
    }).add([
        testBase64,
        testBase64EncodeAndDecode,
        testBase64atobAndbtoa,
        testRandom,
    ]).run().clone();

function testBase64(test, pass, miss) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testBase64EncodeAndDecode(test, pass, miss) {

    function _test(source) {
        var base64 = Base64.encode( DataType["Uint8Array"].fromString(source) );
        var revert = DataType["Array"].toString( Base64.decode(base64) );

        return source === revert;
    }

    var source = "1234567890ABCDEFGHIJKLMN"; // -> "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"

    if (_test(source) &&
        _test(source + source) &&
        _test((source + source).slice(2, 20))) {
        test.done(pass());
    } else {
        test.done(miss());
    }
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

function testRandom(test, pass, miss) {

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
            var jz = (random.value(decimal) & 0xff) + 10;
            var ary = [];

            for (var j = 0; j < jz; ++j) {
                ary.push( random.value(decimal) & 0xff );
            }
            if ( !_testEncodeTypedArray(ary) ) {
                return false;
            }
        }
        return true;
    }

    var random = new Random();
    var times = 1000;

    if (_random(times)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}


})((this || 0).self || global);

