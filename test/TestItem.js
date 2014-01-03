// --- define ----------------------------------------------
// --- variable --------------------------------------------
var test = new UnitTest([
        testBase64,
        testBase64EncodeAndDecode,
        testBase64atobAndbtoa,
        testURLSafe64,
    ]);

// --- interface -------------------------------------------
// --- implement -------------------------------------------
function testBase64(next) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        console.log("testBase64 ok");
        next && next.pass();
    } else {
        console.log("testBase64 ng");
        next && next.miss();
    }
}

function testBase64EncodeAndDecode(next) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.encode( ByteArray.fromString(source) ); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = ByteArray.toString( Base64.decode(base64) );

    if (source === revert) {
        console.log("testBase64EncodeAndDecode ok");
        next && next.pass();
    } else {
        console.log("testBase64EncodeAndDecode ng");
        next && next.miss();
    }
}

function testBase64atobAndbtoa(next) {

    var source = "1234567890ABCDEFGHIJKLMN";
    var base64 = Base64.btoa(source); // "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O"
    var revert = Base64.atob(base64);

    if (source === revert) {
        console.log("testBase64atobAndbtoa ok");
        next && next.pass();
    } else {
        console.log("testBase64atobAndbtoa ng");
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
        console.log("testURLSafe64 ng");
        next && next.miss();
    } else {
        console.log("testURLSafe64 ok");
        next && next.pass();
    }
}

// --- export ----------------------------------------------

// --- run ----------------------------------------------
function _init() {
    // create <input> buttons.
    if (typeof document !== "undefined") {
        test.names().forEach(function(name) {
            //  <input type="button" onclick="testX()" value="testX()" /> node.
            document.body.appendChild(
                _createNode("input", {
                    type: "button",
                    value: name + "()",
                    onclick: name + "()" }));
        });
        window.addEventListener("error", function(message, lineno, filename) {
            document.body.style.backgroundColor = "red";
        });
    }
    // run
    test.run(function(err) {
        if (typeof document !== "undefined") {
            document.body.style.backgroundColor = err ? "red" : "lime";
        } else {
            // console color
            var RED    = '\u001b[31m';
            var YELLOW = '\u001b[33m';
            var GREEN  = '\u001b[32m';
            var CLR    = '\u001b[0m';

            if (err) {
                console.log(RED + "error." + CLR);
            } else {
                console.log(GREEN + "ok." + CLR);
            }
        }
    });

    function _createNode(name, attrs) {
        var node = document.createElement(name);

        for (var key in attrs) {
            node.setAttribute(key, attrs[key]);
        }
        return node;
    }
}

if (this.self) {
    this.self.addEventListener("load", _init);
} else {
    _init();
}

