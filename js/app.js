var app={};
app.scrollTextUp = function (target, config) {
    var $target = $(target);
    var setting = {};
    setting.contair = config.contair || 'ul';
    setting.inner = config.inner || 'li';
    setting.times = config.times || 1000;
    setting.number = config.number || 1;

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
            $scroll.animate({'top': now_top - scroll_height + 'px'}, 1000);
        } else {
            $scroll.animate({'top': '0px'}, 1000);
        }
    }, setting.times);
};
