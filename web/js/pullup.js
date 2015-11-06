var scrollDownRefresh = function(id, droploadId, url, type) {
    var currentPage = 1,
    prev = currentPage-1, next = currentPage+1,
    pullUpEle = $('#pullup'),
    pullDownEle = $('#pulldown'),
    options = {
        bounce:true,//边界反弹
        scrollbars: false,//有滚动条
        momentum: true,// 允许有惯性滑动
        click: true ,// 允许点击事件
        pullUpToRefresh: false
    };
    pullUpEle.hide();
    var pulldownAction = function(){
        return false;
    };
    var pullupAction = function(){
        
        var nextUrl = url+'?page='+next;
        if(type && type == 'lolHeroList')
        {
            nextUrl = url+'&page='+next;
        }

        $.get(nextUrl, function(data) {
            if(data) {
                $(droploadId).eq(0).append(data);
                next++;;
            }
            pullUpEle.hide();
            iscrollObj.refresh();
        });
    };
    var iscrollObj = iscrollAssist.newVerScrollForPull($(id),pulldownAction,pullupAction, options);
    iscrollObj.refresh();
}
