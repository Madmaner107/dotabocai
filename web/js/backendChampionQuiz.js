
/**
 *  ajax获取题目
 *
 */
function getChampionInfo(leagueId)
{
    if(!confirm('你确定获取题目吗'))
    {
        return ;
    }

    $.ajax({
        url:      '/admin/championquiz/init?leagueId='+leagueId,
        type:     'post',
        dataType: 'json',
        success:  function(response)
        {
            if(response.status == 200)
            {
              alert('获取成功');
              location.reload();
            }else{
                alert(response.message);
            }
        },
        error: function() 
        {
            alert("异常！请联系管理员");
        }
    })
}

/**
 *
 *  ajax 修改选项赔率
 */
function updateChampionOdds(optionId)
{
    var odds = $('#championOdds_'+optionId).val();

    if(!$.trim(odds))
    {
        alert('不能为空');
        return; 
    }

    $.ajax({
        url:      '/admin/championquiz/change/odds',
        type:     'post',
        data:     { optionId: optionId, odds: odds},
        dataType: 'json',
        success:  function(response)
        {
            if(response.status == 200)
            {
              alert('修改成功');
              location.reload();
            }else{
                alert(response.message);
            }
        },
        error: function() 
        {
            alert("异常！请联系管理员");
        }
    })
}

/**
 * ajax 修改显示/隐藏选项
 *
 */
 function changeChampionQuizOptionStatus(optionId, toStatus)
 {
    if(!confirm('你确定修改吗？'))
    {
        return ;
    }

    $.ajax({
        url:      '/admin/championquiz/updateOptionStatus',
        type:     'post',
        data:     { optionId: optionId, toStatus: toStatus},
        dataType: 'json',
        success:  function(response){
            if(response.status == 200)
            {
              alert('修改成功');
              location.reload();
            }else{
                alert(response.message);
            }
        },
        error: function() {
            alert("异常！请联系管理员");
        }
    })
 }

 /**
  *
  *  冠军玩法添加战队选项
  */
  function addChampionOptions(quizId)
  {
    var team = $.trim($('.teamForOption').val());

    if(!team)
    {
        alert('请选择战队');
        return ;
    }
    
    $.ajax({
        url:      '/admin/championquiz/addOption',
        type:     'post',
        data:     { quizId: quizId, teamId: team},
        dataType: 'json',
        success:  function(response){
            if(response.status == 200)
            {
              alert('添加成功');
              location.reload();
            }else{
                alert(response.message);
            }
        },
        error: function() {
            alert("异常！请联系管理员");
        }
    })
  }
