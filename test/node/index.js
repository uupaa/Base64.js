// Base64 test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;

require("../../node_modules/uupaa.random.js/lib/Random.js");
require("../../node_modules/uupaa.typedarray.js/lib/TypedArray.js");
require("../wmtools.js");
require("../../lib/Base64.js");
require("../../release/Base64.n.min.js");
require("../testcase.js");

