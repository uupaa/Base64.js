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
        testURLSafe64
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
        var base64 = Base64.encode( ByteArray.fromString(source) );
        var revert = ByteArray.toString( Base64.decode(base64) );

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

    var testURLSafe64 = true;
    var source = "0=~|"; // -> URLSafe64("0=~|") -> "MD1-fA"
                         // ->    Base64("0=~|") -> "MD1+fA=="
    var base64 = Base64.encode( ByteArray.fromString(source), testURLSafe64 );
    var revert = ByteArray.toString( Base64.decode(base64) );

    if (source !== revert || /[\+\/\=]/.test(base64)) {
        next && next.miss();
    } else {
        next && next.pass();
    }
}

})((this || 0).self || global);

