// @name: Base64.js
// @require: Valid.js, ByteArray.js
// @cutoff: @assert @node

(function(global) {
"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert

var ByteArray = global["ByteArray"] || require("uupaa.bytearray.js");

var _inNode = "process" in global;

// --- define ----------------------------------------------
var BASE64_DB = {
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), // ["A", "B", ... "/"]
        codes: { "=": 0, "-": 62, "_": 63 } // { 65: 0, 66: 1 }
                                            // charCode and URLSafe64 chars("-", "_")
    };

for (var i = 0; i < 64; ++i) {
    BASE64_DB.codes[ BASE64_DB.chars[i] ] = i;
}

// --- interface -------------------------------------------
function Base64(source) { // @arg String:
                          // @ret Base64String:
                          // @help: Base64
                          // @desc: Convert String to Base64String.
    return Base64_btoa(source);
}

Base64["repository"] = "https://github.com/uupaa/Base64.js";

if (_inNode) {
//{@node
    Base64["btoa"]   = Buffer_btoa;    // Base64.btoa(source:String, hasHighOrderByte:Boolean = false):Base64String
    Base64["atob"]   = Buffer_atob;    // Base64.atob(source:Base64String):String
    Base64["encode"] = Buffer_encode;  // Base64.encode(source:ByteArray, toURLSafe64:Boolean = false):Base64String/URLSafe64String
    Base64["decode"] = Buffer_decode;  // Base64.decode(source:Base64String/URLSafe64String):ByteArray
//}@node
} else {
    Base64["btoa"]   = Base64_btoa;    // Base64.btoa(source:String, hasHighOrderByte:Boolean = false):Base64String
    Base64["atob"]   = Base64_atob;    // Base64.atob(source:Base64String):String
    Base64["encode"] = Base64_encode;  // Base64.encode(source:ByteArray, toURLSafe64:Boolean = false):Base64String/URLSafe64String
    Base64["decode"] = Base64_decode;  // Base64.decode(source:Base64String/URLSafe64String):ByteArray
}

// --- implement -------------------------------------------
function Base64_btoa(source) { // @arg String: binary string.
                               // @ret Base64String:
                               // @help: Base64.btoa
                               // @desc: Base64 encode wrapper
//{@assert
    _if(!Valid.type(source, "String"), "Base64.btoa(source)");
//}@assert

    if ("btoa" in global) {
        try {
            return global["btoa"](source); // String to Base64String
        } catch (o_o) {
            // maybe. binary data has high-order bytes(non ascii value)
        }
        return global["btoa"]( ByteArray["toString"]( ByteArray["fromString"](source) ) ); // low-pass filter
    }
    return Base64_encode( ByteArray["fromString"](source) );
}

function Base64_atob(source) { // @arg Base64String:
                               // @ret String:
                               // @help: Base64.atob
                               // @desc: Base64 decode wrapper
//{@assert
    _if(!Valid.type(source, "String"), "Base64.atob(source)");
//}@assert

    if ("atob" in global) {
        try {
            return global["atob"](source);
        } catch (o_o) {
            // maybe. broken base64 data
        }
    }
    return ByteArray["toString"]( Base64_decode(source) );
}

function Base64_encode(source,        // @arg ByteArray: [0xff, ...]
                       toURLSafe64) { // @arg Boolean(= false): true is URLSafe64
                                      // @ret Base64String/URLSafe64String:
                                      // @help: Base64.encode
                                      // @desc: ByteArray to Base64String.
//{@assert
    _if(!Valid.type(source, "Array"),             "Base64.encode(source)");
    _if(!Valid.type(toURLSafe64, "Boolean/omit"), "Base64.encode(,toURLSafe64)");
//}@assert

    var rv = [],
        c = 0, i = -1, iz = source.length,
        pad = [0, 2, 1][iz % 3],
        chars = BASE64_DB.chars;

    --iz;
    while (i < iz) {
        c =  ((source[++i] & 0xff) << 16) |
             ((source[++i] & 0xff) <<  8) |
              (source[++i] & 0xff); // 24bit

        rv.push(chars[(c >> 18) & 0x3f],
                chars[(c >> 12) & 0x3f],
                chars[(c >>  6) & 0x3f],
                chars[ c        & 0x3f]);
    }
    if (pad > 1) {
        rv[rv.length - 2] = "=";
    }
    if (pad > 0) {
        rv[rv.length - 1] = "=";
    }
    if (toURLSafe64) {
        return rv.join("").replace(/\=+$/g, ""). // remove tail "=="
                           replace(/\+/g, "-").  // replace "+" -> "-",
                           replace(/\//g, "_");  // replace "/" -> "_"
    }
    return rv.join("");
}

function Base64_decode(source) { // @arg Base64String/URLSafe64String:
                                 // @ret ByteArray: [0xff, ...]
                                 // @help: Base64.decode
                                 // @desc: Base64String to ByteArray.
//{@assert
    _if(!Valid.type(source, "String"), "Base64.decode(source)");
//}@assert

    var rv = [], c = 0, i = 0, ary = source.split(""),
        iz = source.length - 1,
        codes = BASE64_DB.codes;

    while (i < iz) {                // 00000000|00000000|00000000 (8 x 3 = 24bit)
        c = (codes[ary[i++]] << 18) // 111111  |        |         (Base64 6bit)
          | (codes[ary[i++]] << 12) //       22|2222    |         (Base64 6bit)
          | (codes[ary[i++]] <<  6) //         |    3333|33       (Base64 6bit)
          |  codes[ary[i++]];       //         |        |  444444 (Base64 6bit)
                                    //    v        v        v
        rv.push((c >> 16) & 0xff,   // 11111122                   (8bit)
                (c >>  8) & 0xff,   //          22223333          (8bit)
                 c        & 0xff);  //                   33444444 (8bit)
    }
    rv.length -= [0, 0, 2, 1][source.replace(/\=+$/, "").length % 4]; // cut tail

    return rv;
}

//{@node
function Buffer_btoa(source) { // @arg String: binary string.
                               // @ret Base64String:
                               // @help: Base64.btoa
                               // @desc: Base64 encode wrapper
//{@assert
    _if(!Valid.type(source, "String"), "Base64.btoa(source)");
//}@assert

    return new Buffer(source, "ascii").toString("base64");
}

function Buffer_atob(source) { // @arg Base64String:
                               // @ret String:
                               // @help: Base64.atob
                               // @desc: Base64 decode wrapper
//{@assert
    _if(!Valid.type(source, "String"), "Base64.atob(source)");
//}@assert

    return new Buffer(source, "base64").toString("ascii");
}

function Buffer_encode(source,        // @arg ByteArray: [0xff, ...]
                       toURLSafe64) { // @arg Boolean(= false): true is URLSafe64
                                      // @ret Base64String/URLSafe64String:
                                      // @help: Base64.encode
                                      // @desc: ByteArray to Base64String.
//{@assert
    _if(!Valid.type(source, "Array"),             "Base64.encode(source)");
    _if(!Valid.type(toURLSafe64, "Boolean/omit"), "Base64.encode(,toURLSafe64)");
//}@assert

    if (toURLSafe64) {
        return new Buffer(source).toString("base64").
                                  replace(/\=+$/g, ""). // remove tail "=="
                                  replace(/\+/g, "-").  // replace "+" -> "-",
                                  replace(/\//g, "_");  // replace "/" -> "_"
    }
    return new Buffer(source).toString("base64");
}

function Buffer_decode(source) { // @arg Base64String/URLSafe64String:
                                 // @ret ByteArray: [0xff, ...]
                                 // @help: Base64.decode
                                 // @desc: Base64String to ByteArray.
//{@assert
    _if(!Valid.type(source, "String"), "Base64.decode(source)");
//}@assert

    source = source.replace(/\-/g, "+").replace(/_/g, "/");

    return Array.prototype.slice.call( new Buffer(source, "base64") ); // Buffer -> Array
}
//}@node

//{@assert
function _if(value, msg) {
    if (value) {
        console.error(Valid.stack(msg));
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = Base64;
}
//}@node
if (global["Base64"]) {
    global["Base64_"] = Base64; // already exsists
} else {
    global["Base64"]  = Base64;
}

})((this || 0).self || global);

