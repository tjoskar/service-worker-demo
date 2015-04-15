(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AuthenticationCtrl = function AuthenticationCtrl() {
    _classCallCheck(this, AuthenticationCtrl);

    console.log("AuthenticationCtrl");
    this.username = "";
    this.emailadress = "epost";
    this.password = "";
};

module.exports = AuthenticationCtrl;

},{}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var AuthenticationCtrl = _interopRequire(require("./authentication.controller"));

var bind = function () {
    var moduleName = "EH.authentication";

    angular.module(moduleName, []).controller("AuthenticationCtrl", AuthenticationCtrl);

    return moduleName;
};

module.exports = { bind: bind };

},{"./authentication.controller":1}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var gravatar = _interopRequire(require("./lib/gravatar/init"));

var authentication = _interopRequire(require("./authentication/init"));

var upcoming = _interopRequire(require("./upcoming/init"));

var routeTable = _interopRequire(require("./route"));

angular.module("EH", ["ngAnimate", "ngRoute", authentication.bind(), upcoming.bind(), gravatar.bind()]).config(routeTable).run(function ($http) {
    $http.defaults.headers.common.Authorization = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0am9za2FyIiwiaWF0IjoxNDI2NDMyMzM2fQ.ThpZUTGbI11nfpP5lymh-akVrUG9jOc6LJFaAFRFM3g";
});

},{"./authentication/init":2,"./lib/gravatar/init":12,"./route":15,"./upcoming/init":16}],4:[function(require,module,exports){
"use strict";

module.exports = {
    url: {
        series: {
            fanart: "http://localhost:8080/fanart/",
            poster: "http://img.episodehunter.tv/serie/poster/"
        }
    }
};

},{}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var defaultConfig = _interopRequire(require("./default"));

module.exports = defaultConfig;

},{"./default":4}],6:[function(require,module,exports){
"use strict";

/**
 * Base class for episodes
 * @param {Object} options
 */
function EpisodeModel(options) {
  if (this instanceof EpisodeModel) {
    throw "Can not instantiate an abstract class";
  }

  /**
   * Episode id
   * @type {integer}
   */
  this.id = options.ids.id;

  /**
   * Series id
   * @type {integer}
   */
  this.seriesId = options.ids.show;

  /**
   * Episode name
   * @type {string}
   */
  this.title = options.title;

  /**
   * Season number
   * @type {integer}
   */
  this.season = options.season;

  /**
   * Episode number
   * @type {integer}
   */
  this.episode = options.episode;

  /**
   * Air date
   * @type {Date}
   */
  this.airs = options.airs ? new Date(options.airs) : undefined;

  /**
   * Return URL to a thumbnail for this episode
   * @return {string}
   */
  this.thumbnail = (function () {
    return "";
  })();
}

module.exports = EpisodeModel;

},{}],7:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Repository
 * Wrapper for all HTTP cals
 * This file should be loaded as a module; no IIFE needed
 */

var syncEvent = _interopRequire(require("./event"));

/**
 * Number of ongoing HTTP calls
 * @type {Number}
 */
var ongoingHTTPCounter = 0;

/**
 * Start "loading" effect if it is the first call.
 * Broadcast 'httpStart' event
 * @return {null}
 */
var httpStart = function httpStart() {
    ongoingHTTPCounter++;

    if (ongoingHTTPCounter === 1) {
        syncEvent.trigger("httpStart", ongoingHTTPCounter);
    }
};

/**
 * Stop "loading" effect
 * Broadcast 'httpEnd' event
 * @return {null}
 */
var httpEnd = function httpEnd() {
    ongoingHTTPCounter--;

    if (ongoingHTTPCounter === 0) {
        syncEvent.trigger("httpEnd", ongoingHTTPCounter);
    }
};

/**
 * An global error handler
 * @param  {object} error   Error object
 * @return {promise}
 */
var errorHandler = function errorHandler(error) {
    if (error.status === 401) {
        console.log("Logout user");
    } else {
        console.log("Show error message", error);
    }
    return Promise.reject(error);
};



var BaseRepository = (function () {
    function BaseRepository(http) {
        _classCallCheck(this, BaseRepository);

        this.http = http;
    }

    _prototypeProperties(BaseRepository, null, {
        get: {

            /**
             * Create an GET request
             * @param  {string} url
             * @return {promise}
             */
            value: function get(url) {
                httpStart();

                url = url || this.apiEndpoint;

                return this.http.get(url).then(function (data) {
                    return data.data;
                })["catch"](errorHandler)["finally"](httpEnd);
            },
            writable: true,
            configurable: true
        },
        post: {

            /**
             * Create an POST request
             * @param  {string} url
             * @param  {object} postData
             * @return {promise}
             */
            value: function post(url, postData) {
                httpStart();

                url = url || this.apiEndpoint;

                return this.http.post(url, postData).then(function (data) {
                    return data.value;
                })["catch"](errorHandler)["finally"](httpEnd);
            },
            writable: true,
            configurable: true
        }
    });

    return BaseRepository;
})();

module.exports = BaseRepository;

},{"./event":9}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/**
 * @type {utility}
 */
var u = _interopRequire(require("./utility"));

/**
 * @type {config}
 */
var config = _interopRequire(require("../config"));

/**
 * Base class for show
 * @param {Object} options
 */
function ShowModel(options) {
  if (this instanceof ShowModel) {
    throw "Can not instantiate an abstract class";
  }

  /**
   * Series id
   * @type {integer}
   */
  this.id = options.ids.id;

  /**
   * Series name
   * @type {string}
   */
  this.title = options.title;

  /**
   * Year
   * @type {integear}
   */
  this.year = options.year;

  /**
   * URL series page for this show
   * @type {string}
   */
  this.url = "#/tv/" + this.id + "/" + u.urlTitle(this.title);

  /**
   * Return URL to a poster for this series
   * @return {string}
   */
  this.poster = config.url.series.poster + options.poster;

  /**
   * Return URL to a fanart for this show
   * @return {string}
   */
  this.fanart = config.url.series.fanart + options.fanart;
}

module.exports = ShowModel;

},{"../config":5,"./utility":14}],9:[function(require,module,exports){
"use strict";

// Events
// ---------------
// Bind a callback function to an event.
//
//     EH.on('avalanche', function() { alert('HELP!'); });
//     EH.trigger('avalanche');
//     EH.off('avalanche');
//


/**
 * List of registered events
 * @type {Object}
 */
var eventList = {};

/**
 * Array of old messages.
 * Used if an event want to get already sent triggers
 * @type {Array}
 */
var oldMessage = [];

/**
 * Bind an event to a 'callback' function.
 * @param  {String}   eventName     Name of the event
 * @param  {function} callback      Callback function
 * @param  {Object}   context       Context of the function 'callback'
 * @param  {Boolian}  getOldMessage Determines if old triggers should be taken under account
 * @return {undefined}
 */
exports.on = function (eventName, callback, context, getOldMessage) {
    if (!(eventName in eventList)) {
        eventList[eventName] = [];
    }
    eventList[eventName].push({
        callback: callback,
        context: context
    });

    if (getOldMessage) {
        oldMessage.forEach(function (val) {
            if (val.eventName === eventName) {
                callback.apply(context, val.args);
            }
        });
    }
};

/**
 * Remove one or all events from the event-list. If 'callback' is null all events
 * with name 'eventName' will be removed.
 * @param  {String}   eventName  Name of the event
 * @param  {Function} callback   Callback function for selecting a specific event
 * @return {undefined}
 */
exports.off = function (eventName, callback) {
    if (eventName in eventList) {
        if (!callback) {
            delete eventList[eventName];
        } else {
            var evList = eventList[eventName];
            for (var i = evList.length - 1; i >= 0; i--) {
                if (evList[i].callback === callback) {
                    evList.splice(i, 1);
                }
            }
        }
    }
};

/**
 * Trigger one or many events, firing all bound callbacks. All arguments will
 * be passed throw to the callback function.
 * @param  {String} eventName   Name of the event
 * @param  {*args}  arguments   Will be passed throw to the callback function
 * @return {undefined}
 */
exports.trigger = function (eventName) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);
    oldMessage.push({
        eventName: eventName,
        args: args
    });
    if (eventName in eventList) {
        eventList[eventName].forEach(function (currEvent) {
            currEvent.callback.apply(currEvent.context, args);
        });
    }
};

/**
 * Remove all events
 * @return {undefined}
 */
exports.deleteAllEvents = function () {
    eventList = {};
    oldMessage = [];
};

},{}],10:[function(require,module,exports){
"use strict";

function GravatarDirective(GravatarFactory) {
    var directive = {
        link: link,
        scope: {
            gravatarEmail: "="
        }
    };

    function link(scope, element, attrs) {
        console.log(scope);
        scope.$watch("gravatarEmail", function (email) {
            console.log(email);

            if (email && email.match(/.*@.*\..{2}/) !== null) {
                var cssClass = attrs.gravatarCssClass || "";
                var src = GravatarFactory.getImageSrc(email, attrs.gravatarSecure);
                var tag = "<img class=\"" + cssClass + "\" src=\"" + src + "\" >";

                element.find("img").remove();
                element.append(tag);

                element.find("img").bind("error", function () {
                    element.find("img").remove();
                });
            }
        });
    }

    return directive;
}

module.exports = GravatarDirective;

},{}],11:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var md5 = _interopRequire(require("../md5"));

function GravatarFactory() {
    var Gravatar = {};

    Gravatar.getImageSrc = function (email, secure) {
        var hash = md5(email.toLowerCase());
        var src = (secure ? "https://secure" : "http://www") + ".gravatar.com/avatar/" + hash + "?d=404";
        return src;
    };

    return Gravatar;
}

module.exports = GravatarFactory;

},{"../md5":13}],12:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var GravatarDirective = _interopRequire(require("./gravatar.directive"));

var GravatarFactory = _interopRequire(require("./gravatar.factory"));

var bind = function () {
    var directiveName = "EH.directive.gravatar";

    angular.module(directiveName, []).factory("gravatarFactory", GravatarFactory).directive("gravatarImage", ["gravatarFactory", GravatarDirective]);

    return directiveName;
};

