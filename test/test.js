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
        testURLSafe64,
        testRandom,
    ]).run().clone();

function testBase64(next) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testBase64EncodeAndDecode(next) {

    function _test(source) {
        var base64 = Base64.encode( DataType["Array"].fromString(source) );
        var revert = DataType["Array"].toString( Base64.decode(base64) );

        return source === revert;
    }

    var source = "1234567890ABCDEFGHIJKLMN"; // -> "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"

    if (_test(source) &&
        _test(source + source) &&
        _test((source + source).slice(2, 20))) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testBase64atobAndbtoa(next) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.btoa(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testURLSafe64(next) {

    var source = "0=~|"; // -> URLSafe64("0=~|") -> "MD1-fA"
                         // ->    Base64("0=~|") -> "MD1+fA=="
    var urlsafe64 = Base64.toURLSafe64( Base64.encode( DataType["Array"].fromString(source) ) );
    var revert = DataType["Array"].toString( Base64.decode( Base64.fromURLSafe64( urlsafe64 ) ) );

    if (source !== revert || /[\+\/\=]/.test(urlsafe64)) {
        next && next.miss();
    } else {
        next && next.pass();
    }
}

function testRandom(next) {

    function _test(source) {
        var base64 = Base64.encode( source );
        var revert = Base64.decode( base64 );

        return JSON.stringify(source) === JSON.stringify(revert);
    }

    function _testEncodeArray(source) {
        var base64 = Base64.encodeArray( source );
        var revert = Base64.decodeArray( base64 );

        return JSON.stringify(Array.prototype.slice.call(source)) ===
               JSON.stringify(Array.prototype.slice.call(revert));
    }

    function _testEncodeTypedArray(source) {
        var typedSource = new Uint8Array(source);
        var typedBase64 = Base64.encodeTypedArray( typedSource );
        var typedRevert = Base64.decodeTypedArray( typedBase64 );

        return JSON.stringify(Array.prototype.slice.call(typedSource)) ===
               JSON.stringify(Array.prototype.slice.call(typedRevert));
    }

    function _testMatch(source) {
        var typedSource      = new Uint8Array(source);

        var base64Array      = Base64.encodeArray( source );
        var base64TypedArray = Base64.encodeTypedArray( typedSource );


        var revertArray      = Base64.decodeArray( base64Array );
        var revertTypedArray = Base64.decodeTypedArray( base64TypedArray );

        var fail  = 0x00;

        if ( JSON.stringify(Array.prototype.slice.call(base64Array)) !==
             JSON.stringify(Array.prototype.slice.call(base64TypedArray)) ) {
            fail |= 0x01;
        }
        if ( JSON.stringify(Array.prototype.slice.call(revertArray)) !==
             JSON.stringify(Array.prototype.slice.call(revertTypedArray)) ) {
            fail |= 0x02;
        }
        if ( base64Array.length !== base64TypedArray.length ) {
            fail |= 0x04;
        }
        if ( revertArray.length !== revertTypedArray.length ) {
            fail |= 0x08;
        }

        if (fail) {
            if (fail & 0x01) { console.log("encode fail"); }
            if (fail & 0x02) { console.log("decode fail"); }
            if (fail & 0x04) { console.log("encode length missmatch"); }
            if (fail & 0x08) { console.log("decode length missmatch"); }

            if (fail & 0x05) { // encode fail
                var i = 0, iz = Math.max(base64Array.length, base64TypedArray.length);

                for (; i < iz; ++i) {
                    if (base64Array[i] !== base64TypedArray[i]) {
                        debugger;
                        console.log("encode fail. index = " + i);
                        break;
                    }
                }
            }
            if (fail & 0x0a) { // decode fail
                var i = 0, iz = Math.max(revertArray.length, revertTypedArray.length);

                for (; i < iz; ++i) {
                    if (revertArray[i] !== revertTypedArray[i]) {
                        debugger;
                        console.log("decode fail. index = " + i);
                        break;
                    }
                }
            }
            return false;
        }

        return fail ? false : true;
    }

    function _random(times) {

        for (var i = 0, iz = times; i < iz; ++i) {
            var jz = (XORShift.random() & 0xff) + 10;
            var ary = [];

            for (var j = 0; j < jz; ++j) {
                ary.push( XORShift.random() & 0xff );
            }
            if ( !_test(ary) ) {
                debugger;
                _test(ary);
                return false;
            }
            if ( !_testEncodeArray(ary) ) {
                debugger;
                _testEncodeArray(ary);
                return false;
            }
            if ( !_testEncodeTypedArray(ary) ) {
                debugger;
                _testEncodeTypedArray(ary);
                return false;
            }
            if ( !_testMatch(ary) ) {
                debugger;
                _testMatch(ary);
                return false;
            }
        }
        return true;
    }

    XORShift.init();
    var times = 1000;

    if (_random(times)) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}


})((this || 0).self || global);

