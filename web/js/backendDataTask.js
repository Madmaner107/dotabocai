

/**
 * 今日统计
 */
function todayCount(type)
{
$.ajax({
    url:      '/admin/dataTask/createByAjax',
    type:     'post',
    data:     { type: type },
    dataType: 'json',
    success:  function(response){ 
        if(response.code == 200)
        {
          location.reload();
        }else{
            alert(response.message); 
        }
    },
    error: function() {      
        alert("异常！请联系管理员");    
    }
});
}