module.exports = { bind: bind };

},{"./gravatar.directive":10,"./gravatar.factory":11}],13:[function(require,module,exports){
"use strict";

// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// + namespaced by: Michael White (http://getsprink.com)
// +    tweaked by: Jack
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// -    depends on: utf8_encode
// *     example 1: md5('Kevin van Zonneveld');
// *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
// Adapted to AngularJS Service by: Jim Lavin (http://jimlavin.net)
// after injecting into your controller, directive or service
// *     example 1: md5.createHash('Kevin van Zonneveld');
// *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

var md5 = function (str) {
    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
    };

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 2147483648;
        lY8 = lY & 2147483648;
        lX4 = lX & 1073741824;
        lY4 = lY & 1073741824;
        lResult = (lX & 1073741823) + (lY & 1073741823);
        if (lX4 & lY4) {
            return lResult ^ 2147483648 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
            if (lResult & 1073741824) {
                return lResult ^ 3221225472 ^ lX8 ^ lY8;
            } else {
                return lResult ^ 1073741824 ^ lX8 ^ lY8;
            }
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    };

    var _F = function (x, y, z) {
        return x & y | ~x & z;
    };
    var _G = function (x, y, z) {
        return x & z | y & ~z;
    };
    var _H = function (x, y, z) {
        return x ^ y ^ z;
    };
    var _I = function (x, y, z) {
        return y ^ (x | ~z);
    };

    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWordsTemp1 = lMessageLength + 8;
        var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - lNumberOfWordsTemp1 % 64) / 64;
        var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
        }
        lWordCount = (lByteCount - lByteCount % 4) / 4;
        lBytePosition = lByteCount % 4 * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue = "",
            wordToHexValueTemp = "",
            lByte,
            lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            wordToHexValueTemp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k,
        AA,
        BB,
        CC,
        DD,
        a,
        b,
        c,
        d,
        S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    //str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
        d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
        c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
        a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
        d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
        c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
        b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
        a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
        c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
        b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
        a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
        c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
        b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
        d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
        c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
        a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
        d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
        b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
        a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
        c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
        b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
        d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
        c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
        a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
        d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
        c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
        a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
        d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
        b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
        a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
        c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
        b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
        d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
        c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
        a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
        d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
        b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
        a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
        c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
        b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
        a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
        c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
        b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
        d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
        c = _II(c, d, a, b, x[k + 2], S43, 718787259);
        b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
};

module.exports = md5;

},{}],14:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var md5 = _interopRequire(require("./md5"));

var utility = {

    /**
     * Shortcut for printing
     * @return {undefined}
     */
    p: function () {
        console.log.apply(console, arguments);
    },

    is: {

        /**
         * Determines if a reference is a string
         * @param  {object} str
         * @return {boolean}
         */
        string: function (str) {
            if (typeof angular !== "undefined") {
                return angular.isString(str);
            }
            return typeof str === "string" || str instanceof String;
        },

        /**
         * Determines if a reference is an Array
         * @param  {object} arr
         * @return {boolean}
         */
        array: function (arr) {
            return Array.isArray(arr);
        },

        /**
         * Determines if a reference is an integer
         * @param  {object} n
         * @return {boolean}
         */
        int: function (n) {
            return n === +n && n === (n | 0);
        },

        /**
         * Determines if a reference is defined or not null
         * @param  {object} variable
         * @return {boolean}
         */
        set: function (variable) {
            return typeof variable !== "undefined" && variable !== null;
        }

    },

    to: {

        /**
         * Convert object to int
         * @param  {object} obj
         * @return {integer}
         */
        int: function (obj) {
            return obj | 0;
        }

    },

    time: {

        /**
         * Return the local time
         * @return {integer}    Unixtimestamp * 1000
         */
        now: function () {
            return new Date().getTime();
        },

        /**
         * Convert a UTC date to a local timezone
         * @param  {integer} unixtimestamp
         * @return {Date}
         */
        convertUTCDateToLocalDate: function (unixtimestamp) {
            var utcDate = new Date(unixtimestamp * 1000);

            var offset = utcDate.getTimezoneOffset() / 60;
            var hours = utcDate.getHours();

            utcDate.setHours(hours - offset);

            return utcDate;
        },

        /**
         * Generate next Sunday, basted on day d
         * @param  {Date} d
         * @return {Date}
         */
        nextSunday: function (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7);
        },

        /**
         * Generate a date 'n' days from now
         * @param  {integer} n
         * @return {string} on form YYYY-MM-DD
         */
        futureDate: function (n) {
            var timestamp = new Date().getTime();
            var d = new Date(timestamp + (n || 0) * 86400000);
            var month = d.getMonth() + 1;
            return [d.getFullYear(), month < 10 ? "0" + month : month, d.getDate() < 10 ? "0" + d.getDate() : d.getDate()].join("-");
        }

    },

    /**
     * Convert JSON string to an object.
     * @param  {string} obj
     * @return {object}
     */
    jsonParser: function (obj) {
        try {
            return JSON.parse(obj);
        } catch (e) {
            return null;
        }
    },

    /**
     * Generate a URL friendly title
     * @param  {string} text
     * @return {string}
     */
    urlTitle: function (text) {
        if (text) {
            return text.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
        }
        return "";
    },

    /**
     * Generate a episode number on form SXXEXX
     * @param  {integer} season
     * @param  {integer} episode
     * @return {string}
     */
    episodeNumber: function (season, episode) {
        var SE = "S";

        if (season < 10) {
            SE += "0" + season;
        } else {
            SE += season;
        }

        SE += "E";

        if (episode < 10) {
            SE += "0" + episode;
        } else {
            SE += episode;
        }

        return SE;
    },

    /**
     * @type {md5}
     */
    md5: md5

};

module.exports = utility;

},{"./md5":13}],15:[function(require,module,exports){
"use strict";

var routeTable = function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/upcoming/upcoming.html",
        controller: "UpcomingCtrl",
        controllerAs: "vm"
    }).when("/mb", {
        template: "<img src=\"/mb.gif\">" }).when("/register", {
        templateUrl: "app/authentication/register.html",
        controller: "AuthenticationCtrl",
        controllerAs: "vm"
    }).otherwise({
        redirectTo: "/"
    });
};

module.exports = routeTable;

},{}],16:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var UpcomingCtrl = _interopRequire(require("./upcoming.controller"));

var UpcomingRepository = _interopRequire(require("./upcoming.repository"));

var bind = function () {
    var moduleName = "EH.upcoming";

    angular.module(moduleName, []).controller("UpcomingCtrl", UpcomingCtrl).service("UpcomingRepository", UpcomingRepository);

    return moduleName;
};

module.exports = { bind: bind };

},{"./upcoming.controller":17,"./upcoming.repository":19}],17:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var UpcomingCtrl = function UpcomingCtrl(repository) {
    var _this = this;
    _classCallCheck(this, UpcomingCtrl);

    repository.get().then(function (shows) {
        return _this.shows = shows;
    });
};

UpcomingCtrl.$inject = ["UpcomingRepository"];
module.exports = UpcomingCtrl;

},{}],18:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

"use string";

var BaseEpisodeModel = _interopRequire(require("../lib/base.episode.model"));

var BaseShowModel = _interopRequire(require("../lib/base.show.model"));

var u = _interopRequire(require("../lib/utility"));

var upcomingEnum = {
    JUST_AIRED: { headline: "just aired", order: 0 },
    THIS_WEEK: { headline: "this week", order: 1 },
    NEXT_WEEK: { headline: "next week", order: 2 },
    UPCOMING: { headline: "upcoming", order: 3 },
    TBA: { headline: "tba", order: 4 }
};

/**
 * Upcoming Model
 * @param {object} options
 */
var UpcomingModel = function UpcomingModel(options) {
    BaseEpisodeModel.call(this, options);
    BaseShowModel.call(this.show = {}, options.show);

    /**
     * URL series page for this episode
     * @type {string}
     */
    this.url = (function (scope) {
        var url = scope.show.url;
        if (scope.id) {
            url += "/" + scope.id;
        }
        return url;
    })(this);

    /**
     * Determines right upcoming group
     * @type {UpcomingModel} scope
     * @return {upcomingEnum}
     */
    this.group = (function (scope) {
        var air = scope.airs;
        var now = new Date();
        var thisSunday = u.time.nextSunday(now);
        var nextSunday = u.time.nextSunday(thisSunday);
        if (air === undefined) {
            return upcomingEnum.TBA;
        }

        if (!u.is.set(scope.id) || air <= now) {
            return upcomingEnum.TBA;
        } else if (air < now) {
            return upcomingEnum.JUST_AIRED;
        } else if (air <= thisSunday) {
            return upcomingEnum.THIS_WEEK;
        } else if (thisSunday < air && air <= nextSunday) {
            return upcomingEnum.NEXT_WEEK;
        } else {
            return upcomingEnum.UPCOMING;
        }
    })(this);
};

module.exports = UpcomingModel;

},{"../lib/base.episode.model":6,"../lib/base.show.model":8,"../lib/utility":14}],19:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseRepository = _interopRequire(require("../lib/base.repository"));

var UpcomingModel = _interopRequire(require("./upcoming.model"));

var UpcomingRepository = (function (BaseRepository) {
    function UpcomingRepository(http) {
        _classCallCheck(this, UpcomingRepository);

        _get(Object.getPrototypeOf(UpcomingRepository.prototype), "constructor", this).call(this, http);
        this.apiEndpoint = "http://localhost:8080/user/upcoming";
    }

    _inherits(UpcomingRepository, BaseRepository);

    _prototypeProperties(UpcomingRepository, null, {
        get: {
            value: function get() {
                return _get(Object.getPrototypeOf(UpcomingRepository.prototype), "get", this).call(this).then(function (data) {
                    return _(data.episodes).map(function (e) {
                        return new UpcomingModel(e);
                    }).groupBy(function (u) {
                        return u.group.order;
                    }).map(function (a) {
                        return {
                            headline: _.first(a).group.headline,
                            episodes: _.sortBy(a, function (a) {
                                return a.airs;
                            })
                        };
                    }).value();
                });
            },
            writable: true,
            configurable: true
        }
    });

    return UpcomingRepository;
})(BaseRepository);

