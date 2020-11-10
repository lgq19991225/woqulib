const request = require("request");
const cheerio = require("cheerio");
const schedule = require("node-schedule");
const AJAX_URL = "http://wechat.v2.traceint.com/index.php/reserve/get/?";
let url = "https://wechat.v2.traceint.com/index.php/reserve/layout/libid=";
let index = "https://wechat.v2.traceint.com/index.php/reserve/index.html";
let indexDomain = "https://wechat.v2.traceint.com";
let _libid;
let _seat;
let cookie;
let j = request.jar();
let _roomName;

//伪造回调类
class TT {
    ajax_get(msg) {
        console.log(new Date().toString());
        console.log(cookie);
        console.log("开始占座:" + msg);
        callUrl(msg, function (error, response, body) {
            //获取抢座结果
            try {
                console.log(JSON.parse(body).msg);
            } catch (e) {
                console.error(e);
            }
        });
    }
}

const T = new TT();

//从首页开始爬取
function initIndex(roomName, seat, wechatSESS_ID) {
    _roomName = roomName;
    _seat = seat;
    cookie = "wechatSESS_ID=" + wechatSESS_ID;
}

function updateIndex() {
    console.log("刷新网站:" + index);
    callUrl(index, libRoomUpdate);
}

function startIndex() {
    console.log("爬取网站:" + index);
    callUrl(index, indexRoom);
}

function indexRoom(error, response, body) {

    if (body) {
        const $ = cheerio.load(body);
        let items = $('.list-group-item');
        //已经订座
        if (!items.length) {
            items = $('.block-warp ');
            console.log(items.text());
            return false;
        }
        //查找房间名符合的 并找出data_url
        items.each(function (index, item) {
            let roomName = $(this).find('.list-group-item-heading').text();
            if (roomName.includes(_roomName)) {
                console.log("查找到房间:" + roomName);
                let urls = indexDomain + $(this).attr('data-url');
                let reg = /libid=(.*).html/i;
                //设置_libid值
                _libid = reg.exec(urls)[1];
                //爬取房间
                callUrl(urls, libRoom);
                return false
            }
            if (index == items.length - 1) {
                console.log("找不到房间！")
            }
        })
    }
    if (error) {
        console.log(error);
    }
}

function mainindex(roomName, seat, wechatSESS_ID) {
    initIndex(roomName, seat, wechatSESS_ID);
    startIndex();
}

//从具体场馆开始爬取
function init(libid, seat, wechatSESS_ID) {
    _libid = libid;
    _seat = seat;
    cookie = "wechatSESS_ID=" + wechatSESS_ID;
}

function update() {
    let urls = url + _libid + ".html"
    console.log("刷新网站:" + urls);
    callUrl(urls, libRoomUpdate);
}

function start() {
    let urls = url + _libid + ".html"
    console.log("爬取网站:" + urls);
    callUrl(urls, libRoom);
}


function main(libid, seat, wechatSESS_ID) {
    init(libid, seat, wechatSESS_ID);
    start();
}

function callUrl(url, callback) {
    request({
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.5;q=0.4",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1219.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie,
            },
            gzip: true,
            jar: j
        },
        callback
    )
}

//回调房间信息的body 维持cookie刷新 不提取js
function libRoomUpdate(error, response, body) {
    //设置cookie
    setCookie(response);
    if (error) {
        console.log(error);
    }
}

//回调房间信息的body 提取js
function libRoom(error, response, body) {
    if (body) {
        const $ = cheerio.load(body);
        const divs = $('.grid_cell')
        //爬取座位号对应的data-key
        divs.each(function (index, div) {
            let str = $(this).find('em').text();
            if (str.trim() == _seat) {
                _seat = $(this).attr('data-key');
                console.log("爬到座位date_key:" + _seat);
                return false;
            }
        })
        //index为2的script包含动态验证的信息
        const src = $('script').eq(2).attr("src");
        if (!src) {
            console.log(body);
        } else {
            //爬取获取脚本的内容
            console.log("爬取js:" + src);
            callUrl(src, libScript);
        }
    }
    if (error) {
        console.log(error);
    }
}

function libScript(error, response, body) {
    //将脚本内容作为js执行 调用reserve_seat(libid,seat)方法 方法内调用T.ajax_get
    try {
        eval(body);
    } catch (e) {
        console.log("js错误!");
    }
    if (typeof reserve_seat === 'function')
        reserve_seat(_libid, _seat);
    else {
        console.log("场馆或许关闭");
    }
}

function setCookie(response) {
    let url = response.request.href;
    let cookieString = j.getCookieString(url);
    //console.log("刷新cookie:" + new Date());
    //console.log(cookie);
    //console.log(cookieString)
    cookie = cookieString;
}

/*init(23, "71", "d4bbd20338fd912a2d55e0c8375267d2a133a9a9b4e6adba");

schedule.scheduleJob('45 0/2 * * * ? ', function () {
    update();
});
schedule.scheduleJob('55-59 59 5 * * ?', function () {
    start();
});
schedule.scheduleJob('0-30 0 6 * * ?', function () {
    start();
});

start();*/


initIndex("四楼", "71", "d4bbd20338fd912a2d55e0c8375267d2a133a9a9b4e6adba");
//定时刷新页面 防止cookie过期
schedule.scheduleJob('45 0/10 * * * ? ', function () {
    updateIndex();
});
schedule.scheduleJob('55-59 59 5 * * ?', function () {
    startIndex();
});
schedule.scheduleJob('0-30 0 6 * * ?', function () {
    startIndex();
});

startIndex();
