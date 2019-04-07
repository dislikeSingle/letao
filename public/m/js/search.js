
$(function () {
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    // 初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 添加记录的函数
    function addHistory() {
       
        
        // 1. 获取搜索的按钮添加点击事件
        $('.btn-search').on('tap', function () {
            // 2. 获取当前的搜索记录 获取当前输入输入的文字通过val方法 空格要排除掉 空格不合法的输入
            var search = $('.input-search').val().trim();
            // 3. 做非空判断 
            if (search == '') {
                // 如果不输入直接return什么都不做
                return;
            }
           
            var arr = getHistoryData();
            // // 4.1 创建一个空数组
            // var arr = [];
            // // 数组之前有重复调用一个去重函数把数组先进行去重
            arr = uniq(arr);
            // 4.2 判断当前的值是否在数组中存在
            for (var i = 0; i < arr.length; i++) {
                console.log(i);
                // 判断当前数组的值 和 搜索的值一致
                if (arr[i] == search) {
                    // 把当前arr[i] 从 arr数组给删掉
                    // splice函数是把数组中的中删掉（因为这个值重复的我要删掉） 第一个参数是要删除元素的索引 第二个参数是删除的个数
                    arr.splice(i, 1);
                    // 如果数组中值删掉一个 循环就会少一次 i-- i变小了循环还会继续
                    i--;
                }
            }
            // 4.3 把新输入的值加到arr里面 往后加就是push 往前就是unshift
            arr.unshift(search);
            console.log(arr);
            // 4.4 把arr数组存储到 localStorage中 转成字符串再存储进去
            // console.log(JSON.stringify(arr));
            // localStorage.setItem 本地存储的存值方法 第一个参数指定存储的键 第二个参数存储的值
            // 使用封装好的函数去设置本地存储的数据
            setHistoryData(arr);
            // 6. 搜索完成后清空输入框 
            $('.input-search').val('');
            // 7. 添加完成调用一下查询添加完成马上查询渲染列表
            queryHistory();
          
            location = 'productlist.html?search='+search+"&time="+new Date().getTime()+"&rsv_pq=fsdfdsf1231231";
        });
    }

    // 查询记录的函数
    function queryHistory() {
        // 1. 把之前数据取出来         
        // 2. 获取本地存储的数组 使用封装这个函数去获取本地存储的数组
        var arr = getHistoryData();
        console.log(arr);
        // 3. 再使用模板引擎渲染到页面上 因为现在的arr是一个数组 模板引擎要求对象 一定包装到对象里面
        var html = template('historyTpl', {
            rows: arr
        });
        // 4. 把模板渲染到ul里面
        $('.search-history ul').html(html);
    }
    // 删除记录的函数
    function deleteHistory() {
       
        // 1. 使用委托方式添加事件
        $('.search-history ul').on('tap', 'li .btn-delete', function () {
            // 2. 通过当前删除按钮data去获取data-index属性的值
            var index = $(this).data('index');
            console.log(index);
            // 3. 获取本地存储的数组 使用封装这个函数去获取本地存储的数组 还得接收返回值
            var arr = getHistoryData();
            console.log(arr);
            // 4. 把数组中当前index索引的元素删掉
            arr.splice(index, 1);
            console.log(arr);
            // 5. 删除成功要要存储到本地存储中  使用封装好的函数去设置本地存储的数据
            setHistoryData(arr);
            // 6. 删除完成并且存储更新了之后重新渲染
            queryHistory();
        });
    }
    // 清空记录的函数
    function clearHistory() {
       
        $('.btn-clear').on('tap', function () {
            // localStorage.clear();// 把所有存储数据删掉不推荐使用
            // 使用localStorage 删掉当前的searchHistory的键和值
            localStorage.removeItem('searchHistory');
            queryHistory();
        });
    }
    // 定义封装的函数 获取记录的数据 获取本地存储的数据并且把获取到数据返回回去
    function getHistoryData() {
        var arr = localStorage.getItem('searchHistory');
        // 3.1 判断当前本地存储中有没有数据 == null 表示没有数据
        if (arr == null) {
            // 3.2 只需要把arr赋值为空数组
            arr = [];
        } else {
            // 3.3 如果之前有数据 把字符串转成数组
            arr = JSON.parse(arr);
        }
        return arr;
    }
    // 定义封装的函数 设置历史记录的数据 设置本地存储 你要设置数据
    function setHistoryData(arr) {
        localStorage.setItem('searchHistory', JSON.stringify(arr));
    }
    // 数组去重的函数
    function uniq(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});