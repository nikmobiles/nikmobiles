/**
 * for ie 8
 *
 *
 */

    //autologin_json2
if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//autologin_json2 end

//base64 start

base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx == -1) {
        throw "Cannot decode base64";
    }
    return idx;
}

base64.decode = function(s) {
    // convert to string
    s = "" + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax == 0) {
        return s;
    }

    if (imax % 4 != 0) {
        throw "Cannot decode base64";
    }

    pads = 0
    if (s.charAt(imax -1) == base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax -2) == base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
        case 1:
            b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6)
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
            break;
        case 2:
            b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
            x.push(String.fromCharCode(b10 >> 16));
            break;
    }
    return x.join('');
}

base64.getbyte = function(s,i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw "INVALID_CHARACTER_ERR: DOM Exception 5";
    }
    return x;
}


base64.encode = function(s) {
    if (arguments.length != 1) {
        throw "SyntaxError: Not enough arguments";
    }
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = "" + s;

    var imax = s.length - s.length % 3;

    if (s.length == 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
        case 1:
            b10 = getbyte(s,i) << 16;
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                padchar + padchar);
            break;
        case 2:
            b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                alpha.charAt((b10 >> 6) & 0x3f) + padchar);
            break;
    }
    return x.join('');
}

//base64 end


var indexOf = function(obj, start) {
    for (var x = 0, j = obj.length; x < j; x++) {
        if (obj[x] === start) { return x; }
    }
    return -1;
};

if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

if (!window.btoa) window.btoa = base64.encode;
if (!window.atob) window.atob = base64.decode;