UpcomingRepository.$inject = ["$http"];
module.exports = UpcomingRepository;

},{"../lib/base.repository":7,"./upcoming.model":18}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGpvc2thci9Qcm9qZWN0L2VwaXNvZGVodW50ZXIudHYvc3JjL2FwcC9hdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5jb250cm9sbGVyLmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvYXV0aGVudGljYXRpb24vaW5pdC5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2Jvb3QuanMiLCIvVXNlcnMvdGpvc2thci9Qcm9qZWN0L2VwaXNvZGVodW50ZXIudHYvc3JjL2FwcC9jb25maWcvZGVmYXVsdC5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2NvbmZpZy9pbmRleC5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2xpYi9iYXNlLmVwaXNvZGUubW9kZWwuanMiLCIvVXNlcnMvdGpvc2thci9Qcm9qZWN0L2VwaXNvZGVodW50ZXIudHYvc3JjL2FwcC9saWIvYmFzZS5yZXBvc2l0b3J5LmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvbGliL2Jhc2Uuc2hvdy5tb2RlbC5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2xpYi9ldmVudC5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2xpYi9ncmF2YXRhci9ncmF2YXRhci5kaXJlY3RpdmUuanMiLCIvVXNlcnMvdGpvc2thci9Qcm9qZWN0L2VwaXNvZGVodW50ZXIudHYvc3JjL2FwcC9saWIvZ3JhdmF0YXIvZ3JhdmF0YXIuZmFjdG9yeS5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2xpYi9ncmF2YXRhci9pbml0LmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvbGliL21kNS5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL2xpYi91dGlsaXR5LmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvcm91dGUuanMiLCIvVXNlcnMvdGpvc2thci9Qcm9qZWN0L2VwaXNvZGVodW50ZXIudHYvc3JjL2FwcC91cGNvbWluZy9pbml0LmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvdXBjb21pbmcvdXBjb21pbmcuY29udHJvbGxlci5qcyIsIi9Vc2Vycy90am9za2FyL1Byb2plY3QvZXBpc29kZWh1bnRlci50di9zcmMvYXBwL3VwY29taW5nL3VwY29taW5nLm1vZGVsLmpzIiwiL1VzZXJzL3Rqb3NrYXIvUHJvamVjdC9lcGlzb2RlaHVudGVyLnR2L3NyYy9hcHAvdXBjb21pbmcvdXBjb21pbmcucmVwb3NpdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztJQUVQLGtCQUFrQixHQUVULFNBRlQsa0JBQWtCOzBCQUFsQixrQkFBa0I7O0FBR2hCLFdBQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsQyxRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUMzQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztDQUN0Qjs7aUJBSVUsa0JBQWtCOzs7QUNi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QyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsZUFBTyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQyxDQUFDOztBQUVGLFFBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQ3RDLFNBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxlQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzNDLENBQUM7O0FBRUYsUUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDdEMsU0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLGVBQU8sV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0MsQ0FBQzs7QUFFRixRQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtBQUN0QyxTQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsV0FBVyxD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QztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFTLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFTLENBQUMsQ0FBQztBQUM5QyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoRCxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxTQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QixTQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QixTQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QixTQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMxQjs7QUFFRCxRQUFJLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMs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S0FDNUQ7O2NBTEMsa0JBQWtCLEVBQVMsY0FBYzs7eUJBQXpDLGtCQUFrQjtBQU9wQixXQUFHO21CQUFBLGVBQUc7QUFDRix1QkFBTywyQkFSVCxrQkFBa0IscUNBU1gsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ1YsMkJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDbEIsR0FBRyxDQUFDLFVBQUEsQ0FBQzsrQkFBSSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7cUJBQUEsQ0FBQyxDQUM5QixPQUFPLENBQUMsVUFBQSxDQUFDOytCQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSztxQkFBQSxDQUFDLENBQzNCLEdBQUcsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNOLCtCQUFPO0FBQ0gsb0NBQVEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRO0FBQ25DLG9DQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBQyxDQUFDO3VDQUFLLENBQUMsQ0FBQyxJQUFJOzZCQUFBLENBQUM7eUJBQ3ZDLENBQUM7cUJBQ0wsQ0FBQyxDQUNELEtBQUssRUFBRSxDQUFDO2lCQUNoQixDQUFDLENBQUM7YUFDVjs7Ozs7O1dBckJDLGtCQUFrQjtHQUFTLGNBQWM7O0FBd0IvQyxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDeEIsa0JBQWtCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQXV0aGVudGljYXRpb25DdHJsIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnQXV0aGVudGljYXRpb25DdHJsJyk7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5lbWFpbGFkcmVzcyA9ICdlcG9zdCc7XG4gICAgICAgIHRoaXMucGFzc3dvcmQgPSAnJztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXV0aGVudGljYXRpb25DdHJsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXV0aGVudGljYXRpb25DdHJsIGZyb20gJy4vYXV0aGVudGljYXRpb24uY29udHJvbGxlcic7XG5cbnZhciBiaW5kID0gKCkgPT4ge1xuICAgIHZhciBtb2R1bGVOYW1lID0gJ0VILmF1dGhlbnRpY2F0aW9uJztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShtb2R1bGVOYW1lLCBbXSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhlbnRpY2F0aW9uQ3RybCcsIEF1dGhlbnRpY2F0aW9uQ3RybCk7XG5cbiAgICByZXR1cm4gbW9kdWxlTmFtZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtiaW5kfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGdyYXZhdGFyIGZyb20gJy4vbGliL2dyYXZhdGFyL2luaXQnO1xuaW1wb3J0IGF1dGhlbnRpY2F0aW9uIGZyb20gJy4vYXV0aGVudGljYXRpb24vaW5pdCc7XG5pbXBvcnQgdXBjb21pbmcgZnJvbSAnLi91cGNvbWluZy9pbml0JztcbmltcG9ydCByb3V0ZVRhYmxlIGZyb20gJy4vcm91dGUnO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnRUgnLCBbXG4gICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAnbmdSb3V0ZScsXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uLmJpbmQoKSxcbiAgICAgICAgdXBjb21pbmcuYmluZCgpLFxuICAgICAgICBncmF2YXRhci5iaW5kKClcbiAgICBdKVxuICAgIC5jb25maWcocm91dGVUYWJsZSlcbiAgICAucnVuKCRodHRwID0+IHtcbiAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb24uQXV0aG9yaXphdGlvbiA9ICdleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZNU3dpZFhObGNtNWhiV1VpT2lKMGFtOXphMkZ5SWl3aWFXRjBJam94TkRJMk5ETXlNek0yZlEuVGhwWlVUR2JJMTFuZnBQNWx5bWgtYWtWclVHOWpPYzZMSkZhQUZSRk0zZydcbiAgICB9KTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB1cmw6IHtcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICBmYW5hcnQ6ICdodHRwOi8vbG9jYWxob3N0OjkwMDAvZmFuYXJ0LycsXG4gICAgICAgICAgICBwb3N0ZXI6ICdodHRwOi8vaW1nLmVwaXNvZGVodW50ZXIudHYvc2VyaWUvcG9zdGVyLydcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tICcuL2RlZmF1bHQnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRDb25maWc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgZXBpc29kZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIEVwaXNvZGVNb2RlbChvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBFcGlzb2RlTW9kZWwpIHtcbiAgICAgICAgdGhyb3cgJ0NhbiBub3QgaW5zdGFudGlhdGUgYW4gYWJzdHJhY3QgY2xhc3MnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVwaXNvZGUgaWRcbiAgICAgKiBAdHlwZSB7aW50ZWdlcn1cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gb3B0aW9ucy5pZHMuaWQ7XG5cbiAgICAvKipcbiAgICAgKiBTZXJpZXMgaWRcbiAgICAgKiBAdHlwZSB7aW50ZWdlcn1cbiAgICAgKi9cbiAgICB0aGlzLnNlcmllc0lkID0gb3B0aW9ucy5pZHMuc2hvdztcblxuICAgIC8qKlxuICAgICAqIEVwaXNvZGUgbmFtZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy50aXRsZSA9IG9wdGlvbnMudGl0bGU7XG5cbiAgICAvKipcbiAgICAgKiBTZWFzb24gbnVtYmVyXG4gICAgICogQHR5cGUge2ludGVnZXJ9XG4gICAgICovXG4gICAgdGhpcy5zZWFzb24gPSBvcHRpb25zLnNlYXNvbjtcblxuICAgIC8qKlxuICAgICAqIEVwaXNvZGUgbnVtYmVyXG4gICAgICogQHR5cGUge2ludGVnZXJ9XG4gICAgICovXG4gICAgdGhpcy5lcGlzb2RlID0gb3B0aW9ucy5lcGlzb2RlO1xuXG4gICAgLyoqXG4gICAgICogQWlyIGRhdGVcbiAgICAgKiBAdHlwZSB7RGF0ZX1cbiAgICAgKi9cbiAgICB0aGlzLmFpcnMgPSBvcHRpb25zLmFpcnMgPyBuZXcgRGF0ZShvcHRpb25zLmFpcnMpIDogdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIFVSTCB0byBhIHRodW1ibmFpbCBmb3IgdGhpcyBlcGlzb2RlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudGh1bWJuYWlsID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSkoKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBFcGlzb2RlTW9kZWw7XG4iLCIvKipcbiAqIFJlcG9zaXRvcnlcbiAqIFdyYXBwZXIgZm9yIGFsbCBIVFRQIGNhbHNcbiAqIFRoaXMgZmlsZSBzaG91bGQgYmUgbG9hZGVkIGFzIGEgbW9kdWxlOyBubyBJSUZFIG5lZWRlZFxuICovXG5cbmltcG9ydCBzeW5jRXZlbnQgZnJvbSAnLi9ldmVudCc7XG5cbi8qKlxuICogTnVtYmVyIG9mIG9uZ29pbmcgSFRUUCBjYWxsc1xuICogQHR5cGUge051bWJlcn1cbiAqL1xudmFyIG9uZ29pbmdIVFRQQ291bnRlciA9IDA7XG5cbi8qKlxuICogU3RhcnQgXCJsb2FkaW5nXCIgZWZmZWN0IGlmIGl0IGlzIHRoZSBmaXJzdCBjYWxsLlxuICogQnJvYWRjYXN0ICdodHRwU3RhcnQnIGV2ZW50XG4gKiBAcmV0dXJuIHtudWxsfVxuICovXG52YXIgaHR0cFN0YXJ0ID0gZnVuY3Rpb24gaHR0cFN0YXJ0KCkge1xuICAgIG9uZ29pbmdIVFRQQ291bnRlcisrO1xuXG4gICAgaWYgKG9uZ29pbmdIVFRQQ291bnRlciA9PT0gMSkge1xuICAgICAgICBzeW5jRXZlbnQudHJpZ2dlcignaHR0cFN0YXJ0Jywgb25nb2luZ0hUVFBDb3VudGVyKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFN0b3AgXCJsb2FkaW5nXCIgZWZmZWN0XG4gKiBCcm9hZGNhc3QgJ2h0dHBFbmQnIGV2ZW50XG4gKiBAcmV0dXJuIHtudWxsfVxuICovXG52YXIgaHR0cEVuZCA9IGZ1bmN0aW9uIGh0dHBFbmQoKSB7XG4gICAgb25nb2luZ0hUVFBDb3VudGVyLS07XG5cbiAgICBpZiAob25nb2luZ0hUVFBDb3VudGVyID09PSAwKSB7XG4gICAgICAgIHN5bmNFdmVudC50cmlnZ2VyKCdodHRwRW5kJywgb25nb2luZ0hUVFBDb3VudGVyKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEFuIGdsb2JhbCBlcnJvciBoYW5kbGVyXG4gKiBAcGFyYW0gIHtvYmplY3R9IGVycm9yICAgRXJyb3Igb2JqZWN0XG4gKiBAcmV0dXJuIHtwcm9taXNlfVxuICovXG52YXIgZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2dvdXQgdXNlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTaG93IGVycm9yIG1lc3NhZ2UnLCBlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG59O1xuXG5cblxuY2xhc3MgQmFzZVJlcG9zaXRvcnkge1xuXG4gICAgY29uc3RydWN0b3IoaHR0cCkge1xuICAgICAgICB0aGlzLmh0dHAgPSBodHRwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBHRVQgcmVxdWVzdFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7cHJvbWlzZX1cbiAgICAgKi9cbiAgICBnZXQodXJsKSB7XG4gICAgICAgIGh0dHBTdGFydCgpO1xuXG4gICAgICAgIHVybCA9IHVybCB8fCB0aGlzLmFwaUVuZHBvaW50O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgICAgICAgIC5nZXQodXJsKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiBkYXRhLmRhdGEpXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKVxuICAgICAgICAgICAgLmZpbmFsbHkoaHR0cEVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIFBPU1QgcmVxdWVzdFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSBwb3N0RGF0YVxuICAgICAqIEByZXR1cm4ge3Byb21pc2V9XG4gICAgICovXG4gICAgcG9zdCh1cmwsIHBvc3REYXRhKSB7XG4gICAgICAgIGh0dHBTdGFydCgpO1xuXG4gICAgICAgIHVybCA9IHVybCB8fCB0aGlzLmFwaUVuZHBvaW50O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgICAgICAgIC5wb3N0KHVybCwgcG9zdERhdGEpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IGRhdGEudmFsdWUpXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKVxuICAgICAgICAgICAgLmZpbmFsbHkoaHR0cEVuZCk7XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZVJlcG9zaXRvcnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHR5cGUge3V0aWxpdHl9XG4gKi9cbmltcG9ydCB1IGZyb20gJy4vdXRpbGl0eSc7XG5cbi8qKlxuICogQHR5cGUge2NvbmZpZ31cbiAqL1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcnXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3Igc2hvd1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gU2hvd01vZGVsKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNob3dNb2RlbCkge1xuICAgICAgICB0aHJvdyAnQ2FuIG5vdCBpbnN0YW50aWF0ZSBhbiBhYnN0cmFjdCBjbGFzcyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VyaWVzIGlkXG4gICAgICogQHR5cGUge2ludGVnZXJ9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IG9wdGlvbnMuaWRzLmlkO1xuXG4gICAgLyoqXG4gICAgICogU2VyaWVzIG5hbWVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuXG4gICAgLyoqXG4gICAgICogWWVhclxuICAgICAqIEB0eXBlIHtpbnRlZ2Vhcn1cbiAgICAgKi9cbiAgICB0aGlzLnllYXIgPSBvcHRpb25zLnllYXI7XG5cbiAgICAvKipcbiAgICAgKiBVUkwgc2VyaWVzIHBhZ2UgZm9yIHRoaXMgc2hvd1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy51cmwgPSAnIy90di8nICsgdGhpcy5pZCArICcvJyArIHUudXJsVGl0bGUodGhpcy50aXRsZSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gVVJMIHRvIGEgcG9zdGVyIGZvciB0aGlzIHNlcmllc1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnBvc3RlciA9IGNvbmZpZy51cmwuc2VyaWVzLnBvc3RlciArIG9wdGlvbnMucG9zdGVyO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIFVSTCB0byBhIGZhbmFydCBmb3IgdGhpcyBzaG93XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZmFuYXJ0ID0gY29uZmlnLnVybC5zZXJpZXMuZmFuYXJ0ICsgb3B0aW9ucy5mYW5hcnQ7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hvd01vZGVsO1xuIiwiLy8gRXZlbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS1cbi8vIEJpbmQgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudC5cbi8vXG4vLyAgICAgRUgub24oJ2F2YWxhbmNoZScsIGZ1bmN0aW9uKCkgeyBhbGVydCgnSEVMUCEnKTsgfSk7XG4vLyAgICAgRUgudHJpZ2dlcignYXZhbGFuY2hlJyk7XG4vLyAgICAgRUgub2ZmKCdhdmFsYW5jaGUnKTtcbi8vXG5cblxuLyoqXG4gKiBMaXN0IG9mIHJlZ2lzdGVyZWQgZXZlbnRzXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgZXZlbnRMaXN0ID0ge307XG5cbi8qKlxuICogQXJyYXkgb2Ygb2xkIG1lc3NhZ2VzLlxuICogVXNlZCBpZiBhbiBldmVudCB3YW50IHRvIGdldCBhbHJlYWR5IHNlbnQgdHJpZ2dlcnNcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xudmFyIG9sZE1lc3NhZ2UgPSBbXTtcblxuLyoqXG4gKiBCaW5kIGFuIGV2ZW50IHRvIGEgJ2NhbGxiYWNrJyBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge1N0cmluZ30gICBldmVudE5hbWUgICAgIE5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgICAgICBDYWxsYmFjayBmdW5jdGlvblxuICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgICAgICAgQ29udGV4dCBvZiB0aGUgZnVuY3Rpb24gJ2NhbGxiYWNrJ1xuICogQHBhcmFtICB7Qm9vbGlhbn0gIGdldE9sZE1lc3NhZ2UgRGV0ZXJtaW5lcyBpZiBvbGQgdHJpZ2dlcnMgc2hvdWxkIGJlIHRha2VuIHVuZGVyIGFjY291bnRcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGNvbnRleHQsIGdldE9sZE1lc3NhZ2UpIHtcbiAgICBpZiAoIShldmVudE5hbWUgaW4gZXZlbnRMaXN0KSkge1xuICAgICAgICBldmVudExpc3RbZXZlbnROYW1lXSA9IFtdO1xuICAgIH1cbiAgICBldmVudExpc3RbZXZlbnROYW1lXS5wdXNoKHtcbiAgICAgICAgJ2NhbGxiYWNrJzogY2FsbGJhY2ssXG4gICAgICAgICdjb250ZXh0JzogY29udGV4dFxuICAgIH0pO1xuXG4gICAgaWYgKGdldE9sZE1lc3NhZ2UpIHtcbiAgICAgICAgb2xkTWVzc2FnZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIHZhbC5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgb25lIG9yIGFsbCBldmVudHMgZnJvbSB0aGUgZXZlbnQtbGlzdC4gSWYgJ2NhbGxiYWNrJyBpcyBudWxsIGFsbCBldmVudHNcbiAqIHdpdGggbmFtZSAnZXZlbnROYW1lJyB3aWxsIGJlIHJlbW92ZWQuXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgZXZlbnROYW1lICBOYW1lIG9mIHRoZSBldmVudFxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHNlbGVjdGluZyBhIHNwZWNpZmljIGV2ZW50XG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmV4cG9ydHMub2ZmID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIGlmIChldmVudE5hbWUgaW4gZXZlbnRMaXN0KSB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudExpc3RbZXZlbnROYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldkxpc3QgPSBldmVudExpc3RbZXZlbnROYW1lXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBldkxpc3QubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2TGlzdFtpXS5jYWxsYmFjayA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgZXZMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQWxsIGFyZ3VtZW50cyB3aWxsXG4gKiBiZSBwYXNzZWQgdGhyb3cgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtICB7U3RyaW5nfSBldmVudE5hbWUgICBOYW1lIG9mIHRoZSBldmVudFxuICogQHBhcmFtICB7KmFyZ3N9ICBhcmd1bWVudHMgICBXaWxsIGJlIHBhc3NlZCB0aHJvdyB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0cy50cmlnZ2VyID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3Muc3BsaWNlKDAsIDEpO1xuICAgIG9sZE1lc3NhZ2UucHVzaCh7XG4gICAgICAgICdldmVudE5hbWUnOiBldmVudE5hbWUsXG4gICAgICAgICdhcmdzJzogYXJnc1xuICAgIH0pO1xuICAgIGlmIChldmVudE5hbWUgaW4gZXZlbnRMaXN0KSB7XG4gICAgICAgIGV2ZW50TGlzdFtldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oY3VyckV2ZW50KSB7XG4gICAgICAgICAgICBjdXJyRXZlbnQuY2FsbGJhY2suYXBwbHkoY3VyckV2ZW50LmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgZXZlbnRzXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmV4cG9ydHMuZGVsZXRlQWxsRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRMaXN0ID0ge307XG4gICAgb2xkTWVzc2FnZSA9IFtdO1xufTtcbiIsImZ1bmN0aW9uIEdyYXZhdGFyRGlyZWN0aXZlKEdyYXZhdGFyRmFjdG9yeSkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBncmF2YXRhckVtYWlsOiAnPSdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBjb25zb2xlLmxvZyhzY29wZSk7XG4gICAgICAgIHNjb3BlLiR3YXRjaCgnZ3JhdmF0YXJFbWFpbCcsIGZ1bmN0aW9uIChlbWFpbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1haWwpO1xuXG4gICAgICAgICAgICBpZiAoZW1haWwgJiYgZW1haWwubWF0Y2goLy4qQC4qXFwuLnsyfS8pICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNzc0NsYXNzID0gYXR0cnMuZ3JhdmF0YXJDc3NDbGFzcyB8fCAnJztcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gR3JhdmF0YXJGYWN0b3J5LmdldEltYWdlU3JjKGVtYWlsLCBhdHRycy5ncmF2YXRhclNlY3VyZSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhZyA9ICc8aW1nIGNsYXNzPVwiJyArIGNzc0NsYXNzICsgJ1wiIHNyYz1cIicgKyBzcmMgKyAnXCIgPic7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ2ltZycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKHRhZyk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ2ltZycpLmJpbmQoJ2Vycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnaW1nJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmF2YXRhckRpcmVjdGl2ZTtcbiIsImltcG9ydCBtZDUgZnJvbSAnLi4vbWQ1JztcblxuZnVuY3Rpb24gR3JhdmF0YXJGYWN0b3J5KCkge1xuICAgIHZhciBHcmF2YXRhciA9IHt9O1xuXG4gICAgR3JhdmF0YXIuZ2V0SW1hZ2VTcmMgPSBmdW5jdGlvbiAoZW1haWwsIHNlY3VyZSkge1xuICAgICAgICB2YXIgaGFzaCA9IG1kNShlbWFpbC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgdmFyIHNyYyA9IChzZWN1cmUgPyAnaHR0cHM6Ly9zZWN1cmUnIDogJ2h0dHA6Ly93d3cnICkgKyAnLmdyYXZhdGFyLmNvbS9hdmF0YXIvJyArIGhhc2ggKyAnP2Q9NDA0JztcbiAgICAgICAgcmV0dXJuIHNyYztcbiAgICB9O1xuXG4gICAgcmV0dXJuIEdyYXZhdGFyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHcmF2YXRhckZhY3Rvcnk7XG4iLCJpbXBvcnQgR3JhdmF0YXJEaXJlY3RpdmUgZnJvbSAnLi9ncmF2YXRhci5kaXJlY3RpdmUnO1xuaW1wb3J0IEdyYXZhdGFyRmFjdG9yeSBmcm9tICcuL2dyYXZhdGFyLmZhY3RvcnknO1xuXG52YXIgYmluZCA9ICgpID0+IHtcbiAgICB2YXIgZGlyZWN0aXZlTmFtZSA9ICdFSC5kaXJlY3RpdmUuZ3JhdmF0YXInO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKGRpcmVjdGl2ZU5hbWUsIFtdKVxuICAgICAgICAuZmFjdG9yeSgnZ3JhdmF0YXJGYWN0b3J5JywgR3JhdmF0YXJGYWN0b3J5KVxuICAgICAgICAuZGlyZWN0aXZlKCdncmF2YXRhckltYWdlJywgWydncmF2YXRhckZhY3RvcnknLCBHcmF2YXRhckRpcmVjdGl2ZV0pO1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZU5hbWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7YmluZH07XG4iLCIvLyBodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldFxuLy8gKyAgIG9yaWdpbmFsIGJ5OiBXZWJ0b29sa2l0LmluZm8gKGh0dHA6Ly93d3cud2VidG9vbGtpdC5pbmZvLylcbi8vICsgbmFtZXNwYWNlZCBieTogTWljaGFlbCBXaGl0ZSAoaHR0cDovL2dldHNwcmluay5jb20pXG4vLyArICAgIHR3ZWFrZWQgYnk6IEphY2tcbi8vICsgICBpbXByb3ZlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXG4vLyArICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4vLyArICAgYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxuLy8gLSAgICBkZXBlbmRzIG9uOiB1dGY4X2VuY29kZVxuLy8gKiAgICAgZXhhbXBsZSAxOiBtZDUoJ0tldmluIHZhbiBab25uZXZlbGQnKTtcbi8vICogICAgIHJldHVybnMgMTogJzZlNjU4ZDRiZmNiNTljYzEzZjk2YzE0NDUwYWM0MGI5J1xuLy8gQWRhcHRlZCB0byBBbmd1bGFySlMgU2VydmljZSBieTogSmltIExhdmluIChodHRwOi8vamltbGF2aW4ubmV0KVxuLy8gYWZ0ZXIgaW5qZWN0aW5nIGludG8geW91ciBjb250cm9sbGVyLCBkaXJlY3RpdmUgb3Igc2VydmljZVxuLy8gKiAgICAgZXhhbXBsZSAxOiBtZDUuY3JlYXRlSGFzaCgnS2V2aW4gdmFuIFpvbm5ldmVsZCcpO1xuLy8gKiAgICAgcmV0dXJucyAxOiAnNmU2NThkNGJmY2I1OWNjMTNmOTZjMTQ0NTBhYzQwYjknXG5cbnZhciBtZDUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgeGw7XG5cbiAgICB2YXIgcm90YXRlTGVmdCA9IGZ1bmN0aW9uIChsVmFsdWUsIGlTaGlmdEJpdHMpIHtcbiAgICAgICAgcmV0dXJuIChsVmFsdWUgPDwgaVNoaWZ0Qml0cykgfCAobFZhbHVlID4+PiAoMzIgLSBpU2hpZnRCaXRzKSk7XG4gICAgfTtcblxuICAgIHZhciBhZGRVbnNpZ25lZCA9IGZ1bmN0aW9uIChsWCwgbFkpIHtcbiAgICAgICAgdmFyIGxYNCwgbFk0LCBsWDgsIGxZOCwgbFJlc3VsdDtcbiAgICAgICAgbFg4ID0gKGxYICYgMHg4MDAwMDAwMCk7XG4gICAgICAgIGxZOCA9IChsWSAmIDB4ODAwMDAwMDApO1xuICAgICAgICBsWDQgPSAobFggJiAweDQwMDAwMDAwKTtcbiAgICAgICAgbFk0ID0gKGxZICYgMHg0MDAwMDAwMCk7XG4gICAgICAgIGxSZXN1bHQgPSAobFggJiAweDNGRkZGRkZGKSArIChsWSAmIDB4M0ZGRkZGRkYpO1xuICAgICAgICBpZiAobFg0ICYgbFk0KSB7XG4gICAgICAgICAgICByZXR1cm4gKGxSZXN1bHQgXiAweDgwMDAwMDAwIF4gbFg4IF4gbFk4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobFg0IHwgbFk0KSB7XG4gICAgICAgICAgICBpZiAobFJlc3VsdCAmIDB4NDAwMDAwMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGxSZXN1bHQgXiAweEMwMDAwMDAwIF4gbFg4IF4gbFk4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChsUmVzdWx0IF4gMHg0MDAwMDAwMCBeIGxYOCBeIGxZOCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKGxSZXN1bHQgXiBsWDggXiBsWTgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfRiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoeCAmIHkpIHwgKCh+eCkgJiB6KTtcbiAgICB9O1xuICAgIHZhciBfRyA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoeCAmIHopIHwgKHkgJiAofnopKTtcbiAgICB9O1xuICAgIHZhciBfSCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoeCBeIHkgXiB6KTtcbiAgICB9O1xuICAgIHZhciBfSSA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoeSBeICh4IHwgKH56KSkpO1xuICAgIH07XG5cbiAgICB2YXIgX0ZGID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIGFjKSB7XG4gICAgICAgIGEgPSBhZGRVbnNpZ25lZChhLCBhZGRVbnNpZ25lZChhZGRVbnNpZ25lZChfRihiLCBjLCBkKSwgeCksIGFjKSk7XG4gICAgICAgIHJldHVybiBhZGRVbnNpZ25lZChyb3RhdGVMZWZ0KGEsIHMpLCBiKTtcbiAgICB9O1xuXG4gICAgdmFyIF9HRyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCBhYykge1xuICAgICAgICBhID0gYWRkVW5zaWduZWQoYSwgYWRkVW5zaWduZWQoYWRkVW5zaWduZWQoX0coYiwgYywgZCksIHgpLCBhYykpO1xuICAgICAgICByZXR1cm4gYWRkVW5zaWduZWQocm90YXRlTGVmdChhLCBzKSwgYik7XG4gICAgfTtcblxuICAgIHZhciBfSEggPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgYWMpIHtcbiAgICAgICAgYSA9IGFkZFVuc2lnbmVkKGEsIGFkZFVuc2lnbmVkKGFkZFVuc2lnbmVkKF9IKGIsIGMsIGQpLCB4KSwgYWMpKTtcbiAgICAgICAgcmV0dXJuIGFkZFVuc2lnbmVkKHJvdGF0ZUxlZnQoYSwgcyksIGIpO1xuICAgIH07XG5cbiAgICB2YXIgX0lJID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIGFjKSB7XG4gICAgICAgIGEgPSBhZGRVbnNpZ25lZChhLCBhZGRVbnNpZ25lZChhZGRVbnNpZ25lZChfSShiLCBjLCBkKSwgeCksIGFjKSk7XG4gICAgICAgIHJldHVybiBhZGRVbnNpZ25lZChyb3RhdGVMZWZ0KGEsIHMpLCBiKTtcbiAgICB9O1xuXG4gICAgdmFyIGNvbnZlcnRUb1dvcmRBcnJheSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgdmFyIGxXb3JkQ291bnQ7XG4gICAgICAgIHZhciBsTWVzc2FnZUxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgICAgIHZhciBsTnVtYmVyT2ZXb3Jkc1RlbXAxID0gbE1lc3NhZ2VMZW5ndGggKyA4O1xuICAgICAgICB2YXIgbE51bWJlck9mV29yZHNUZW1wMiA9IChsTnVtYmVyT2ZXb3Jkc1RlbXAxIC0gKGxOdW1iZXJPZldvcmRzVGVtcDEgJSA2NCkpIC8gNjQ7XG4gICAgICAgIHZhciBsTnVtYmVyT2ZXb3JkcyA9IChsTnVtYmVyT2ZXb3Jkc1RlbXAyICsgMSkgKiAxNjtcbiAgICAgICAgdmFyIGxXb3JkQXJyYXkgPSBuZXcgQXJyYXkobE51bWJlck9mV29yZHMgLSAxKTtcbiAgICAgICAgdmFyIGxCeXRlUG9zaXRpb24gPSAwO1xuICAgICAgICB2YXIgbEJ5dGVDb3VudCA9IDA7XG4gICAgICAgIHdoaWxlIChsQnl0ZUNvdW50IDwgbE1lc3NhZ2VMZW5ndGgpIHtcbiAgICAgICAgICAgIGxXb3JkQ291bnQgPSAobEJ5dGVDb3VudCAtIChsQnl0ZUNvdW50ICUgNCkpIC8gNDtcbiAgICAgICAgICAgIGxCeXRlUG9zaXRpb24gPSAobEJ5dGVDb3VudCAlIDQpICogODtcbiAgICAgICAgICAgIGxXb3JkQXJyYXlbbFdvcmRDb3VudF0gPSAobFdvcmRBcnJheVtsV29yZENvdW50XSB8IChzdHIuY2hhckNvZGVBdChsQnl0ZUNvdW50KSA8PCBsQnl0ZVBvc2l0aW9uKSk7XG4gICAgICAgICAgICBsQnl0ZUNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgbFdvcmRDb3VudCA9IChsQnl0ZUNvdW50IC0gKGxCeXRlQ291bnQgJSA0KSkgLyA0O1xuICAgICAgICBsQnl0ZVBvc2l0aW9uID0gKGxCeXRlQ291bnQgJSA0KSAqIDg7XG4gICAgICAgIGxXb3JkQXJyYXlbbFdvcmRDb3VudF0gPSBsV29yZEFycmF5W2xXb3JkQ291bnRdIHwgKDB4ODAgPDwgbEJ5dGVQb3NpdGlvbik7XG4gICAgICAgIGxXb3JkQXJyYXlbbE51bWJlck9mV29yZHMgLSAyXSA9IGxNZXNzYWdlTGVuZ3RoIDw8IDM7XG4gICAgICAgIGxXb3JkQXJyYXlbbE51bWJlck9mV29yZHMgLSAxXSA9IGxNZXNzYWdlTGVuZ3RoID4+PiAyOTtcbiAgICAgICAgcmV0dXJuIGxXb3JkQXJyYXk7XG4gICAgfTtcblxuICAgIHZhciB3b3JkVG9IZXggPSBmdW5jdGlvbiAobFZhbHVlKSB7XG4gICAgICAgIHZhciB3b3JkVG9IZXhWYWx1ZSA9ICcnLFxuICAgICAgICAgICAgd29yZFRvSGV4VmFsdWVUZW1wID0gJycsXG4gICAgICAgICAgICBsQnl0ZSwgbENvdW50O1xuICAgICAgICBmb3IgKGxDb3VudCA9IDA7IGxDb3VudCA8PSAzOyBsQ291bnQrKykge1xuICAgICAgICAgICAgbEJ5dGUgPSAobFZhbHVlID4+PiAobENvdW50ICogOCkpICYgMjU1O1xuICAgICAgICAgICAgd29yZFRvSGV4VmFsdWVUZW1wID0gJzAnICsgbEJ5dGUudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgd29yZFRvSGV4VmFsdWUgPSB3b3JkVG9IZXhWYWx1ZSArIHdvcmRUb0hleFZhbHVlVGVtcC5zdWJzdHIod29yZFRvSGV4VmFsdWVUZW1wLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3b3JkVG9IZXhWYWx1ZTtcbiAgICB9O1xuXG4gICAgdmFyIHggPSBbXSxcbiAgICAgICAgaywgQUEsIEJCLCBDQywgREQsIGEsIGIsIGMsIGQsIFMxMSA9IDcsXG4gICAgICAgIFMxMiA9IDEyLFxuICAgICAgICBTMTMgPSAxNyxcbiAgICAgICAgUzE0ID0gMjIsXG4gICAgICAgIFMyMSA9IDUsXG4gICAgICAgIFMyMiA9IDksXG4gICAgICAgIFMyMyA9IDE0LFxuICAgICAgICBTMjQgPSAyMCxcbiAgICAgICAgUzMxID0gNCxcbiAgICAgICAgUzMyID0gMTEsXG4gICAgICAgIFMzMyA9IDE2LFxuICAgICAgICBTMzQgPSAyMyxcbiAgICAgICAgUzQxID0gNixcbiAgICAgICAgUzQyID0gMTAsXG4gICAgICAgIFM0MyA9IDE1LFxuICAgICAgICBTNDQgPSAyMTtcblxuICAgIC8vc3RyID0gdGhpcy51dGY4X2VuY29kZShzdHIpO1xuICAgIHggPSBjb252ZXJ0VG9Xb3JkQXJyYXkoc3RyKTtcbiAgICBhID0gMHg2NzQ1MjMwMTtcbiAgICBiID0gMHhFRkNEQUI4OTtcbiAgICBjID0gMHg5OEJBRENGRTtcbiAgICBkID0gMHgxMDMyNTQ3NjtcblxuICAgIHhsID0geC5sZW5ndGg7XG4gICAgZm9yIChrID0gMDsgayA8IHhsOyBrICs9IDE2KSB7XG4gICAgICAgIEFBID0gYTtcbiAgICAgICAgQkIgPSBiO1xuICAgICAgICBDQyA9IGM7XG4gICAgICAgIEREID0gZDtcbiAgICAgICAgYSA9IF9GRihhLCBiLCBjLCBkLCB4W2sgKyAwXSwgUzExLCAweEQ3NkFBNDc4KTtcbiAgICAgICAgZCA9IF9GRihkLCBhLCBiLCBjLCB4W2sgKyAxXSwgUzEyLCAweEU4QzdCNzU2KTtcbiAgICAgICAgYyA9IF9GRihjLCBkLCBhLCBiLCB4W2sgKyAyXSwgUzEzLCAweDI0MjA3MERCKTtcbiAgICAgICAgYiA9IF9GRihiLCBjLCBkLCBhLCB4W2sgKyAzXSwgUzE0LCAweEMxQkRDRUVFKTtcbiAgICAgICAgYSA9IF9GRihhLCBiLCBjLCBkLCB4W2sgKyA0XSwgUzExLCAweEY1N0MwRkFGKTtcbiAgICAgICAgZCA9IF9GRihkLCBhLCBiLCBjLCB4W2sgKyA1XSwgUzEyLCAweDQ3ODdDNjJBKTtcbiAgICAgICAgYyA9IF9GRihjLCBkLCBhLCBiLCB4W2sgKyA2XSwgUzEzLCAweEE4MzA0NjEzKTtcbiAgICAgICAgYiA9IF9GRihiLCBjLCBkLCBhLCB4W2sgKyA3XSwgUzE0LCAweEZENDY5NTAxKTtcbiAgICAgICAgYSA9IF9GRihhLCBiLCBjLCBkLCB4W2sgKyA4XSwgUzExLCAweDY5ODA5OEQ4KTtcbiAgICAgICAgZCA9IF9GRihkLCBhLCBiLCBjLCB4W2sgKyA5XSwgUzEyLCAweDhCNDRGN0FGKTtcbiAgICAgICAgYyA9IF9GRihjLCBkLCBhLCBiLCB4W2sgKyAxMF0sIFMxMywgMHhGRkZGNUJCMSk7XG4gICAgICAgIGIgPSBfRkYoYiwgYywgZCwgYSwgeFtrICsgMTFdLCBTMTQsIDB4ODk1Q0Q3QkUpO1xuICAgICAgICBhID0gX0ZGKGEsIGIsIGMsIGQsIHhbayArIDEyXSwgUzExLCAweDZCOTAxMTIyKTtcbiAgICAgICAgZCA9IF9GRihkLCBhLCBiLCBjLCB4W2sgKyAxM10sIFMxMiwgMHhGRDk4NzE5Myk7XG4gICAgICAgIGMgPSBfRkYoYywgZCwgYSwgYiwgeFtrICsgMTRdLCBTMTMsIDB4QTY3OTQzOEUpO1xuICAgICAgICBiID0gX0ZGKGIsIGMsIGQsIGEsIHhbayArIDE1XSwgUzE0LCAweDQ5QjQwODIxKTtcbiAgICAgICAgYSA9IF9HRyhhLCBiLCBjLCBkLCB4W2sgKyAxXSwgUzIxLCAweEY2MUUyNTYyKTtcbiAgICAgICAgZCA9IF9HRyhkLCBhLCBiLCBjLCB4W2sgKyA2XSwgUzIyLCAweEMwNDBCMzQwKTtcbiAgICAgICAgYyA9IF9HRyhjLCBkLCBhLCBiLCB4W2sgKyAxMV0sIFMyMywgMHgyNjVFNUE1MSk7XG4gICAgICAgIGIgPSBfR0coYiwgYywgZCwgYSwgeFtrICsgMF0sIFMyNCwgMHhFOUI2QzdBQSk7XG4gICAgICAgIGEgPSBfR0coYSwgYiwgYywgZCwgeFtrICsgNV0sIFMyMSwgMHhENjJGMTA1RCk7XG4gICAgICAgIGQgPSBfR0coZCwgYSwgYiwgYywgeFtrICsgMTBdLCBTMjIsIDB4MjQ0MTQ1Myk7XG4gICAgICAgIGMgPSBfR0coYywgZCwgYSwgYiwgeFtrICsgMTVdLCBTMjMsIDB4RDhBMUU2ODEpO1xuICAgICAgICBiID0gX0dHKGIsIGMsIGQsIGEsIHhbayArIDRdLCBTMjQsIDB4RTdEM0ZCQzgpO1xuICAgICAgICBhID0gX0dHKGEsIGIsIGMsIGQsIHhbayArIDldLCBTMjEsIDB4MjFFMUNERTYpO1xuICAgICAgICBkID0gX0dHKGQsIGEsIGIsIGMsIHhbayArIDE0XSwgUzIyLCAweEMzMzcwN0Q2KTtcbiAgICAgICAgYyA9IF9HRyhjLCBkLCBhLCBiLCB4W2sgKyAzXSwgUzIzLCAweEY0RDUwRDg3KTtcbiAgICAgICAgYiA9IF9HRyhiLCBjLCBkLCBhLCB4W2sgKyA4XSwgUzI0LCAweDQ1NUExNEVEKTtcbiAgICAgICAgYSA9IF9HRyhhLCBiLCBjLCBkLCB4W2sgKyAxM10sIFMyMSwgMHhBOUUzRTkwNSk7XG4gICAgICAgIGQgPSBfR0coZCwgYSwgYiwgYywgeFtrICsgMl0sIFMyMiwgMHhGQ0VGQTNGOCk7XG4gICAgICAgIGMgPSBfR0coYywgZCwgYSwgYiwgeFtrICsgN10sIFMyMywgMHg2NzZGMDJEOSk7XG4gICAgICAgIGIgPSBfR0coYiwgYywgZCwgYSwgeFtrICsgMTJdLCBTMjQsIDB4OEQyQTRDOEEpO1xuICAgICAgICBhID0gX0hIKGEsIGIsIGMsIGQsIHhbayArIDVdLCBTMzEsIDB4RkZGQTM5NDIpO1xuICAgICAgICBkID0gX0hIKGQsIGEsIGIsIGMsIHhbayArIDhdLCBTMzIsIDB4ODc3MUY2ODEpO1xuICAgICAgICBjID0gX0hIKGMsIGQsIGEsIGIsIHhbayArIDExXSwgUzMzLCAweDZEOUQ2MTIyKTtcbiAgICAgICAgYiA9IF9ISChiLCBjLCBkLCBhLCB4W2sgKyAxNF0sIFMzNCwgMHhGREU1MzgwQyk7XG4gICAgICAgIGEgPSBfSEgoYSwgYiwgYywgZCwgeFtrICsgMV0sIFMzMSwgMHhBNEJFRUE0NCk7XG4gICAgICAgIGQgPSBfSEgoZCwgYSwgYiwgYywgeFtrICsgNF0sIFMzMiwgMHg0QkRFQ0ZBOSk7XG4gICAgICAgIGMgPSBfSEgoYywgZCwgYSwgYiwgeFtrICsgN10sIFMzMywgMHhGNkJCNEI2MCk7XG4gICAgICAgIGIgPSBfSEgoYiwgYywgZCwgYSwgeFtrICsgMTBdLCBTMzQsIDB4QkVCRkJDNzApO1xuICAgICAgICBhID0gX0hIKGEsIGIsIGMsIGQsIHhbayArIDEzXSwgUzMxLCAweDI4OUI3RUM2KTtcbiAgICAgICAgZCA9IF9ISChkLCBhLCBiLCBjLCB4W2sgKyAwXSwgUzMyLCAweEVBQTEyN0ZBKTtcbiAgICAgICAgYyA9IF9ISChjLCBkLCBhLCBiLCB4W2sgKyAzXSwgUzMzLCAweEQ0RUYzMDg1KTtcbiAgICAgICAgYiA9IF9ISChiLCBjLCBkLCBhLCB4W2sgKyA2XSwgUzM0LCAweDQ4ODFEMDUpO1xuICAgICAgICBhID0gX0hIKGEsIGIsIGMsIGQsIHhbayArIDldLCBTMzEsIDB4RDlENEQwMzkpO1xuICAgICAgICBkID0gX0hIKGQsIGEsIGIsIGMsIHhbayArIDEyXSwgUzMyLCAweEU2REI5OUU1KTtcbiAgICAgICAgYyA9IF9ISChjLCBkLCBhLCBiLCB4W2sgKyAxNV0sIFMzMywgMHgxRkEyN0NGOCk7XG4gICAgICAgIGIgPSBfSEgoYiwgYywgZCwgYSwgeFtrICsgMl0sIFMzNCwgMHhDNEFDNTY2NSk7XG4gICAgICAgIGEgPSBfSUkoYSwgYiwgYywgZCwgeFtrICsgMF0sIFM0MSwgMHhGNDI5MjI0NCk7XG4gICAgICAgIGQgPSBfSUkoZCwgYSwgYiwgYywgeFtrICsgN10sIFM0MiwgMHg0MzJBRkY5Nyk7XG4gICAgICAgIGMgPSBfSUkoYywgZCwgYSwgYiwgeFtrICsgMTRdLCBTNDMsIDB4QUI5NDIzQTcpO1xuICAgICAgICBiID0gX0lJKGIsIGMsIGQsIGEsIHhbayArIDVdLCBTNDQsIDB4RkM5M0EwMzkpO1xuICAgICAgICBhID0gX0lJKGEsIGIsIGMsIGQsIHhbayArIDEyXSwgUzQxLCAweDY1NUI1OUMzKTtcbiAgICAgICAgZCA9IF9JSShkLCBhLCBiLCBjLCB4W2sgKyAzXSwgUzQyLCAweDhGMENDQzkyKTtcbiAgICAgICAgYyA9IF9JSShjLCBkLCBhLCBiLCB4W2sgKyAxMF0sIFM0MywgMHhGRkVGRjQ3RCk7XG4gICAgICAgIGIgPSBfSUkoYiwgYywgZCwgYSwgeFtrICsgMV0sIFM0NCwgMHg4NTg0NUREMSk7XG4gICAgICAgIGEgPSBfSUkoYSwgYiwgYywgZCwgeFtrICsgOF0sIFM0MSwgMHg2RkE4N0U0Rik7XG4gICAgICAgIGQgPSBfSUkoZCwgYSwgYiwgYywgeFtrICsgMTVdLCBTNDIsIDB4RkUyQ0U2RTApO1xuICAgICAgICBjID0gX0lJKGMsIGQsIGEsIGIsIHhbayArIDZdLCBTNDMsIDB4QTMwMTQzMTQpO1xuICAgICAgICBiID0gX0lJKGIsIGMsIGQsIGEsIHhbayArIDEzXSwgUzQ0LCAweDRFMDgxMUExKTtcbiAgICAgICAgYSA9IF9JSShhLCBiLCBjLCBkLCB4W2sgKyA0XSwgUzQxLCAweEY3NTM3RTgyKTtcbiAgICAgICAgZCA9IF9JSShkLCBhLCBiLCBjLCB4W2sgKyAxMV0sIFM0MiwgMHhCRDNBRjIzNSk7XG4gICAgICAgIGMgPSBfSUkoYywgZCwgYSwgYiwgeFtrICsgMl0sIFM0MywgMHgyQUQ3RDJCQik7XG4gICAgICAgIGIgPSBfSUkoYiwgYywgZCwgYSwgeFtrICsgOV0sIFM0NCwgMHhFQjg2RDM5MSk7XG4gICAgICAgIGEgPSBhZGRVbnNpZ25lZChhLCBBQSk7XG4gICAgICAgIGIgPSBhZGRVbnNpZ25lZChiLCBCQik7XG4gICAgICAgIGMgPSBhZGRVbnNpZ25lZChjLCBDQyk7XG4gICAgICAgIGQgPSBhZGRVbnNpZ25lZChkLCBERCk7XG4gICAgfVxuXG4gICAgdmFyIHRlbXAgPSB3b3JkVG9IZXgoYSkgKyB3b3JkVG9IZXgoYikgKyB3b3JkVG9IZXgoYykgKyB3b3JkVG9IZXgoZCk7XG5cbiAgICByZXR1cm4gdGVtcC50b0xvd2VyQ2FzZSgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbWQ1O1xuIiwiaW1wb3J0IG1kNSBmcm9tICcuL21kNSc7XG5cbnZhciB1dGlsaXR5ID0ge1xuXG4gICAgLyoqXG4gICAgICogU2hvcnRjdXQgZm9yIHByaW50aW5nXG4gICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIHA6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBpczoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIGEgc3RyaW5nXG4gICAgICAgICAqIEBwYXJhbSAge29iamVjdH0gc3RyXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBzdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhbmd1bGFyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmlzU3RyaW5nKHN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnIHx8IHN0ciBpbnN0YW5jZW9mIFN0cmluZyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgYSByZWZlcmVuY2UgaXMgYW4gQXJyYXlcbiAgICAgICAgICogQHBhcmFtICB7b2JqZWN0fSBhcnJcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGFycmF5OiBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFycik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgYSByZWZlcmVuY2UgaXMgYW4gaW50ZWdlclxuICAgICAgICAgKiBAcGFyYW0gIHtvYmplY3R9IG5cbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGludDogZnVuY3Rpb24obikge1xuICAgICAgICAgICAgcmV0dXJuIG4gPT09ICtuICYmIG4gPT09IChufDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIGRlZmluZWQgb3Igbm90IG51bGxcbiAgICAgICAgICogQHBhcmFtICB7b2JqZWN0fSB2YXJpYWJsZVxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YodmFyaWFibGUpICE9PSAndW5kZWZpbmVkJyAmJiB2YXJpYWJsZSAhPT0gbnVsbCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB0bzoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0IG9iamVjdCB0byBpbnRcbiAgICAgICAgICogQHBhcmFtICB7b2JqZWN0fSBvYmpcbiAgICAgICAgICogQHJldHVybiB7aW50ZWdlcn1cbiAgICAgICAgICovXG4gICAgICAgIGludDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqfDA7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB0aW1lOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybiB0aGUgbG9jYWwgdGltZVxuICAgICAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgICBVbml4dGltZXN0YW1wICogMTAwMFxuICAgICAgICAgKi9cbiAgICAgICAgbm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udmVydCBhIFVUQyBkYXRlIHRvIGEgbG9jYWwgdGltZXpvbmVcbiAgICAgICAgICogQHBhcmFtICB7aW50ZWdlcn0gdW5peHRpbWVzdGFtcFxuICAgICAgICAgKiBAcmV0dXJuIHtEYXRlfVxuICAgICAgICAgKi9cbiAgICAgICAgY29udmVydFVUQ0RhdGVUb0xvY2FsRGF0ZTogZnVuY3Rpb24odW5peHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgdmFyIHV0Y0RhdGUgPSBuZXcgRGF0ZSh1bml4dGltZXN0YW1wICogMTAwMCk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB1dGNEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgICAgIHZhciBob3VycyA9IHV0Y0RhdGUuZ2V0SG91cnMoKTtcblxuICAgICAgICAgICAgdXRjRGF0ZS5zZXRIb3Vycyhob3VycyAtIG9mZnNldCk7XG5cbiAgICAgICAgICAgIHJldHVybiB1dGNEYXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBuZXh0IFN1bmRheSwgYmFzdGVkIG9uIGRheSBkXG4gICAgICAgICAqIEBwYXJhbSAge0RhdGV9IGRcbiAgICAgICAgICogQHJldHVybiB7RGF0ZX1cbiAgICAgICAgICovXG4gICAgICAgIG5leHRTdW5kYXk6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgZC5nZXREYXRlKCkgLSBkLmdldERheSgpICsgNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIGEgZGF0ZSAnbicgZGF5cyBmcm9tIG5vd1xuICAgICAgICAgKiBAcGFyYW0gIHtpbnRlZ2VyfSBuXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gb24gZm9ybSBZWVlZLU1NLUREXG4gICAgICAgICAqL1xuICAgICAgICBmdXR1cmVEYXRlOiBmdW5jdGlvbihuKSB7XG4gICAgICAgICAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHRpbWVzdGFtcCArIChuIHx8IDApICogODY0MDAwMDApO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgZC5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgIChtb250aCA8IDEwID8gJzAnICsgbW9udGggOiBtb250aCksXG4gICAgICAgICAgICAgICAgKGQuZ2V0RGF0ZSgpIDwgMTAgPyAnMCcgKyBkLmdldERhdGUoKSA6IGQuZ2V0RGF0ZSgpKVxuICAgICAgICAgICAgXS5qb2luKCctJyk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IEpTT04gc3RyaW5nIHRvIGFuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG9ialxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBqc29uUGFyc2VyOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKG9iaik7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYSBVUkwgZnJpZW5kbHkgdGl0bGVcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRleHRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgdXJsVGl0bGU6IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1teXFx3IF0rL2csJycpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8gKy9nLCctJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIGVwaXNvZGUgbnVtYmVyIG9uIGZvcm0gU1hYRVhYXG4gICAgICogQHBhcmFtICB7aW50ZWdlcn0gc2Vhc29uXG4gICAgICogQHBhcmFtICB7aW50ZWdlcn0gZXBpc29kZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBlcGlzb2RlTnVtYmVyOiBmdW5jdGlvbihzZWFzb24sIGVwaXNvZGUpIHtcbiAgICAgICAgdmFyIFNFID0gJ1MnO1xuXG4gICAgICAgIGlmIChzZWFzb24gPCAxMCkge1xuICAgICAgICAgICAgU0UgKz0gJzAnICsgc2Vhc29uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgU0UgKz0gc2Vhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgU0UgKz0gJ0UnO1xuXG4gICAgICAgIGlmIChlcGlzb2RlIDwgMTApIHtcbiAgICAgICAgICAgIFNFICs9ICcwJyArIGVwaXNvZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTRSArPSBlcGlzb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFNFO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bWQ1fVxuICAgICAqL1xuICAgIG1kNTogbWQ1XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHV0aWxpdHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCByb3V0ZVRhYmxlID0gKCRyb3V0ZVByb3ZpZGVyKSA9PiB7XG4gICAgJHJvdXRlUHJvdmlkZXJcblxuICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VwY29taW5nL3VwY29taW5nLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1VwY29taW5nQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcbiAgICAgICAgfSlcblxuICAgICAgICAud2hlbignL21iJywge1xuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aW1nIHNyYz1cIi9tYi5naWZcIj4nLFxuICAgICAgICB9KVxuXG4gICAgICAgIC53aGVuKCcvcmVnaXN0ZXInLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoZW50aWNhdGlvbkN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXG4gICAgICAgIH0pXG5cbiAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICAgICAgfSk7XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlVGFibGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBVcGNvbWluZ0N0cmwgZnJvbSAnLi91cGNvbWluZy5jb250cm9sbGVyJztcbmltcG9ydCBVcGNvbWluZ1JlcG9zaXRvcnkgZnJvbSAnLi91cGNvbWluZy5yZXBvc2l0b3J5JztcblxudmFyIGJpbmQgPSAoKSA9PiB7XG4gICAgdmFyIG1vZHVsZU5hbWUgPSAnRUgudXBjb21pbmcnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKG1vZHVsZU5hbWUsIFtdKVxuICAgICAgICAuY29udHJvbGxlcignVXBjb21pbmdDdHJsJywgVXBjb21pbmdDdHJsKVxuICAgICAgICAuc2VydmljZSgnVXBjb21pbmdSZXBvc2l0b3J5JywgVXBjb21pbmdSZXBvc2l0b3J5KTtcblxuICAgIHJldHVybiBtb2R1bGVOYW1lO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge2JpbmR9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBVcGNvbWluZ0N0cmwge1xuXG4gICAgY29uc3RydWN0b3IocmVwb3NpdG9yeSkge1xuICAgICAgICByZXBvc2l0b3J5XG4gICAgICAgICAgICAuZ2V0KClcbiAgICAgICAgICAgIC50aGVuKHNob3dzID0+IHRoaXMuc2hvd3MgPSBzaG93cyk7XG4gICAgfVxuXG59XG5cblVwY29taW5nQ3RybC4kaW5qZWN0ID0gWydVcGNvbWluZ1JlcG9zaXRvcnknXTtcbmV4cG9ydCBkZWZhdWx0IFVwY29taW5nQ3RybDtcbiIsIid1c2Ugc3RyaW5nJztcblxuaW1wb3J0IEJhc2VFcGlzb2RlTW9kZWwgZnJvbSAnLi4vbGliL2Jhc2UuZXBpc29kZS5tb2RlbCc7XG5pbXBvcnQgQmFzZVNob3dNb2RlbCBmcm9tICcuLi9saWIvYmFzZS5zaG93Lm1vZGVsJztcbmltcG9ydCB1IGZyb20gJy4uL2xpYi91dGlsaXR5JztcblxuY29uc3QgdXBjb21pbmdFbnVtID0ge1xuICAgIEpVU1RfQUlSRUQ6IHsnaGVhZGxpbmUnOiAnanVzdCBhaXJlZCcsICdvcmRlcic6IDB9LFxuICAgIFRISVNfV0VFSzogeydoZWFkbGluZSc6ICd0aGlzIHdlZWsnLCAnb3JkZXInOiAxfSxcbiAgICBORVhUX1dFRUs6IHsnaGVhZGxpbmUnOiAnbmV4dCB3ZWVrJywgJ29yZGVyJzogMn0sXG4gICAgVVBDT01JTkc6IHsnaGVhZGxpbmUnOiAndXBjb21pbmcnLCAnb3JkZXInOiAzfSxcbiAgICBUQkE6IHsnaGVhZGxpbmUnOiAndGJhJywgJ29yZGVyJzogNH1cbn07XG5cbi8qKlxuICogVXBjb21pbmcgTW9kZWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKi9cbnZhciBVcGNvbWluZ01vZGVsID0gZnVuY3Rpb24gVXBjb21pbmdNb2RlbChvcHRpb25zKSB7XG4gICAgQmFzZUVwaXNvZGVNb2RlbC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgIEJhc2VTaG93TW9kZWwuY2FsbCh0aGlzLnNob3cgPSB7fSwgb3B0aW9ucy5zaG93KTtcblxuICAgIC8qKlxuICAgICAqIFVSTCBzZXJpZXMgcGFnZSBmb3IgdGhpcyBlcGlzb2RlXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnVybCA9IChzY29wZSA9PiB7XG4gICAgICAgIHZhciB1cmwgPSBzY29wZS5zaG93LnVybDtcbiAgICAgICAgaWYgKHNjb3BlLmlkKSB7XG4gICAgICAgICAgICB1cmwgKz0gJy8nICsgc2NvcGUuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9KSh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgcmlnaHQgdXBjb21pbmcgZ3JvdXBcbiAgICAgKiBAdHlwZSB7VXBjb21pbmdNb2RlbH0gc2NvcGVcbiAgICAgKiBAcmV0dXJuIHt1cGNvbWluZ0VudW19XG4gICAgICovXG4gICAgdGhpcy5ncm91cCA9IChzY29wZSA9PiB7XG4gICAgICAgIHZhciBhaXIgPSBzY29wZS5haXJzO1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHRoaXNTdW5kYXkgPSB1LnRpbWUubmV4dFN1bmRheShub3cpO1xuICAgICAgICB2YXIgbmV4dFN1bmRheSA9IHUudGltZS5uZXh0U3VuZGF5KHRoaXNTdW5kYXkpO1xuICAgICAgICBpZiAoYWlyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1cGNvbWluZ0VudW0uVEJBO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1LmlzLnNldChzY29wZS5pZCkgfHwgYWlyIDw9IG5vdykge1xuICAgICAgICAgICAgcmV0dXJuIHVwY29taW5nRW51bS5UQkE7XG4gICAgICAgIH0gZWxzZSBpZiAoYWlyIDwgbm93KSB7XG4gICAgICAgICAgICByZXR1cm4gdXBjb21pbmdFbnVtLkpVU1RfQUlSRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoYWlyIDw9IHRoaXNTdW5kYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB1cGNvbWluZ0VudW0uVEhJU19XRUVLO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXNTdW5kYXkgPCBhaXIgJiYgYWlyIDw9IG5leHRTdW5kYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB1cGNvbWluZ0VudW0uTkVYVF9XRUVLO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVwY29taW5nRW51bS5VUENPTUlORztcbiAgICAgICAgfVxuICAgIH0pKHRoaXMpO1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBVcGNvbWluZ01vZGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQmFzZVJlcG9zaXRvcnkgZnJvbSAnLi4vbGliL2Jhc2UucmVwb3NpdG9yeSc7XG5pbXBvcnQgVXBjb21pbmdNb2RlbCBmcm9tICcuL3VwY29taW5nLm1vZGVsJztcblxuY2xhc3MgVXBjb21pbmdSZXBvc2l0b3J5IGV4dGVuZHMgQmFzZVJlcG9zaXRvcnkge1xuXG4gICAgY29uc3RydWN0b3IoaHR0cCkge1xuICAgICAgICBzdXBlcihodHRwKTtcbiAgICAgICAgdGhpcy5hcGlFbmRwb2ludCA9ICdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci91cGNvbWluZyc7XG4gICAgfVxuXG4gICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KClcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfKGRhdGEuZXBpc29kZXMpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBuZXcgVXBjb21pbmdNb2RlbChlKSlcbiAgICAgICAgICAgICAgICAgICAgLmdyb3VwQnkodSA9PiB1Lmdyb3VwLm9yZGVyKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkbGluZTogXy5maXJzdChhKS5ncm91cC5oZWFkbGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcGlzb2RlczogXy5zb3J0QnkoYSwgKGEpID0+IGEuYWlycylcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuXG5VcGNvbWluZ1JlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcbmV4cG9ydCBkZWZhdWx0IFVwY29taW5nUmVwb3NpdG9yeTtcbiJdfQ==
