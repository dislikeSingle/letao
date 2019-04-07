$(function () {
    //调用搜索商品的函数
    searchProduct();

    //调用当前页面搜索商品
    nowSearchProduct();

    //调用商品排序
    sortProduct();

  
    // 定义一个搜索商品的函数
    function searchProduct() {
       
        // 1. 调用封装好的获取url参数的值的方法 传入参数名获取参数的值
        search = getQueryString('search');
        // 2. 调用公共函数去搜索商品 把当前search放到参数对象作为实参传递
        queryProduct({
            proName: search
        });
    }

    //定义一个当前页面搜索商品的函数
    function nowSearchProduct() {


        // 1.给搜索按钮添加点击事件
        $('.btn-search').on('tap', function () {

            // 2.获取当前输入内容
            var search = $('.input-search').val().trim();
            if (search == '') {
                return;
            }

            //3.调用公共函数去搜索商品 把当前search作为实参传递过去
            queryProduct({
                proName: search,
                page: 1,
                pageSize: 3
            })
        })
    }

    //封装一个函数  里面是公共请求API 渲染页面 传参 调用模板放进去
    function queryProduct(params) {
        params.page = params.page || 1,
            params.pageSize = params.pageSize || 2,
            console.log(params);

        $.ajax({
            url: '/product/queryProduct',

            data: {
                page: 1,
                pageSize: 2,
                proName: search
            },
            success: function (res) {
                console.log(res);
                console.log(res.data);
                //  调用模板指定模板id和当前后台返回的数据对象
                var html = template('productlistTpl', res);
                //  把模板渲染到页面mui-row里面
                $('.product-list .mui-row').html(html);
            }
        })

    }





    //定义一个商品排序的函数

    function sortProduct() {
        //1.给所有按钮添加点击事件   
        $('.product-list .mui-card-header a ').on('tap', function () {

            //2.获取当前的排序类型
            var type = $(this).data('type');

            //3.获取当前排序顺序
            var sort = $(this).data('sort');

            //判断需要修改sort  如果是1就变成2 是2变成1 的类名切换
            if (sort == 1) {
                sort = 2;

                //1和2转换 就是 fa-angle-down和fa-angle-up 之间的转换 
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 1;
                //如果排序是2 即将要变成1 把原来类名 fa-angle-up 变成 fa-angle-down
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            //修改完成 sort重新保存到当前元素的data-sort属性上
            $(this).data('sort', sort);
            console.log(sort);

            //切换active类名
            $(this).addClass('active').siblings().removeClass('active');

            //调用公共请求列表函数和商品函数
            var obj = {
                proName: search,
                page: 1,
                pageSize: 4
            }
            //准备参数对象给参数动态添加一个属性
            obj[type] = sort;
            console.log(obj);

            //调用公共函数查询商品列表
            queryProduct(obj);

        })

    }










    // 使用正则匹配url参数 返回这个匹配成功的值 根据参数名获取参数的值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            console.log(r);

            return decodeURI(r[2]);
        }
        return null;
    }
})


