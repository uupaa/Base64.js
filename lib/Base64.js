// @name: Base64.js
// @require BinaryString.js

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
function Base64() { // @help: Base64
}
Base64.name = "Base64";
Base64.repository = "https://github.com/uupaa/Base64.js";
Base64.btoa   = Base64_btoa;   // Base64.btoa(source:String, normalize:Boolean = false):Base64String
Base64.atob   = Base64_atob;   // Base64.atob(base64:Base64String):String
Base64.encode = Base64_encode; // Base64.encode(source:UTF16CharCodeArray, toURLSafe64:Boolean = false):Base64String/URLSafe64String
Base64.decode = Base64_decode; // Base64.decode(source:Base64String/URLSafe64String):UTF16CharCodeArray

// --- implement -------------------------------------------
function Base64_btoa(source,      // @arg String:
                     normalize) { // @arg Boolean(= false): true is normalize
                                  // @ret Base64String:
                                  // @help: Base64.btoa
//{@assert
    _if(typeof source !== "string", "invalid source");
    _if(normalize !== undefined && typeof normalize !== "boolean", "invalid normalize");
//}@assert

    if (global.btoa) {
        if (!normalize) {
            try {
                return global.btoa(source); // BinaryString to Base64String
            } catch (o_o) {
                // maybe. xhr binary data has non ascii value
            }
        }
        return global.btoa( BinaryString.normalize(source, 0xff) );
    }
    return Base64_encode( BinaryString.toArray(source, 0xff) );
}

function Base64_atob(base64) { // @arg Base64String:
                               // @ret String:
                               // @help: Base64.atob
//{@assert
    _if(typeof base64 !== "string", "invalid base64");
//}@assert

    if (global.atob) {
        try {
            return global.atob(base64);
        } catch (o_o) {
            // maybe. broken base64 data
        }
    }
    return BinaryString.fromArray( Base64_decode(base64) );
}

function Base64_encode(source,        // @arg UTF16CharCodeArray:
                       toURLSafe64) { // @arg Boolean(= false): true is URLSafe64
                                      // @ret Base64String/URLSafe64String:
                                      // @help: Base64.encode
                                      // @desc: UTF16CharCodeArray to Base64String
//{@assert
    _if(!Array.isArray(source), "invalid source");
    _if(toURLSafe64 !== undefined && typeof toURLSafe64 !== "boolean", "invalid toURLSafe64");
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
    if (toURLSafe64) { // "+" -> "-", "/" -> "_"
        return rv.join("").replace(/\=+$/g, "").replace(/\+/g, "-").
                                                replace(/\//g, "_");
    }
    return rv.join("");
}

function Base64_decode(source) { // @arg Base64String/URLSafe64String:
                                 // @ret UTF16CharCodeArray:
                                 // @help: Base64.decode
                                 // @desc: Base64String to UTF16CharCodeArray
//{@assert
    _if(typeof source !== "string", "invalid source");
//}@assert

    var rv = [], c = 0, i = 0, ary = source.split(""),
        iz = source.length - 1,
        codes = _BASE64.codes;

    while (i < iz) {                // 00000000|00000000|00000000 (24bit)
        c = (codes[ary[i++]] << 18) // 111111  |        |
          | (codes[ary[i++]] << 12) //       11|1111    |
          | (codes[ary[i++]] <<  6) //         |    1111|11
          |  codes[ary[i++]];       //         |        |  111111
                                    //    v        v        v
        rv.push((c >> 16) & 0xff,   // --------
                (c >>  8) & 0xff,   //          --------
                 c        & 0xff);  //                   --------
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

