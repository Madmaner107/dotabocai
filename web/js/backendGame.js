
var sign = false;
var killDeadAssistSign = 0;
var noticeSign = 0;

function getQuizzes(gameId, action)
{
    if(!sign)
    {
        alert('获取中，请稍后.....');
        sign = true;
        //初始化题目
        $.ajax({
            url:      '/admin/init/game/quiz',
            type:     'post',
            data:     { game_id: gameId, action: action},
            dataType: 'json',
            success:  function(response){
                if(response.code == 200)
                {
                  alert('题目更新成功');
                  $('#getInfo_'+gameId).html('<a class="btn btn-default" >获取</a>');
                }else {
                  alert(response.message);
                }
                sign = false;
            },
            error: function() {
                alert("网络出问题了");
                sign = false;
            }
        });
    }
}

function getTeamPickQuizzes(gameId)
{
    if(!sign)
    {
        alert('获取中teamPick，请稍后.....');
        sign = true;
        //初始化题目
        $.ajax({
            url:      '/admin/init/game/teamPick',
            type:     'post',
            data:     { game_id: gameId},
            dataType: 'json',
            success:  function(response){
                if(response.code == 200)
                {
                  alert('题目更新成功');
                  $('#getTeamPickInfo_'+gameId).html('<a class="btn btn-default"">获取teamPick</a>');
                }else {
                  alert(response.message);
                }
                sign = false;
            },
            error: function() {
                alert("网络出问题了");
                sign = false;
            }
        });
    }
}


function noticePartner()
{
    if(noticeSign == 1)
    {
        alert('正在通知，。。。。');
        return ;
    }
    noticeSign = 1;
    //通知合作方我们有新比赛了，比赛初始化接口
    $.ajax({
        url:      '/admin/game/init',
        type:     'get',
        data:     {},
        dataType: 'json',
        success:  function(response){
            if(response.code == 200)
            {
                alert('通知成功');
            }else{
                alert('通知失败，联系管理员');
            }
            noticeSign = 0;
        },
        error: function() {
            alert("请告知管理员");
            noticeSign = 0;
        }
    });
}

function getKillDeadAssist(type, gameId)
{
    if(killDeadAssistSign == 1)
    {
        alert('请等待上一次的结束');
    }
    killDeadAssistSign = 1;

    $.ajax({
        url:      '/admin/init/game/killDeadAssist',
        type:     'get',
        data:     {type:type, gameId:gameId },
        dataType: 'json',
        success:  function(response){
            if(response.code == 200)
            {
                alert('更新题型成功');
                if(type == 'kill')
                {
                    $('#getKill_'+gameId).html('<a class="btn btn-default"">Kill</a>');
                }else if(type == 'dead'){
                    $('#getDead_'+gameId).html('<a class="btn btn-default"">Dead</a>');
                }else if(type == 'assist'){
                    $('#getAssist_'+gameId).html('<a class="btn btn-default"">Assist</a>');
                }else{
                    $('#getHierogram_'+gameId).html('<a class="btn btn-default"">神符刷新</a>');
                }

            }else if(response.code == 405){
                alert('已更新过了');
            }else{
                alert('请联系管理员');
            }
            killDeadAssistSign = 0;
        },
        error: function() {
            alert("请告知管理员");
            killDeadAssistSign = 0;
        }
    });
}



