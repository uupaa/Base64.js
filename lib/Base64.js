(function(global) {
"use strict";

// --- dependency module -----------------------------------
var DataType = global["DataType"] || require("uupaa.datatype.js");

// --- local variable --------------------------------------
var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- define ----------------------------------------------
var BASE64_ENCODE = [
     65, 66, 67, 68,  69, 70, 71, 72,  73, 74, 75, 76,  77, 78, 79, 80,  // 00-0f
     81, 82, 83, 84,  85, 86, 87, 88,  89, 90, 97, 98,  99,100,101,102,  // 10-1f
    103,104,105,106, 107,108,109,110, 111,112,113,114, 115,116,117,118,  // 20-2f
    119,120,121,122,  48, 49, 50, 51,  52, 53, 54, 55,  56, 57, 43, 47]; // 30-3f
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

// --- interface -------------------------------------------
function Base64(source) { // @arg String
                          // @ret Base64String
                          // @desc Convert String to Base64String.
    return Base64_btoa(source);
}

//{@dev
Base64["repository"] = "https://github.com/uupaa/Base64.js";
//}@dev
Base64["btoa"]   = Base64_btoa;   // Base64.btoa(source:String):Base64String
Base64["atob"]   = Base64_atob;   // Base64.atob(source:Base64String):String
Base64["encode"] = Base64_encode; // Base64.encode(source:Uint8Array):Base64Uint8Array
Base64["decode"] = Base64_decode; // Base64.decode(source:Base64Uint8Array):Uint8Array

// --- implement -------------------------------------------
function Base64_btoa(source) { // @arg BinaryString
                               // @ret Base64String
//{@dev
    $valid($type(source, "BinaryString"), Base64_btoa, "source");
//}@dev

    if (_runOnNode) {
        return new Buffer(source, "ascii").toString("base64");
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

function Base64_atob(source) { // @arg Base64String
                               // @ret BinaryString
//{@dev
    $valid($type(source, "String"), Base64_atob, "source");
//}@dev

    if (_runOnNode) {
        return new Buffer(source, "base64").toString("ascii");
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
    $valid($type(source, "Uint8Array"), Base64_encode, "source");
//}@dev

    if (_runOnNode) {
        return new Uint8Array( _fromString( new Buffer(source).toString("base64") ) );
    }
    return _rawEncode(source);
}

function Base64_decode(source) { // @arg Base64Uint8Array
                                 // @ret Uint8Array
                                 // @desc Base64Uint8Array to Uint8Array.
//{@dev
    $valid($type(source, "Base64Uint8Array"), Base64_decode, "source");
//}@dev

    if (_runOnNode) {
        return new Uint8Array( new Buffer(_toString(source), "base64") );
    }
    return _rawDecode( source );
}

// --- raw -------------------------------------------------
function _rawEncode(source) {
    var resultLength = Math.ceil( source.length / 3 ) * 4;
    var result = new Uint8Array( resultLength );
    var c = 0, i = 0, iz = source.length;
    var resultIndex = 0;
    var pad = [0, 2, 1][iz % 3];
    var code = BASE64_ENCODE;

    for (; i < iz; resultIndex += 4, i += 3) {
        c = ((source[i    ] & 0xff) << 16) |
            ((source[i + 1] & 0xff) <<  8) |
             (source[i + 2] & 0xff); // 24bit

        result[resultIndex    ] = code[(c >> 18) & 0x3f];
        result[resultIndex + 1] = code[(c >> 12) & 0x3f];
        result[resultIndex + 2] = code[(c >>  6) & 0x3f];
        result[resultIndex + 3] = code[ c        & 0x3f];
    }
    if (pad > 1) {
        result[resultIndex - 2] = PADDING;
    }
    if (pad > 0) {
        result[resultIndex - 1] = PADDING;
    }
    return result;
}

function _rawDecode(source) {
    var resultLength = Math.ceil( source.length / 4 ) * 3;
    var result = new Uint8Array( resultLength );
    var c = 0, i = 0, iz = source.length;
    var resultIndex = 0;
    var code = BASE64_DECODE;

    for (; i < iz; resultIndex += 3, i += 4) {      // 00000000|00000000|00000000 (8 x 3 = 24bit)
        c = (code[source[i    ]] << 18) |           // 111111  |        |         (Base64 6bit)
            (code[source[i + 1]] << 12) |           //       22|2222    |         (Base64 6bit)
            (code[source[i + 2]] <<  6) |           //         |    3333|33       (Base64 6bit)
             code[source[i + 3]];                   //         |        |  444444 (Base64 6bit)
                                                    //    v        v        v
        result[resultIndex    ] = (c >> 16) & 0xff; // 11111122                   (8bit)
        result[resultIndex + 1] = (c >>  8) & 0xff; //          22223333          (8bit)
        result[resultIndex + 2] =  c        & 0xff; //                   33444444 (8bit)
    }
    if (source[iz - 2] === PADDING) {
        return result.subarray(0, resultIndex - 2);
    } else if (source[iz - 1] === PADDING) {
        return result.subarray(0, resultIndex - 1);
    }
    return result;
}

function _toString(source) { // @arg Uint8Array
                             // @ret BinaryString
    return DataType["Array"]["toString"](source);
}

function _fromString(source) { // @arg BinaryString
                               // @ret Uint8Array
    return DataType["Uint8Array"]["fromString"](source);
}

//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = Base64;
}
global["Base64" in global ? "Base64_" : "Base64"] = Base64; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom

