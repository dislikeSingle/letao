$(function () {
    // 把搜索关键字作为全局变量 因为搜索关键很多函数都需要用 全局变量尽量放在最前面
    var search;
    // 默认请求第一页
    var page = 1;
    
    // 调用搜索商品的函数
    searchProduct();
    // 调用当前页面搜索商品
    nowSearchProduct();
    // 调用商品的排序
    sortProduct();
    // 调用初始化下拉刷新和上拉加载
    pullRefresh();
    // 调用跳转到商品详情的函数
    gotoDetail();

    // 定义一个搜索商品的函数
    function searchProduct() {
      
        // 1. 调用封装好的获取url参数的值的方法 传入参数名获取参数的值
        search = getQueryString('search');
        // 2. 调用公共函数去搜索商品 把当前search放到参数对象作为实参传递
        queryProduct({
            proName: search
        });
    }

    // 定义当前页面商品搜索的函数
    function nowSearchProduct() {
        // 1. 给搜索按钮添加点击事件
        $('.btn-search').on('tap', function () {
            //   2. 获取当前输入内容
            search = $('.input-search').val().trim();
            if (search == '') {
                return;
            }
            // 3. 调用公共函数去搜索商品 把当前search放到参数对象作为实参传递
            queryProduct({
                proName: search,
                page: 1,
                pageSize: 3
            });
        });
    }

    // 把公共请求API 传参 调用模板 渲染页面公共代码封装到一个函数里面 因为请求参数很多一个一个传很麻烦推荐使用对象
    // params就是参数对象 接收一个传递过来的参数对象 里面有page pageSize proName等数据
    function queryProduct(params) {
        // 把默认值在发请求之前处理好
        params.page = params.page || 1;
        params.pageSize = params.pageSize || 2;
        console.log(params);
        // 1. 使用ajax请求商品列表API
        $.ajax({
            url: '/product/queryProduct',
            
            data: params,
            success: function (res) {
                console.log(res);
                console.log(res.data);
                // 3. 调用模板指定模板id和当前后台返回的数据对象
                var html = template('productlistTpl', res);
                // 4. 把模板渲染到页面mui-row里面
                $('.product-list .mui-row').html(html);

                // 5. 每次数据刷新完成后重置上拉加载
                mui('#pullrefresh').pullRefresh().refresh(true);
                // 6. 还要重置一下page 下一次下拉又要从第一页开始
                page = 1;
            }
        })
    }

    // 商品的排序
    function sortProduct() {
       
        // 1. 给所有按钮添加点击事件
        $('.product-list .mui-card-header a').on('tap', function () {
            // 2. 获取当前排序类型
            var type = $(this).data('type');
            console.log(type);
            // 3. 获取当前的排序顺序
            var sort = $(this).data('sort');
            // console.log(sort);
            // 4. 需要修改sort
            if (sort == 1) {
                sort = 2;
                // 如果排序顺序是1 即将要变成2  把原来的类名fa-angle-down 换成fa-angle-up
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 1;
                // 如果排序是2 即将要变成1  把原来类名  fa-angle-up 换成 fa-angle-down
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            // 5. 修改完成sort重新保存到当前元素的data-sort属性上
            $(this).data('sort', sort);
            console.log(sort);
            // 6. 切换active类名
            $(this).addClass('active').siblings().removeClass('active');
            // 7. 调用公共请求商品列表函数和渲染函数
            var obj = {
                proName: search,
                page: 1,
                pageSize: 4
            }
            // obj[key] = value 给对象添加一个动态的属性和值
            // 8. 准备参数对象给参数动态添加一个属性
            obj[type] = sort;
            console.log(obj);
            // 9. 调用公共函数去查询商品列表
            queryProduct(obj);
        });
    }

    function pullRefresh() {
        mui.init({
            pullRefresh: {
                container: '.mui-scroll-wrapper',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                console.log('触发了下拉');
                // 1. 调用查询刷新数据
                queryProduct({
                    proName: search,
                    page: 1,
                    pageSize: 3
                });
                // 2. 结束下拉刷新的转圈圈
               
            }, 1500);
        }

        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                // 1. 上拉请求下一页数据 page++
                page++;
                console.log(page);
                // 2. 请求下一页数据
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        page: page,
                        pageSize: 2,
                        proName: search
                    },
                    success: function (res) {
                        console.log(res);
                        console.log(res.data);
                        if (res.data.length > 0) {
                            // 3. 调用模板指定模板id和当前后台返回的数据对象
                            var html = template('productlistTpl', res);
                            // 4. 把模板渲染到页面mui-row里面 追加渲染使用append
                            $('.product-list .mui-row').append(html);
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }

                    }
                })
            }, 1500);

        }
    }

    // 跳转到商品详情
    function gotoDetail() {
        // 1. 给立即购买按钮添加点击事件 动态添加按钮使用委托方式添加
        $('.product-list').on('tap', '.product-buy', function () {
            //   2. 获取当前的按钮的身上商品id
            var id = $(this).data('id');
            console.log(id);
            // 3. 跳转到商品详情并且把id传过去
            location = 'detail.html?id=' + id;
        });
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