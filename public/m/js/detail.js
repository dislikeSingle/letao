import { template } from "handlebars";


$(function () {


    //调用查询商品详情函数
    queryProductDetail();


    function queryProductDetail() {
        var id = getQueryString('id');
        console.log('id');

        //根据id去请求数据
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            succcess: function (data) {
                console.log(data);

                var min = data.size.split('-')[0];
                var max = data.size.split('-')[1];
                //  定义一个新的尺码数组 把每一个加进去   
                data.size = [];
                for (var i = min; i <= max; i++) {
                    //把每一i的值添加到数组中去
                    data.size.push(i);
                }
                console.log(data.size);
                var html = template('productDetailTpl', data);
                $('#main').html(html);
                //mui组件是ajax动态添加一开始没有没初始化 等渲染完成后再手动初始化
                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
                });
                //初始化动态框 (这是组件动态生成的 需要手动初始化)
                mui(".mui-numbox" ).numbox();
                
            }

        })
    }










    // 使用正则匹配url参数 返回这个匹配成功的值 根据参数名获取参数的值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            console.log(r);
            // 别人之前使用unescape 方式解密  但是我们默认是encodeURI加密 使用 decodeURI 解密
            return decodeURI(r[2]);
        }
        return null;
    }
})