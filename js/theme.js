$(function(){
    $('.section1 ul').masonry({
        // options
        columnWidth: true,
        itemSelector: ".section1 li",
        isResizeBound: false,
        isAnimated: true
    });

    $(".right-nav li").click(function(){
        $(".right-nav li").removeClass("on");
        $(this).addClass('on');
        var index = $(this).index();
        //$("body,html").stop().animate({scrollTop:$(".group ul:eq("+index+")").offset().top},500,'swing');
    });

    var right_nav = new scrollNav();
    right_nav.init();
    /*var topArr = [];
    for(var i =0;i<$(".group ul").length;i++){
        topArr.push($(".group ul").eq(i).offset().top);
    }*/

    /*$(window).scroll(function(){
        var h = $(".right-nav").height(),
            wh = $(window).height(),
            st = $(window).scrollTop(),
            gt = $(".group").offset().top;
        if(st > gt){
            $(".right-nav").stop().animate({top:st+Math.floor((wh-h)/2)},700,'swing');
        }else{
            $(".right-nav").stop().animate({top:340},700,'swing');
        }
    });*/

    var Slider = function(){
        var sildnum = $(".J_ui_postFloat > li").length,ison;
        if(sildnum == 1){
            $(".J_ui_butPost_a,.J_ui_butPost_b").hide();
            return false;
        }
        for(var i = 0;i < sildnum;i++){
            if(i == 0) ison = "on"
            else ison = "";
            $(".J_ui_a").append('<li class='+ison+'></li>');
        }
        $(".J_ui_picSwitch").slide({
            css: {"width": 1080, "height": 320},
            config: {
                "time": 5000,
                "type": "left",
                "speed": 600,
                "button": true,
                "butArr": ".J_ui_picSwitch .J_ui_a li"
            },
            completes: function (o) {//初始化完成执行动作
            }
        });
    };
    Slider();

});
function scrollNav(opt){
    this.defaults = {
        wrap: ".group",
        grid:".group ul",
        scrollobj:".right-nav",
        linkobj:".right-nav li",
        backtotop:".backtoTop"
    };
    $.extend(this.defaults,opt);
    this.gridHeight = $(this.defaults.grid).height();
    this.gridArea = [];
};
scrollNav.prototype={
    init:function(){
        var t = this;
        t.moveto();
        t.scrollHandle();
        t.backtotop();
        t.pushArea();
        $(window).scroll(function(event){
            t.scrollHandle();
        });
        $(window).resize(function(event) {
            t.scrollHandle();
        });
        t.Anchorposition("down");
        t.scroll(function(direction){
            t.Anchorposition(direction)
        });
    },
    scrollHandle:function(){
        var t = this;
        var st = parseInt($(t.defaults.wrap).offset().top),
            ws = parseInt($(window).scrollTop()),
            right= parseInt($(window).width()-($(t.defaults.wrap).offset().left+$(t.defaults.wrap).width()+$(t.defaults.scrollobj).width()+30));
        if(ws > st){
            $(t.defaults.scrollobj).css({"position":"fixed","right":right,top:"100px"});
        }else{
            $(t.defaults.scrollobj).css({"position":"absolute","right":"-90px",top:"340px"});
        }
    },
    pushArea:function(){
        var t = this;
        $(t.defaults.grid).each(function(){
            t.gridArea.push($(this).offset().top);
        });
    },
    Anchorposition:function(arrow){
        var t = this,
            wh = $(window).height(),
            ws = arrow == "up" || Math.round(wh-t.gridHeight) <= 0 ? parseInt($(window).scrollTop()+340) : parseInt($(window).scrollTop()) + Math.round((wh-t.gridHeight)/2+20);

        for(var i=0;i<t.gridArea.length;i++){
            if(i == t.gridArea.length-1 && ws >= parseInt(t.gridArea[i])){
                $(t.defaults.linkobj).eq(i).addClass('on');
                return false
            }
            if(ws >= parseInt(t.gridArea[i]) && ws < parseInt(t.gridArea[i+1])){
                $(t.defaults.linkobj).eq(i).addClass('on');
            }else{
                $(t.defaults.linkobj).eq(i).removeClass('on');
            }
        }
    },
    scroll:function(fn){
        var beforeScrollTop = $(window).scrollTop(),
            fn = fn || function() {};
        $(window).scroll(function(){
            var afterScrollTop = $(window).scrollTop(),
                delta = afterScrollTop - beforeScrollTop;
            if( delta === 0 ) return false;
            fn( delta > 0 ? "down" : "up" );
            beforeScrollTop = afterScrollTop;
        });
    },
    moveto:function(){
        var t = this;
        $(t.defaults.linkobj).click(function(){
            var index = $(this).index(),
                ot = $(t.defaults.grid).eq(index).offset().top;
            $("body,html").animate({scrollTop:ot},600,"swing");
        })
    },
    backtotop:function(){
        var t = this;
        $(t.defaults.backtotop).click(function(){
            $("body,html").animate({scrollTop:"0px"},600,"swing")
        })
    }
};
!(function($){
    var picScroll = function () {
        var arg = arguments,
            defaults = {// css{盒子的宽高};config{每次滑动/淡进淡出间隔时间time、滑动类型("top/left/fade")、滑动/淡进淡出的速度speed、是否加载左右按钮button}。注：如不自定义参数则采用默认值
                css: {"width": 490, "height": 170},
                config: {
                    "time": 3000,
                    "type": "fade",
                    "speed": 600,
                    "button": true,
                    "butArr": ".J_ui_picSwitch .J_ui_a li"
                },
                before: function (data) {//图片切换前执行动作
                },
                after: function (data) {//图片切换完成执行动作
                }
            };
        return this.each(function () {
            var $this = $(this),
                $$ = function (a) {
                    return $this.find(a)
                },
                animates = {
                    list: 0,//当前第几张
                    options: ["top", "left", "fade"],//动画类型
                    animated: false,
                    init: function () {
                        this.arrays = [];//预留参数位置以备用
                        this.arrays[0] = $.extend(true, {}, defaults, arguments[0] || {});//合并自定义参数和默认参数
                        this.ul = $$(".J_ui_post");
                        this.li = $$(".J_ui_post li");
                        this.but = this.arrays[0].config.butArr;
                        if (this.options.indexOf(this.arrays[0].config.type) !== -1) {//参数是否正确
                            for (var i = 0; i < this.arrays.length; i++) {//循环 保存参数值
                                switch (typeof this.arrays[i]) {
                                    case 'object':
                                        $this.css(this.arrays[i].css);
                                        this.li.css(this.arrays[i].css)
                                        this.returnBefore = this.arrays[i].before;
                                        this.returnAfter = this.arrays[i].after;
                                        break;
                                    default:
                                }
                            }
                            this.config("move");//配置开始
                            this.bindFun();//绑定方法
                            if (this.arrays[0].completes) {
                                this.arrays[0].completes($this);
                            }
                        } else {//如果参数不正确抛出错误
                            $.error = console.error;
                            $.error("参数格式不正确！");
                        }
                    },
                    config: function (str) {
                        var that = this, i = 0, butArr = that.but.split(","),
                            con = that.arrays[0].config,
                            arr = (con.type == "top" ? ["top"] : ["left"]);
                        if (con.type == "left" || con.type == "top") {//动画类型判断
                            if (con.type == "left") {
                                that.ul.addClass("J_ui_postFloat");
                                that.ul.width($this.width() * that.li.length);//计算图片列表总宽度
                            }
                            if (that.list == that.li.length) {//如果当前图片是第一张从最后循环
                                con.type == "top" ? that.li.first().css(arr[0], that.ul.height()) : that.li.first().css(arr[0], that.ul.width());//给第一张图片的position: relative;赋值以达到无限循环效果
                                that.callback = function () {//滚动完成后的回调函数  给position: relative;值还原为0 同时当前图片的位置是0
                                    that.li.first().css(arr[0], 0);
                                    that.ul.css(arr[0], 0);
                                    that.list = 0;
                                }
                            }
                            if (that.list == -1) {//如果当前图片是最后一张从第一张循环
                                con.type == "top" ? that.li.last().css(arr[0], -that.ul.height()) : that.li.last().css(arr[0], -that.ul.width());//给最后张图片的position: relative;赋值以达到无限循环效果
                                that.callback = function () {//滚动完成后的回调函数
                                    that.list = that.li.length - 1;
                                    that.li.last().css(arr[0], 0);
                                    con.type == "top" ? that.ul.css(arr[0], -parseInt($this.height()) * that.list) : that.ul.css(arr[0], -parseInt($this.width()) * that.list);
                                }
                            }
                            that.scrollA();//配置完成开始滚动
                        } else if (con.type == "fade") {//如果滚动类型为fade
                            if (!that.ul.hasClass("J_ui_postPost")) {
                                that.ul.addClass("J_ui_postPost")
                            }
                            if (that.list == that.li.length) {//如果为最后一张图
                                that.list = 0;
                            }
                            that.fadeFun();//开始淡进淡出动画
                        }

                        for (; i < butArr.length; i++) {
                            $(butArr[i]).eq(that.list == that.li.length ? 0 : that.list).siblings().removeClass("on");//按钮样式变化
                            $(butArr[i]).eq(that.list == that.li.length ? 0 : that.list).addClass("on");//按钮样式变化
                        }
                    },
                    scrollA: function () {//滚动动画
                        this.animated = true;
                        var that = this, textCss,
                            con = that.arrays[0].config;//动画滚动参数获取
                        clearTimeout(that.t);//清除上一次的排队动画
                        that.rerurnFun(0);//滚动开始回调
                        con.type == "top" ? textCss = {"top": -parseInt($this.height()) * that.list} : textCss = {"left": -parseInt($this.width()) * that.list};//获取滚动值
                        that.ul.stop(true).textAnimation({
                            "css": textCss, "config": con, callback: function () {
                                if (that.callback) {//内部回调函数
                                    that.callback();
                                    that.callback = null;
                                }
                                that.animated = false;
                                that.rerurnFun(1);//滚动结束回调
                            }
                        });
                        that.setTime();//循环滚动
                    },
                    fadeFun: function () {//淡进淡出动画
                        var that = this;
                        clearTimeout(that.t);//清除上一次的排队动画
                        that.rerurnFun(0);//动画开始回调
                        that.li.css('opacity', 1)
                        that.li.eq(that.list).siblings().stop(true).fadeOut(that.arrays[0].config.speed);
                        that.li.eq(that.list).fadeIn(that.arrays[0].config.speed, function () {
                            that.rerurnFun(1);//动画结束回调
                        });
                        that.setTime();//循环动画
                    },
                    bindFun: function () {//绑定各种事件
                        var that = this;
                        $(that.but).hover(function () {
                            that.list = $(this).index();
                            that.config("stop");
                            clearTimeout(that.t);
                        }, function () {
                            that.setTime();
                        });

                        that.li.hover(function () {
                            clearTimeout(that.t);
                        }, function () {
                            that.setTime();
                        });

                        if (that.arrays[0].config.button) {
                            $$(".J_ui_butPost_a").click(function () {
                                if (that.animated) {
                                    return false;
                                } else {
                                    that.list -= 1;
                                    that.config("move");
                                }
                            });
                            $$(".J_ui_butPost_b").click(function () {
                                if (that.animated) {
                                    return false;
                                } else {
                                    that.list += 1;
                                    that.config("move");
                                }
                            });
                        } else {
                            $$(".J_ui_butPost_b").remove();
                            $$(".J_ui_butPost_a").remove();
                        }
                    },
                    rerurnFun: function (num) {//判断回调
                        if (num) {
                            !!this.returnAfter && this.returnAfter(this.list == this.li.length ? 0 : this.list);
                        } else {
                            !!this.returnBefore && this.returnBefore(this.list == this.li.length ? 0 : this.list);
                        }
                    },
                    setTime: function () {//循环动画
                        var that = this;
                        that.t = setTimeout(function () {
                            that.list += 1;
                            that.config("move");
                        }, that.arrays[0].config.time);
                    }
                }
            animates.init.apply(animates, arg);
        });
    };
    var defaults = {css: {"top": 0}, config: {speed: 800, easing: "swing", time: 0}};
    var textAnimation = function (a) {
        return this.each(function () {
            var $this = $(this),
                settings = $.extend(true, {}, defaults, a);
            $this.animate(settings.css, settings.config.speed, settings.config.easing, function () {
                !!settings.callback && settings.callback();
            });
        })
    };
    $.fn.extend({
        textAnimation:textAnimation,
        slide:picScroll
    });
})(jQuery);