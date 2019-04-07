
$(function(){

initLeftScroll();
initRightScroll();
queryTopCategory();
toggleSecondCategory();
querySecondCategory();



//封装初始化左侧滚动区域的函数
function  initLeftScroll(){
    mui('.category-left  .mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
}



//封装初始化右侧滚动区域的函数
function initRightScroll(){

    mui('.category-right  .mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
}


//封装查询左侧分类列表
function queryTopCategory(){
    $.ajax({
        url:'/category/queryTopCategory',
        success:function (data) {
            console.log(data);
        //调用模板生成html
        var html = template('categoryLeftTpl',data);

        $('.category-left ul ').html(html);
            

          }
    })
}




//封装切换右侧分类列表数据

function toggleSecondCategory() {

$('.category-left ul').on('tap','li',function(){

    var id = $(this).data('id');

    querySecondCategory(id);

    $(this).addClass('active').siblings().removeClass('active');


})
}




//封装查询右侧分类列表
function querySecondCategory(id){

    $.ajax({

        url:'/category/querySecondCategory',
        data: {
            id:id
        },
        success:function (data) { 
            console.log(data);
        var html = template('categoryRightTpl',data);
            $('.category-right .mui-row').html(html);

         }
    })

}

        
})