(function(){

    var ruleLandingFlag = 0;

    var AutoLogin = {

        stepCheckDMP : 25,

        config : null,

        selectors : {
            a : 'a'
        },

        attributes : {
            onclick : 'onclick'
        },

        style : {
            block : 'block'
        },

        /**
         * Initialize auto login
         *
         * @param {object} autoLogin Auto login config
         */
        init : function(autoLogin){
            if (DatingDetect.setCheckLogin)
                DatingDetect.setCheckLogin(false);

            if (DatingDetect.startAutologinTimeLog)
                DatingDetect.startAutologinTimeLog();

            AutoLogin.config = autoLogin;

            AutoLogin.checkDMP(function(used) {

                AutoLogin.tryLogin(null, null);

                if (used) {
                    if (ruleLandingFlag)
                        AutoLogin.appendTRid(AutoLogin.config.tRid);

                } else {
                    window.onload = function(){
                        AutoLogin.appendTRid(AutoLogin.config.tRid);
                    }
                }
            });
        },

        /**
         * Check rules
         *
         * @param {object|null} rule
         * @param {object|null} ddInfo
         */
        tryLogin : function(rule, ddInfo) {
            if (ddInfo) {
                AutoLogin.redirect(rule, ddInfo);
            } else {
                if (AutoLogin.config.rules.length) {
                    AutoLogin.tryLoginRule(AutoLogin.config.rules.shift(), AutoLogin.tryLogin, []);
                } else {
                    if (DatingDetect.endAutologinTimeLog)
                        DatingDetect.endAutologinTimeLog(window.location.href);

                    var cont = function() {
                        if(parseInt(AutoLogin.config.sid) == 0) {
                            AutoLogin.trackRedirect( AutoLogin.config.href );
                            location.href = AutoLogin.config.href;
                        } else {
                            AutoLogin.appendTRid(AutoLogin.config.tRid);
                        }
                    };

                    cont();

                }
            }
        },

        tryLoginRule : function(rule, callback, ddInfo){
            var i;
            if (rule.conditions.length) {
                (function(cond){
                    var domains;

                    if (cond.domain == 'Any') {
                        cond.domain = 'multisite';
                    }

                    domains = indexOf(['multisite', 'phoenix'], cond.domain) > -1 ?
                        DatingDetect.getListDomains(cond.domain) :
                        [cond.domain];

                    DatingDetect.getLoginsCountOnReady(domains, function(ddInfoList){
                        var ddSuccess = false, i;

                        if (ddInfoList) {
                            for (i in ddInfoList) if(ddInfoList[i]) {
                                if(AutoLogin.checkSuccess(ddInfoList[i], cond)) {
                                    ddSuccess = ddInfoList[i];
                                    break;
                                }
                            }
                        }

                        ddInfo.push(ddSuccess)
                        AutoLogin.tryLoginRule(rule, callback, ddInfo);
                    });
                })(rule.conditions.shift());
            } else {
                if (indexOf(ddInfo, false) > -1 || indexOf(ddInfo, null) > -1 || !ddInfo.length) {
                    callback(rule, null);
                } else {
                    var go = false;
                    for (i in ddInfo) {
                        if (ddInfo[i].click_info) {
                            if (ddInfo[i].click_info.vid) {
                                callback(rule, ddInfo[i]);
                                go = true;
                                break;
                            }
                        }
                        go = false;
                    }

                    if (!go) {
                        callback(rule, ddInfo[0]);
                    }
                }
            }
        },

        /**
         *
         * Go auto login url
         *
         * @param {object} rule Rule info
         * @param {object} ddInfo Info from dating detect
         */
        redirect : function(rule, ddInfo) {
            AutoLogin.targetParams(rule.url, ddInfo, function(url){
                url = AutoLogin.config.href
                    + '&parameters=' + rule.parameters
                    + '&url=' + url
                    + '&autologin=' + decodeURIComponent(rule.name);
                var elements = document.querySelectorAll('[onclick^="window.open"]');

                if (rule.landing == 1 && elements.length > 0) {
                    ruleLandingFlag = 1;
                    var elements = document.querySelectorAll('[onclick^="window.open"]');
                    var i;
                    for (i = 0; i < elements.length; i++) {
                        elements[i].onclick = null;
                        elements[i].setAttribute("onclick", "window.open('" + decodeURIComponent(url).replace(/^.*\/\/[^\/]+/, '') + "', '_self')");

                        if (elements[i].addEventListener) {
                            elements[i].addEventListener('click', function(){eval(this.getAttribute('onclick'));});
                        }
                    }

                    if (DatingDetect.endAutologinTimeLog)
                        DatingDetect.endAutologinTimeLog(window.location.href);

                    if (DatingDetect.endTimeLog) {
                        DatingDetect.endTimeLog(true);
                    }

                } else if (!ruleLandingFlag) {

                    if (DatingDetect.endAutologinTimeLog)
                        DatingDetect.endAutologinTimeLog(window.location.href);

                    var redirectTo = function () {
                        AutoLogin.trackRedirect(decodeURIComponent(url));
                        location.href = decodeURIComponent(url);
                    }

                    if (DatingDetect.endTimeLog) {
                        DatingDetect.endTimeLog(true, redirectTo);
                    }
                    else {
                        redirectTo();
                    }
                }

            });
        },

        /**
         * Track redirect url
         * @param  {string} url Url for redirect
         */
        trackRedirect : function( url ) {

            if ( !url
                || typeof url !== 'string' )
                return;

            window.dcGtmLayer = window.dcGtmLayer || [];
            var splt, site, page, baseUrl;

            try {
                if ( url ) {
                    splt = url.split( '?' );
                    splt[1] && ( baseUrl = splt[1] );
                    if ( baseUrl && ~baseUrl.indexOf( '&url=' ) ) {
                        splt = baseUrl.split( '&' );
                        for ( var i = splt.length - 1; i >= 0; i-- ) {
                            if ( splt[i] && ~splt[i].indexOf( 'url=' ) == -1 ) {
                                baseUrl = splt[i].substr( splt[i].indexOf( '=' ) + 1, baseUrl.length );
                                baseUrl && window.base64 && base64.decode && ( url = decodeURIComponent( base64.decode( baseUrl ) ) );
                                break;
                            }
                        }
                    }
                }
            } catch ( e ) {
                window.dcGtmLayer.push({ 'event': 'page-event', 'eventCategory': 'Error', 'eventAction': 'Parse url error' });
                url = void 0;
            }

            if ( url ) {
                splt = url.match(/:\/\/([^\/]*)/);
                splt && splt[1] && ( site = splt[1] );
                splt = url.match(/dynamicpage=([^&]*)/);
                splt && splt[1] && ( page = splt[1] );
            }

            window.dcGtmLayer.push({ 'event': 'redirect', 'site': site || 'unknown', 'page': page || 'unknown', 'is_redirect' : true });

        },

        /**
         * Check condition exists
         *
         * @param {Object} domain Dating detect object
         * @param {Object} condition Front rules
         * @returns {*}
         */
        checkSuccess : function(ddInfo, condition) {
            if (ddInfo) {
                return eval(ddInfo.login_count + (condition.condition == '=' ? '==' : condition.condition) + condition.count);
            } else {
                return false;
            }
        },

        /**
         * Attach uri params to target link
         *
         * @param {string} url Target link
         * @param {object} ddInfo Dating detect info about target domain
         * @param {Function} callback Called on end build url
         * @returns {string} Target link with uri params
         */
        targetParams : function(url, ddInfo, callback) {
            if (indexOf(url, '?') < 0) {
                url += '?';
            }

            DatingDetect.getWithInfo(ddInfo, function(ddExists){
                ddInfo = !ddInfo.click_info.length && ddExists ? ddExists : ddInfo;

                var urlDomain = AutoLogin.getDomainFromUrl(url);
                var ddParam = function(index, defVal, dd) {
                    index = index || 0;
                    defVal = defVal || 0;
                    dd = dd || ddInfo;

                    return ("undefined" != typeof dd.click_info[index] && dd.click_info[index] ? dd.click_info[index] : defVal);
                }

                var setTransferTo = false;
                var dmpUsed = false;

                if (AutoLogin.config.useDMP == true && ddInfo.click_info.vid) {
                    setTransferTo = true;
                    dmpUsed = true;
                    url += '&vid=' + ddInfo.click_info.vid;
                }
                else {
                    if (ddInfo.click_info.length) {

                        if (ddInfo && (indexOf(DatingDetect.getListDomains('multisite'), ddInfo.site) > -1)) {
                            url += '&oid=' + ddParam(0);
                            url += '&user_key=' + ddParam(1);
                            url += '&src_info=' + ddParam(2);
                        }

                        if (ddInfo && (indexOf(DatingDetect.getListDomains('phoenix'), ddInfo.site) > -1)) {
                            url += '&key=' + ddParam(1);
                            url += '&userId=' + ddParam(0);
                        }

                        setTransferTo = true;
                    }
                }

                if (true == setTransferTo) {
                    if ( -1 == indexOf(url, 'transfer_to')) {
                        url += '&transfer_to=' + urlDomain;
                    }
                }

                url += '&source=' + (AutoLogin.isDomainMobile(url) ? 'm.' : '') +  ddParam(4, ddInfo.site);
                url += '&extcl=1';

                var targetDomain = [urlDomain];

                if (DatingDetect.getSameBrand) {
                    var domains = DatingDetect.getSameBrand(urlDomain);

                    if (JSON.stringify(domains) != '{}') {
                        targetDomain = [];

                        for (var domain in domains) {
                            if (domains.hasOwnProperty(domain)) {
                                targetDomain.push(domain);
                            }
                        }

                    }

                }

                DatingDetect.getLoginsCountOnReady(targetDomain, function(ddTarget) {

                    if (ddTarget && ddTarget[0]) {
                        ddTarget = ddTarget[0];

                        var userId = ddParam(0, null, ddTarget);
                        var key = ddParam(1, null, ddTarget);

                        if (userId && key && dmpUsed == false) {
                            url += '&ukeyc=' + key;
                            url += '&uidc=' + userId;
                        }
                    }

                    callback(btoa(url));
                });

            });
        },

        /**
         * Get host from given url
         *
         * @param {string} url Url to parse
         * @returns {string} Url for check
         */
        getDomainFromUrl : function(url) {
            var a = document.createElement('a');
            a.href = url;

            var host = a.hostname.replace("www.", "").split('.');
            host = host[host.length - 2] + '.' + host[host.length - 1];

            return host;
        },

        isDomainMobile : function(url) {
            var a = document.createElement('a');
            a.href = url;

            var host = a.hostname.replace("www.", "").split('.');

            return host.length > 2 && host[0] == 'm';
        },

        /**
         * Append trid param to url
         *
         * @param {string} trid Target id
         */
        appendTRid : function(trid) {
            if (DatingDetect.endTimeLog) {
                DatingDetect.endTimeLog(true);
            }
            var link = document.getElementsByTagName(AutoLogin.selectors.a);
            var attribute;

            document.body.style.display = AutoLogin.style.block;

            for(var i=0;i<link.length;i++){
                attribute = link[i].getAttribute(AutoLogin.attributes.onclick);

                if(Boolean(attribute) && attribute.match('\/site\/redirectpage')){
                    link[i].setAttribute(AutoLogin.attributes.onclick, attribute.replace("',", "&ofid=" + trid + "',"));
                }
            }
        },

        /**
         * check data from DMP
         *
         */

        checkDMP : function (callback)
        {
            if (typeof data_brain !=="undefined" && AutoLogin.config.useDMP == true) {
                var time = 0;

                var interval = setInterval(function () {
                    time += AutoLogin.stepCheckDMP;

                    if (time >= data_brain.timeRequestLimit || !isEmpty(data_brain.getData())) {

                        clearInterval(interval);
                        DatingDetect.setDMPResponse(data_brain.getMergeData());
                        callback(true);
                    }

                },  AutoLogin.stepCheckDMP);

            } else {
                callback(false);
            }
        }
    }

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    AutoLogin.init(autoLogin);

})();
