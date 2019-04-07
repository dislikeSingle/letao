$(function () {

addHistory();
queryHistory();
deleteHistory();
clearHistory();
   // 初始化区域滚动
   mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
//添加记录的函数    
function  addHistory() { 
//添加记录的思想  获取
/* 1.数据存储在localStorage 里面 需要永久删除,除非手动删除
2.点击搜索的时候获取输入关键字
3.把这个关键字添加到本地存储localStorage
4.以数组的方式添加(可能会有很多记录) */

 //1.获取搜索的按钮 添加点击事件
 $


$('.btn-search').on('tap',function(){

    var search = $('.input-search').val().trim();

    if(search == ''){
        return;
    }


    var arr = [];

    for(var i= 0;i<arr.length;i++){
        console.log(i);
        if(arr[i] == search){
            
        }
        
    }
})




 }

//查询记录的函数
function  queryHistory() {  }

//删除记录的函数
function  deleteHistory() {  }


//清空记录的函数
function  clearHistory() {  }

  })