var http = require("http");
var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var url = "https://wechat.v2.traceint.com/index.php/reserve/layout/libid=23.html";

var cookie2 = request.cookie("wechatSESS_ID=539f19c0fc6457659d0a4b7f90569d89a10079a0db444361");

function call(url, callback) {
    request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.5;q=0.4",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1219.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie2,

            },
            gzip: true
        }
        ,
        callback
    )
}

call(url, function (error, response, body) {
    var $ = cheerio.load(body);
    var src = $('script').eq(2).attr("src");
    call(src, function (error, response, body) {
        eval(body);
        reserve_seat(23, "10,23");

    })
})

/*request({
        method: "GET",
        url: "https://wechat.v2.traceint.com/index.php/reserve/layout/libid=20100.html&1604562455",
        headers: {
            "Accept": "application/json, text/javascript, *!/!*; q=0.01",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.5;q=0.4",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1219.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat",
            "X-Requested-With": "XMLHttpRequest",
            "Cookie": cookie1,
            "Cookie": cookie2
        },
        gzip: true
    }
    ,
    function (error, response, body) {
        var $ = cheerio.load(body);
        var attr = $('script').eq(2).attr("src");
    }
)*/


class TT {
    ajax_get(msg) {

        call(msg, function (error, response, body) {
            console.log(body)
        });
    }
}

var T = new TT();
var AJAX_URL = "http://wechat.v2.traceint.com/index.php/reserve/get/?";
var _ = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", f = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 18,
    J: 19,
    K: 20,
    L: 21,
    M: 22,
    N: 23,
    O: 24,
    P: 25,
    Q: 26,
    R: 27,
    S: 28,
    T: 29,
    U: 30,
    V: 31,
    W: 32,
    X: 33,
    Y: 34,
    Z: 35,
    a: 36,
    b: 37,
    c: 38,
    d: 39,
    e: 40,
    f: 41,
    g: 42,
    h: 43,
    i: 44,
    j: 45,
    k: 46,
    l: 47,
    m: 48,
    n: 49,
    o: 50,
    p: 51,
    q: 52,
    r: 53,
    s: 54,
    t: 55,
    u: 56,
    v: 57,
    w: 58,
    x: 59,
    y: 60,
    z: 61
};
Hexch = function (t) {
    if (t.length < 57) throw new Error("the key is too short.");
    this._sz = _.charCodeAt(t[15]) % (t.length - 20) + 10, this._ks = t.slice(-this._sz);
    for (var r = 0; r < this._sz; ++r) this._ks[r] = _.charCodeAt(this._ks[r] % 62);
    this._k16 = [], this._k41 = [], this._t16 = {}, this._t41 = {};
    for (r = 0; r < 16; ++r) this._k16[r] = _.charAt(t[r]), this._t16[this._k16[r]] = r;
    for (r = 0; r < 41; ++r) this._k41[r] = _.charAt(t[r + 16]), this._t41[this._k41[r]] = r
}, Hexch.prototype.dec = function (t) {
    for (var r = this._t16, s = this._t41, e = this._ks, h = this._sz, i = 0, o = t.replace(/[0-9A-Za-z]/g, function (t) {
        return _.charAt((f[t] - e[i++ % h] % 62 + 62) % 62)
    }), c = "", n = 0; n < o.length;) {
        var a = o.charAt(n);
        /[\s\n\r]/.test(a) ? (c += a, ++n) : void 0 !== r[a] ? (c += String.fromCharCode(16 * r[o.charAt(n)] + r[o.charAt(n + 1)]), n += 2) : (c += String.fromCharCode(1681 * s[o.charAt(n)] + 41 * s[o.charAt(n + 1)] + s[o.charAt(n + 2)]), n += 3)
    }
    return c
}, reserve_seat = function (s, e, t) {
    void 0 === t && (t = "");
    var r = JSON.parse("[22,36,23,53,3,2,61,12,60,40,25,38,59,48,51,39,1,42,21,35,11,41,37,0,44,43,27,56,30,45,34,46,14,32,5,58,7,31,29,49,16,20,54,4,55,9,50,8,17,33,24,26,6,10,13,28,19,57,15,52,18,47]"),
        h = new Hexch(r);
    T.ajax_get(AJAX_URL + "libid=" + s + "&" + h.dec("vyYdCF3FvkelCnKtrsIOBj") + "=" + e + "&yzm=" + t, function (t) {
        var r = "undefined" == typeof _ORG || _ORG;
        "0" == t.code ? (T.tips(t.msg), setTimeout(function () {
            location.href = t.url
        }, 1e3)) : r && 1e3 == t.code ? show_yzm(function (t) {
            reserve_seat(s, e, t)
        }) : T.tips(t.msg)
    })
};
