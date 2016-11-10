var app={};

app.scrollTextUp = function (target, config) {
    var $target = $(target);
    var setting = {};
    setting.contair = config.contair || 'ul';
    setting.inner = config.inner || 'li';
    setting.time = config.time || 1000;
    setting.number = config.number || 1;
    setting.delay=config.delay||2000;

    var $scroll = $target.find(setting.contair);
    var item_height = parseInt($scroll.find(setting.inner)[0].offsetHeight);
    var item_number = $scroll.find(setting.inner).length;
    var scroll_height = item_height * setting.number;
    var sum_height = item_height * item_number;
    var contair_height = $target.height();
    // console.log(item_number+'+'+item_height+'+'+scroll_height+'+'+contair_height)

    setInterval(function () {
        var now_top = parseInt($scroll.css('top'));
        var now_bottom = -(sum_height - contair_height);
        if (now_top > now_bottom) {
            $scroll.animate({'top': now_top - scroll_height + 'px'}, setting.time);
        } else {
            $scroll.animate({'top': '0px'}, setting.time);
        }
    }, setting.delay);
};

app.clickScroll=function ($dom,number) {
    var length=$dom.width();
    var div_length=$dom.parent().width();
    var dom_left=parseInt($dom.css('left'));
    var max_left=length-div_length;
    // console.log('length:'+length+'|div_length:'+div_length+'|dom_left:'+dom_left+'|max_left:'+max_left);
    if(number<0){
        if(-dom_left<max_left){
            $dom.animate({'left':(dom_left+number)+'px'},300);
        }
    }else{
        if(dom_left<0){
            $dom.animate({'left':(dom_left+number)+'px'},300);
        }
    }
};

app.scrollFixed = function (abs_top,fix_top) {
    var scroll_height = window.scrollY||window.pageYOffset;
    var aside_dom = document.querySelector('aside');
    if (scroll_height > abs_top) {
        if (!(aside_dom.style.position == "fixed")) {
            aside_dom.style.position = "fixed";
            aside_dom.style.top = fix_top+"px";
        }
    } else {
        if (!(aside_dom.style.position == "absolute")) {
            aside_dom.style.position = "absolute";
            aside_dom.style.top = (fix_top+abs_top)+"px";
        }
    }
};

app.watchScroll = function (query) {
    var h1_list = document.querySelectorAll(query);
    var scroll_now = window.scrollY || window.pageYOffset;
    var window_height = window.innerHeight;
    for (var i = 0; i < h1_list.length; i++) {
        var h1_top = h1_list[i].offsetTop;
        var id_now = h1_list[i].id;
        if (h1_top >= scroll_now && h1_top <= (scroll_now + window_height)) {
            for (var j = h1_list.length - 1; j >= 0; j--) {
                document.querySelector('#' + h1_list[j].id + '-dot').className = "";
            }
            document.querySelector('#' + id_now + '-dot').className = "active";
            break;
        }
    }
};

app.scrollTo=function (query) {
    var target=document.querySelector(query);
    var target_top=target.offsetTop;
    var now_top=window.scrollY||window.pageYOffset;
    var scroll=target_top-now_top;
    var sum_height=document.documentElement.scrollHeight;
    var client_height=document.documentElement.clientHeight;
    console.log(target_top+';'+now_top+';'+scroll);
    var i=setInterval(function () {
        var now_scroll=window.scrollY||window.pageYOffset;
        if(scroll>0&&window.scrollY>=target_top||(now_scroll+client_height==sum_height)){
            clearInterval(i);
        }
        if(scroll<=0&&window.scrollY<=target_top){
            clearInterval(i);
        }
        window.scrollBy(0,scroll/60);
    },1000/60);
};
