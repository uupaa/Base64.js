// @name: Base64.js
// @require: ByteArray.js

(function(global) {

// --- define ----------------------------------------------
// --- variable --------------------------------------------
var _BASE64 = {
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), // ["A", "B", ... "/"]
        codes: { "=": 0, "-": 62, "_": 63 } // { 65: 0, 66: 1 }
                                            // charCode and URLSafe64 chars("-", "_")
    };

for (var i = 0; i < 64; ++i) {
    _BASE64.codes[ _BASE64.chars[i] ] = i;
}

// --- interface -------------------------------------------
function Base64(source,             // @arg String:
                hasHighOrderByte) { // @arg Boolean(= false): true is has high-order byte (0x7f).
                                    // @ret Base64String:
                                    // @help: Base64
                                    // @desc: Convert String to Base64String.
    return Base64_btoa(source, hasHighOrderByte);
}
Base64.name = "Base64";
Base64.repository = "https://github.com/uupaa/Base64.js";
Base64.btoa   = Base64_btoa;   // Base64.btoa(source:String, hasHighOrderByte:Boolean = false):Base64String
Base64.atob   = Base64_atob;   // Base64.atob(base64:Base64String):String
Base64.encode = Base64_encode; // Base64.encode(source:ByteArray, toURLSafe64:Boolean = false):Base64String/URLSafe64String
Base64.decode = Base64_decode; // Base64.decode(source:Base64String/URLSafe64String):ByteArray

// --- implement -------------------------------------------
function Base64_btoa(source,             // @arg String:
                     hasHighOrderByte) { // @arg Boolean(= false): true is has high-order byte (0x7f).
                                         // @ret Base64String:
                                         // @help: Base64.btoa
                                         // @desc: Base64 encode wrapper
//{@assert
    _if(typeof source !== "string", "invalid Base64.btoa(source,)");
    if (hasHighOrderByte !== undefined) {
        _if(typeof hasHighOrderByte !== "boolean", "invalid Base64.btoa(,hasHighOrderByte)");
    }
//}@assert

    if (global.btoa) {
        if (!hasHighOrderByte) {
            try {
                return global.btoa(source); // String to Base64String
            } catch (o_o) {
                // maybe. xhr binary data has high-order bytes(non ascii value)
            }
        }
        return global.btoa( ByteArray.toString( ByteArray.fromString(source) ) );
    }
    return Base64_encode( ByteArray.fromString(source) );
}

function Base64_atob(base64) { // @arg Base64String:
                               // @ret String:
                               // @help: Base64.atob
                               // @desc: Base64 decode wrapper
//{@assert
    _if(typeof base64 !== "string", "invalid Base64.atob(base64)");
//}@assert

    if (global.atob) {
        try {
            return global.atob(base64);
        } catch (o_o) {
            // maybe. broken base64 data
        }
    }
    return ByteArray.toString( Base64_decode(base64) );
}

function Base64_encode(source,        // @arg ByteArray: [0xff, ...]
                       toURLSafe64) { // @arg Boolean(= false): true is URLSafe64
                                      // @ret Base64String/URLSafe64String:
                                      // @help: Base64.encode
                                      // @desc: ByteArray to Base64String.
//{@assert
    _if(!Array.isArray(source),                 "invalid Base64.encode(source,)");
    if (toURLSafe64 !== undefined) {
        _if(typeof toURLSafe64 !== "boolean",   "invalid Base64.encode(,toURLSafe64)");
    }
//}@assert

    var rv = [],
        c = 0, i = -1, iz = source.length,
        pad = [0, 2, 1][iz % 3],
        chars = _BASE64.chars;

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
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");

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
    _if(typeof source !== "string", "invalid Base64.decode(source)");
//}@assert

    var rv = [], c = 0, i = 0, ary = source.split(""),
        iz = source.length - 1,
        codes = _BASE64.codes;

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

//{@assert
function _if(booleanValue, errorMessageString) {
    if (booleanValue) {
        throw new Error(errorMessageString);
    }
}
//}@assert

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = Base64;
}
global.Base64 = Base64;

})(this.self || global);

