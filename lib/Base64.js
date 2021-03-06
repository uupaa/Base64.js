(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Base64", function moduleClosure(global, WebModule, VERIFY /*, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var TypedArray  = WebModule["TypedArray"];
// --- import / local extract functions --------------------
var _toString   = TypedArray["toString"];
var _fromString = TypedArray["fromString"];
// --- define / local variables ----------------------------
var BASE64_ENCODE = [
     65,  66,  67,  68,   69,  70,  71,  72,   73,  74,  75,  76,   77,  78,  79,  80,  // 00-0f
     81,  82,  83,  84,   85,  86,  87,  88,   89,  90,  97,  98,   99, 100, 101, 102,  // 10-1f
    103, 104, 105, 106,  107, 108, 109, 110,  111, 112, 113, 114,  115, 116, 117, 118,  // 20-2f
    119, 120, 121, 122,   48,  49,  50,  51,   52,  53,  54,  55,   56,  57,  43,  47]; // 30-3f
var PADDING = 61; // "="
var BASE64_DECODE = [
      0,  0,  0,  0,   0,  0,  0,  0,   0,  0,  0,  0,   0,  0,  0,  0,  // 00-0f
      0,  0,  0,  0,   0,  0,  0,  0,   0,  0,  0,  0,   0,  0,  0,  0,  // 10-1f
      0,  0,  0,  0,   0,  0,  0,  0,   0,  0,  0, 62,   0, 62,  0, 63,  // 20-2f
     52, 53, 54, 55,  56, 57, 58, 59,  60, 61,  0,  0,   0,  0,  0,  0,  // 30-3f
      0,  0,  1,  2,   3,  4,  5,  6,   7,  8,  9, 10,  11, 12, 13, 14,  // 40-4f
     15, 16, 17, 18,  19, 20, 21, 22,  23, 24, 25,  0,   0,  0,  0, 63,  // 50-5f
      0, 26, 27, 28,  29, 30, 31, 32,  33, 34, 35, 36,  37, 38, 39, 40,  // 60-6f
     41, 42, 43, 44,  45, 46, 47, 48,  49, 50, 51,  0,   0,  0,  0,  0]; // 70-7f

// --- class / interfaces ----------------------------------
var Base64 = {
    "btoa":                         Base64_convertStringToBase64String, // Base64.btoa(source:String):Base64String
    "atob":                         Base64_convertBase64StringToString, // Base64.atob(source:Base64String):String
    "encode":                       Base64_encode,                      // Base64.encode(source:Uint8Array):Base64Uint8Array
    "decode":                       Base64_decode,                      // Base64.decode(source:Base64Uint8Array):Uint8Array
    "convertStringToBase64String":  Base64_convertStringToBase64String, // Base64_convertStringToBase64String(source:String):Base64String
    "convertBase64StringToString":  Base64_convertBase64StringToString, // Base64.convertBase64StringToString(source:Base64String):String
    "repository":                   "https://github.com/uupaa/Base64.js",
};

// --- implements ------------------------------------------
function Base64_convertStringToBase64String(source) { // @arg String
                                                      // @ret Base64String
                                                      // @desc btoa()
//{@dev
    if (VERIFY) {
        $valid($type(source, "String"), Base64_convertStringToBase64String, "source");
    }
//}@dev

    if (IN_NODE && global["Buffer"]) {
        if (Buffer["isBuffer"](source)) {
            return source["toString"]("base64");
        } else {
            return new Buffer(source["toString"](), "binary")["toString"]("base64");
        }
    }

    if ("btoa" in global) {
        try {
            return global["btoa"](source); // String to Base64String
        } catch (o_o) {
            // maybe. binary data has high-order bytes(non ascii value)
        }
        return global["btoa"]( _toString( _fromString(source) ) ); // low-pass filter
    }
    return _toString( Base64_encode( _fromString(source) ) );
}

function Base64_convertBase64StringToString(source) { // @arg Base64String
                                                      // @ret String
                                                      // @desc atob
//{@dev
    if (VERIFY) {
        $valid($type(source, "Base64String"), Base64_convertBase64StringToString, "source");
    }
//}@dev

    if (IN_NODE && global["Buffer"]) {
        return new Buffer(source, "base64")["toString"]("binary");
    }

    if ("atob" in global) {
        try {
            return global["atob"](source);
        } catch (o_o) {
            // maybe. broken base64 data
        }
    }
    return _toString( Base64_decode( _fromString(source) ) );
}

function Base64_encode(source) { // @arg Uint8Array
                                 // @ret Base64Uint8Array
                                 // @desc Uint8Array to Base64Uint8Array.
//{@dev
    if (VERIFY) {
        $valid($type(source, "Uint8Array"), Base64_encode, "source");
    }
//}@dev

    if (IN_NODE) {
        return _fromString( new Buffer(source)["toString"]("base64") );
    }
    return _rawBase64Encode(source);
}

function Base64_decode(source) { // @arg Base64Uint8Array
                                 // @ret Uint8Array
                                 // @desc Base64Uint8Array to Uint8Array.
//{@dev
    if (VERIFY) {
        $valid($type(source, "Base64Uint8Array"), Base64_decode, "source");
    }
//}@dev

    if (IN_NODE) {
        return new Uint8Array( new Buffer(_toString(source), "base64") );
    }
    return _rawBase64Decode(source);
}

function _rawBase64Encode(source) { // @arg Uint8Array
                                    // @ret Base64Uint8Array
    var result = new Uint8Array( Math.ceil(source.length / 3) * 4 );
    var cursor = 0; // result cursor
    var c = 0, i = 0, iz = source.length;
    var pad = [0, 2, 1][iz % 3];
    var code = BASE64_ENCODE;

    for (; i < iz; cursor += 4, i += 3) {
        c = ((source[i    ] & 0xff) << 16) |
            ((source[i + 1] & 0xff) <<  8) |
             (source[i + 2] & 0xff); // 24bit

        result[cursor    ] = code[(c >> 18) & 0x3f];
        result[cursor + 1] = code[(c >> 12) & 0x3f];
        result[cursor + 2] = code[(c >>  6) & 0x3f];
        result[cursor + 3] = code[ c        & 0x3f];
    }
    if (pad > 1) {
        result[cursor - 2] = PADDING;
    }
    if (pad > 0) {
        result[cursor - 1] = PADDING;
    }
    return result;
}

function _rawBase64Decode(source) { // @arg Base64Uint8Array
                                    // @ret Uint8Array
    var result = new Uint8Array( Math.ceil(source.length / 4) * 3 );
    var cursor = 0; // result cursor
    var c = 0, i = 0, iz = source.length;
    var code = BASE64_DECODE;

    for (; i < iz; cursor += 3, i += 4) {      // 00000000|00000000|00000000 (8 x 3 = 24bit)
        c = (code[source[i    ]] << 18) |      // 111111  |        |         (Base64 6bit)
            (code[source[i + 1]] << 12) |      //       22|2222    |         (Base64 6bit)
            (code[source[i + 2]] <<  6) |      //         |    3333|33       (Base64 6bit)
             code[source[i + 3]];              //         |        |  444444 (Base64 6bit)
                                               //    v        v        v
        result[cursor    ] = (c >> 16) & 0xff; // 11111122                   (8bit)
        result[cursor + 1] = (c >>  8) & 0xff; //          22223333          (8bit)
        result[cursor + 2] =  c        & 0xff; //                   33444444 (8bit)
    }
    if (source[iz - 2] === PADDING) {
        return result.subarray(0, cursor - 2);
    } else if (source[iz - 1] === PADDING) {
        return result.subarray(0, cursor - 1);
    }
    return result;
}

return Base64; // return entity

});

