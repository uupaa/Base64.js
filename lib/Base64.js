(function(global) {
"use strict";

// --- dependency module -----------------------------------
//{@dev
//  This code block will be removed in `$ npm run build-release`. http://git.io/Minify
//var Valid = global["Valid"] || require("uupaa.valid.js"); // http://git.io/Valid
//}@dev

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

Base64["repository"] = "https://github.com/uupaa/Base64.js";

Base64["btoa"]              = Base64_btoa;              // Base64.btoa(source:String):Base64String
Base64["atob"]              = Base64_atob;              // Base64.atob(source:Base64String):String
Base64["encode"]            = Base64_encode;            // Base64.encode(source:ByteArray):Base64String
Base64["decode"]            = Base64_decode;            // Base64.decode(source:Base64String):ByteArray
// --- raw codec ---
Base64["encodeArray"]       = Base64_encodeArray;       // Base64.encodeArray(source:ByteArray):Base64ByteArray
Base64["decodeArray"]       = Base64_decodeArray;       // Base64.decodeArray(source:Base64ByteArray):ByteArray
Base64["encodeTypedArray"]  = Base64_encodeTypedArray;  // Base64.encodeTypedArray(source:Uint8Array):Base64Uint8Array
Base64["decodeTypedArray"]  = Base64_decodeTypedArray;  // Base64.decodeTypedArray(source:Base64Uint8Array):Uint8Array
// --- URLSafe64 ---
Base64["toURLSafe64"]       = Base64_toURLSafe64;       // Base64.toURLSafe64(source:Base64String):URLSafe64String
Base64["fromURLSafe64"]     = Base64_fromURLSafe64;     // Base64.fromURLSafe64(source:URLSafe64String):Base64String

// --- implement -------------------------------------------
function Base64_btoa(source) { // @arg BinaryString
                               // @ret Base64String
                               // @desc Base64 encode wrapper
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
        return global["btoa"](
                    DataType["Array"]["toString"](
                        DataType["Array"]["fromString"](source) ) ); // low-pass filter
    }
    return Base64_encode( DataType["Array"]["fromString"](source) );
}

function Base64_atob(source) { // @arg Base64String
                               // @ret BinaryString
                               // @desc Base64 decode wrapper
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
    return DataType["Array"]["toString"]( Base64_decode(source) );
}

function Base64_encode(source) { // @arg ByteArray [0xff, ...]
                                 // @ret Base64String
                                 // @desc ByteArray to Base64String.
//{@dev
    $valid($type(source, "ByteArray"), Base64_encode, "source");
//}@dev

    if (_runOnNode) {
        return new Buffer(source).toString("base64");
    }
  //return ByteArray["toString"](Base64_encodeArray(source));
    return DataType["Array"]["toString"](Base64_encodeArray(source));
}

function Base64_decode(source) { // @arg Base64String
                                 // @ret ByteArray [0xff, ...]
                                 // @desc Base64String to ByteArray.
//{@dev
    $valid($type(source, "Base64String"), Base64_decode, "source");
//}@dev

    if (_runOnNode) {
        return Array.prototype.slice.call( new Buffer(source, "base64") ); // Buffer -> Array
    }
  //return Base64_decodeArray( ByteArray["fromString"](source) );
    return Base64_decodeArray( DataType["Array"]["fromString"](source) );
}

// --- raw -------------------------------------------------
function Base64_encodeArray(source) { // @arg ByteArray [0xff, ...]
                                      // @ret Base64ByteArray
                                      // @desc ByteArray to Base64ByteArray.
//{@dev
    $valid($type(source, "ByteArray"), Base64_encodeArray, "source");
//}@dev

    var result = [];
    var c = 0, i = -1, iz = source.length;
    var pad = [0, 2, 1][iz % 3];
    var code = BASE64_ENCODE;

    --iz;
    while (i < iz) {
        c = ((source[++i] & 0xff) << 16) |
            ((source[++i] & 0xff) <<  8) |
             (source[++i] & 0xff); // 24bit

        result.push( code[(c >> 18) & 0x3f],
                     code[(c >> 12) & 0x3f],
                     code[(c >>  6) & 0x3f],
                     code[ c        & 0x3f] );
    }
    if (pad > 1) {
        result[result.length - 2] = 61; // "=";
    }
    if (pad > 0) {
        result[result.length - 1] = 61; // "=";
    }
    return result;
}

function Base64_decodeArray(source) { // @arg Base64ByteArray
                                      // @ret ByteArray result [0xff, ...]
                                      // @desc Base64ByteArray to ByteArray.
//{@dev
    $valid($type(source, "Base64ByteArray"), Base64_decodeArray, "source");
//}@dev

    var result = [];
    var c = 0, i = 0, iz = source.length - 1;
    var code = BASE64_DECODE;

    while (i < iz) {                       // 00000000|00000000|00000000 (8 x 3 = 24bit)
        c = (code[source[i++]] << 18)      // 111111  |        |         (Base64 6bit)
          | (code[source[i++]] << 12)      //       22|2222    |         (Base64 6bit)
          | (code[source[i++]] <<  6)      //         |    3333|33       (Base64 6bit)
          |  code[source[i++]];            //         |        |  444444 (Base64 6bit)
                                           //    v        v        v
        result.push( (c >> 16) & 0xff,     // 11111122                   (8bit)
                     (c >>  8) & 0xff,     //          22223333          (8bit)
                      c        & 0xff );   //                   33444444 (8bit)
    }
    if (source[source.length - 2] === 61) {
        result.length -= 2;
    } else if (source[source.length - 1] === 61) {
        result.length -= 1;
    }
    return result;
}

function Base64_encodeTypedArray(source) { // @arg Uint8Array [0xff, ...]
                                           // @ret Uint8Array
                                           // @desc Uint8Array to Base64Uint8Array.
//{@dev
    $valid($type(source, "Uint8Array"), Base64_encodeTypedArray, "source");
//}@dev

    var resultLength = Math.ceil(source.length / 3) * 4;
    var resultIndex = 0;
    var result = new Uint8Array(resultLength);

    var c = 0, i = -1, iz = source.length;
    var pad = [0, 2, 1][iz % 3]; // 0 or 1 or 2
    var code = BASE64_ENCODE;

    --iz;
    while (i < iz) {
        c =  ((source[++i] & 0xff) << 16) |
             ((source[++i] & 0xff) <<  8) |
              (source[++i] & 0xff); // 24bit

        result[resultIndex++] = code[(c >> 18) & 0x3f];
        result[resultIndex++] = code[(c >> 12) & 0x3f];
        result[resultIndex++] = code[(c >>  6) & 0x3f];
        result[resultIndex++] = code[ c        & 0x3f];
    }

    if (pad > 1) {
        result[resultIndex - 2] = 61; // "="
    }
    if (pad > 0) {
        result[resultIndex - 1] = 61; // "="
    }
    return result;
}

function Base64_decodeTypedArray(source) { // @arg Uint8Array
                                           // @ret Uint8Array result [0xff, ...]
                                           // @desc Base64Uint8Array to Uint8Array.
//{@dev
    $valid($type(source, "Uint8Array"), Base64_decodeTypedArray, "source");
//}@dev

    var result = new Uint8Array(source.length);
    var resultIndex = 0;
    var c = 0, i = 0, iz = source.length - 1;
    var code = BASE64_DECODE;

    while (i < iz) {                              // 00000000|00000000|00000000 (8 x 3 = 24bit)
        c = (code[source[i++]] << 18)             // 111111  |        |         (Base64 6bit)
          | (code[source[i++]] << 12)             //       22|2222    |         (Base64 6bit)
          | (code[source[i++]] <<  6)             //         |    3333|33       (Base64 6bit)
          |  code[source[i++]];                   //         |        |  444444 (Base64 6bit)
                                                  //    v        v        v
        result[resultIndex++] = (c >> 16) & 0xff; // 11111122                   (8bit)
        result[resultIndex++] = (c >>  8) & 0xff; //          22223333          (8bit)
        result[resultIndex++] =  c        & 0xff; //                   33444444 (8bit)
    }
    if (source[source.length - 2] === 61) {
        return result.subarray(0, resultIndex - 2);
    } else if (source[source.length - 1] === 61) {
        return result.subarray(0, resultIndex - 1);
    }
    return result.subarray(0, resultIndex);
}

// --- URLSafe64 -------------------------------------------
function Base64_toURLSafe64(source) { // @arg Base64String
                                      // @ret URLSafe64String
                                      // @desc Base64String to URLSafe64String.
//{@dev
    $valid($type(source, "String"), Base64_toURLSafe64, "source");
//}@dev

    return source.replace(/\=+$/g, ""). // remove tail "=="
                  replace(/\+/g, "-").  // replace "+" -> "-",
                  replace(/\//g, "_");  // replace "/" -> "_"
}

function Base64_fromURLSafe64(source) { // @arg URLSafe64String
                                        // @ret Base64String
                                        // @desc URLSafe64String to Base64String.
//{@dev
    $valid($type(source, "String"), Base64_fromURLSafe64, "source");
//}@dev

    var result = source.replace(/\-/g, "+").replace(/_/g, "/");

    switch (result.length % 4) {
    case 1: result += "="; break;
    case 2: result += "==";
    }
    return result;
}

//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//}@dev

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = Base64;
}
global["Base64" in global ? "Base64_" : "Base64"] = Base64; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom

