var positionX = 0;
var time_now_server;
var time_now_client;
var time_end;
var time_server_client;
var timerID;
var timerReload;
var issue;
var isRolling = false;
var heros =  [
            "暗夜魔王","矮人直升机","暗影恶魔","艾欧","编织者","暗影萨满","蝙蝠骑士","半人马战行者","不朽尸王","变体精灵","潮汐猎人","沉默术士","戴泽","陈","斧王",
            "大地之灵","寒冬飞龙","德鲁伊","黑暗贤者","敌法师","幻影刺客","发条技师","混沌骑士","伐木机","祸乱之源","风暴之灵","剧毒术士","风行者","克林克兹","凤凰",
            "恐怖利刃","复仇之魂","拉席克","干扰者","莱恩","钢背兽","狼人","工程师","裂魂人","光之守卫","马格纳斯","哈斯卡","美杜莎","撼地者","谜团",
            "幻影长矛手","米波","灰烬之灵","冥魂大帝","杰奇洛","冥界亚龙","酒仙","末日使者","狙击手","殁境神蚀者","巨魔战将","帕格纳","巨牙海民","帕吉","军团指挥官",
            "祈求者","昆卡","沙王","拉比克","嗜血狂魔","力丸","噬魂鬼","莉娜","术士","炼金术士","司夜刺客","龙骑士","斯拉达","露娜","斯拉克",
            "魅惑魔女","死亡先知","米拉娜","剃刀","娜迦海妖","痛苦女王","帕克","维萨吉","全能骑士","瘟疫法师","赏金猎人","巫妖","上古巨神","巫医","神谕者",
            "虚空假面","圣堂刺客","亚巴顿","食人魔魔法师","影魔","兽王","幽鬼","树精卫士","育母蜘蛛","水晶室女","远古冰魄","斯温","肉山","天怒法师","先知",
            "小小","熊战士","修补匠","宙斯","主宰","卓尔游侠"
            ];
$(document).ready(function (){
  addEventForRouletteOption();

  if($('#game-list').length > 0)
  {
    //比赛列表页面倒计时
    getCountDownTime();
  }else{
    //轮盘内页，倒计时，转盘
    //flashMessage('刀塔猜最新活动时间：00:00-24:00', 'warning');
    rollOrNot();
    getCountDownTime();
    syncServerTime();
  }
});

function roll(speed, to, duration)
{
  var position = $('#roulette-roll').css('backgroundPosition').split(' ')[0];
  position = parseInt(position.replace("px",""))

  var round = Math.floor(Math.abs(position) / 4995);
  var realPosition = position + round * 4995;

  var heroIndex = Math.abs(realPosition/45);

  // var resultPosition = $('.roulette-result:first').position();
  // 45是每个头像的宽度，position/45是根据头像宽度计算出来的头像的位置，
  // 每个头像中间有个0.5像素宽度的边框，position/45是边框的数量
  // 头像的总宽度 + 边框的宽度就是头像的位置
  var bp = (realPosition/45 * 80 + realPosition/45 * .5);

  if (!$.isNumeric(to))
  {
    to = $('#roulette-r').val() ? $('#roulette-r').val() : null;

    if (to != null && isRolling)
    {
      var remainingTime = +$('#dateTimeInfo').data('remaining-time') * 1000;

      if (Math.abs(realPosition) >= Math.abs(to * 45))
      {
        duration = +remainingTime/(111 - Math.abs(+realPosition)/45 + +to);
      }
      else
      {
        duration = +remainingTime/(+to - Math.abs(+realPosition)/45);
      }

      console.log('realPosition ' + realPosition + ' remainingTime ' + remainingTime + ' to ' + to + ' duration ' + duration);
    }
  }

  if (to !== null && !isRolling)
  {
    $('#roulette-roll').css('background-position', -(to * 45) + 'px center');
    position = $('#roulette-roll').css('backgroundPosition').split(' ')[0];
    position = parseInt(position.replace("px",""))

    round = Math.floor(Math.abs(position) / 4995);
    realPosition = position + round * 4995;

    heroIndex = Math.abs(realPosition/45);
    bp = (realPosition/45 * 80 + realPosition/45 * .5);

    $('.badage-hero').show();
  }

  $('.roulette-result').css('background-position',  bp + 'px center');
  $('#hero-info').text(heros[heroIndex]);
  $('#hero-info').removeClass('roshan nightmare tianhui');

  if (heroIndex >= 103)
  {
    $('#hero-info').addClass('tianhui');
  }
  else if (heroIndex == 102)
  {
    $('#hero-info').addClass('roshan');
  }
  else if (heroIndex % 2 == 0)
  {
    $('#hero-info').addClass('nightmare');
  }
  else
  {
    $('#hero-info').addClass('tianhui');
  }

  if (!isRolling && $.isNumeric($('#roulette-r').val()))
  {
    return;
  }

  isRolling = true;

  if (to != null && Math.abs(realPosition) == Math.abs(to * 45) && +$('#dateTimeInfo').data('remaining-time') == 0)
  {
    $('#roulette-roll').css('background-position', -(to * 45) + 'px center');
    $('.badage-hero').show();

    $('#roulette-roll').stop();
    isRolling = false;

    return;
  }

  $('#roulette-roll').animate(
    {
      'background-position-x': '-=' + speed + 'px'
    },
    duration,
    'linear',
    function () {
      roll(speed, to, duration);
    });
}

function stopRoll()
{
  $('#roulette-roll').stop();
}

function rollOrNot()
{
  $.ajax({
      url:      '/get/roulette/currAnswer?getAnswerAtLastMin=1',
      type:     'get',
      dataType: 'json',
      success: function(response)
      {
          if(response.code == 200 && response.heroId)
          {
            roll(45, response.heroId, 200);
          }else{
            roll(45, null, 200);
          }
      },
      error: function(){
        roll(45, null, 200);
      }
  });
}

//获取答案
function getTheAnswer()
{
  if($.isNumeric($('#roulette-r').val()))
  {
    return;
  }

  //提交竞猜
  $.ajax({
      url:      '/get/roulette/currAnswer',
      type:     'post',
      dataType: 'json',
      success: function(response)
      {
          if(response.code == 200)
          {
            $('#roulette-r').val(response.heroId);
          }
      }
  });
}

//获取倒计时
function getCountDownTime()
{
  //提交竞猜
      $.ajax({
          url:      '/get/countDown/time',
          type:     'post',
          dataType: 'json',
          success: function(response)
          {
              if(response.code == 200)
              {
                GetRTime(response.data.endTime, response.data.nowTime, response.data.issue);
              }
          },
          error: function(){ }
      });
}

function GetRTime(endTime, startTime, issueInfo)
{
  time_end=new Date(endTime);//结束的时间
  time_end=time_end.getTime();
  time_now_server=new Date(startTime);//开始的时间
  time_now_server=time_now_server.getTime();
  time_now_client=new Date();
  time_now_client=time_now_client.getTime();
  time_server_client=time_now_server-time_now_client;
  issue = issueInfo;
  timerID = setTimeout("show_time()",1000);
}

function show_time()
{
  var time_now,time_distance,str_time;
  var int_day,int_hour,int_minute,int_second;
  var time_now = new Date();
  time_now     = time_now.getTime()+time_server_client;
  time_distance= time_end-time_now;
  if(time_distance>0)
  {
    int_day = Math.floor(time_distance/86400000)
    time_distance-=int_day*86400000;
    int_hour= Math.floor(time_distance/3600000)
    time_distance-=int_hour*3600000;
    int_minute = Math.floor(time_distance/60000)
    time_distance-=int_minute*60000;
    int_second = Math.floor(time_distance/1000)
    if(int_hour < 10)
    int_hour = "0"+int_hour;
    if(int_minute < 10)
    int_minute = "0"+int_minute;
    if(int_second < 10)
    int_second = "0"+int_second;
    str_time = "距离第"+issue+"期开奖还有  "+int_minute+"分钟"+int_second+"秒";

    $('#dateTimeInfo').html(str_time);
    //将剩余的秒杀写进一个字段
    var restSec = int_minute*60+int_second;
    $('#dateTimeInfo').data('remaining-time', restSec);
    timerID = setTimeout("show_time()",1000);
    if(restSec <= 60)
    {
      $('#dateTimeInfo').html('本期竞猜正在开奖中，已停止投注');
    }
    if(restSec <= 30)
    {
      getTheAnswer();
    }
    if(restSec == 0)
    {
      $('#dateTimeInfo').html('下一期竞猜正在准备中，请稍候');
    }
  }else{
    clearTimeout(timerID);
    timerReload = setTimeout("reloadCurrentPage()",1000*60);
  }
}

function reloadCurrentPage()
{
  window.location.reload();
  clearTimeout(timerReload);
}

function syncServerTime()
{
  $.ajax({
    url: $('#server-time').data('url'),
    type: 'post',
    dataType: 'json',
    success: function (response)
    {
      if (response.status.code == 200)
      {
        $('#server-time').val(response.data);
      }
    }
  });

  setInterval('syncServerTime', 30000);
}

function nowTime()
{
  return new Date(+$('#server-time').val() * 1000);
}

// 获取去掉时区影响的时间
function getNowHours()
{
  var now = nowTime();

  var timezone = now.getTimezoneOffset()/60;
  var timezoneDiff = 0;

  if (timezone > 0)
  {
    timezoneDiff = 8 + timezone;
  }
  else
  {
    timezoneDiff = 8 - Math.abs(timezone);
  }

  var nowHours = now.getHours() + timezoneDiff;

  if (timezoneDiff > 0)
  {
    if (nowHours >= 24)
    {
      nowHours -= 24;
    }
  }
  else
  {
    if (nowHours < 0)
    {
      nowHours += 24;
    }
  }

  return nowHours;
}

function isOpenHour()
{
  var nowHours = getNowHours();

  return nowHours >= 9 && nowHours < 21;
}

function isStoppedAcceptingBets()
{
  var countDown = +$('#dateTimeInfo').data('remaining-time');

  return countDown > 0 && countDown < 60;
}

function isBetNotStarted()
{
  var countDown = $('#dateTimeInfo').data('remaining-time');

  return countDown != '' && +countDown == 0;
}

function isBetOpen()
{
  // if (+$('#server-time').val() && !isOpenHour())
  // {
  //   var nowHours = getNowHours();

  //   if (+nowHours >= 21 && +nowHours <= 23)
  //   {
  //     quizErrorAlert('今日竞猜已结束（活动时间：09:00-21:00）');
  //   }
  //   else
  //   {
  //     quizErrorAlert('今日竞猜未开始（活动时间：09:00-21:00）');
  //   }

  //   return false;
  // }

  if ($('#dateTimeInfo').data('remaining-time') != '')
  {
    if (isStoppedAcceptingBets())
    {
      quizErrorAlert('本期竞猜正在开奖中，已停止投注');

      return false;
    }

    if (isBetNotStarted())
    {
      quizErrorAlert('下一期竞猜正在准备中，请稍候');

      return false;
    }
  }

  return true;
}

function addEventForRouletteOption()
{
  $('.roulette-option').click(function (e){
    e.preventDefault();

    if (!isBetOpen())
    {
      return;
    }

    var optionName = $('#option-' + $(this).data('option-id')).html();
    var subject = $($(this).data('subject')).html();
  	var template = render($('#modal-template').html(), { subject: subject,
                                                        option: optionName + '(' + $(this).data('odds') + ')',
                                                        balance: $('#user-current-amount').val() });

  	$('#modal-backdrop').after(template);
  	$('#modal-backdrop').show();

  	addEventForCloseBtn();
  	observer($(this).data('odds'));

  	addEventForEntertainmentQuizSubmit($(this).data('quiz-id'),
                                       $(this).data('option-id'),
                                       $(this).data('max'),
                                       $(this).data('odds'),
                                       optionName,
                                       subject
                                      );
  });
}

//竞猜按钮绑定事件
function addEventForEntertainmentQuizSubmit(quizId, optionId, betMax, odds, optionName, subject)
{
	$("#quizSubmit").on('click',function (event){
        event.preventDefault();

        //竞猜数判断
        var goldsNumber = $('.goldsNumber').val();

        var reg=/^[1-9]+[0-9]*]*$/;
        if(!reg.test(goldsNumber))
        {
            alert("请填写大于1的整数");
            return ;
        }

        // if(goldsNumber - betMax > 0)
        // {
        //   alert('抱歉，已超出单笔最大投注额'+betMax+'！');
        //   return ;
        // }

        ajaxEntertainmentQuizSubmit(quizId, optionId, goldsNumber, odds, optionName, subject);
  });
}

//ajax  提交竞猜
function ajaxEntertainmentQuizSubmit(quizId, optionId, goldsNumber, odds, optionName, subject)
{
      var timestamp = new Date().getTime();
      var uniqueStr = timestamp+'-'+Math.ceil(Math.random()*1000)+'-'+quizId+'-'+optionId+'-'+goldsNumber;
      var uniqueRequestId = $.base64.btoa(uniqueStr);

      //提交竞猜
      $.ajax({
          url:      '/roulette/quiz',
          type:     'post',
          data:     { quizId: quizId, optionId: optionId, golds: goldsNumber,uniqueRequestId: uniqueRequestId},
          dataType: 'json',
          beforeSend: function (xhr)
          {
            $('#quizSubmit').off('click');
            $('#quizSubmit').html('<span class="icon icon-loading"></span>处理中...');
          },
          success: function(response){

              if(response.code == 200)
              {
                  quizSuccessAlert(optionName, goldsNumber, odds, subject);
              }else{
                  quizErrorAlert(response.message);
              }

          },
          error: function()
          {
              $('#quizSubmit').html('确认投注');
              $('#quizSubmit').on('click');
              alert("网络出问题了");
          }
      });
}

//竞猜成功弹窗
function quizSuccessAlert(optionName, goldsNumber, odds, subject)
{
  var successBalance = +goldsNumber * (+odds - 1);
  $('#quiz-success-template .quiz-success-balance').html(Math.round10(successBalance, -2));

  $('.modal-tron-sm').hide();
  var template = render($('#quiz-success-template').html(),{ subject: subject,
                                                      option: optionName+'('+odds+')',
                                                      stake: goldsNumber,
                                                      win:  Math.round10(successBalance, -2)});

  $('#modal-backdrop').after(template);
  $('#modal-backdrop').show();
  $('#quiz-success-template, #quiz-success-template .modal-tron-sm').show();

  addEventForCloseBtn();
}

//其他错误信息统一弹窗样式
function quizErrorAlert(message)
{
  //其他提示信息
  $('.modal-tron-sm').hide();
  var template = render($('#other-template').html(), { subject: message });
  $('#modal-backdrop').after(template);
  $('#modal-backdrop').show();
  $('.form-actions .btn').remove(); //去除“继续其他投注”按钮
  addEventForCloseBtn();
}

function addEventForCloseBtn()
{
  $('[data-close]').click(
    function (e)
    {
      e.preventDefault();

      window.location.reload();
    }
  );
}

//轮盘前后天
function getInfoByDate(dateStr)
{
  var url = '/roulette/byDate/'+dateStr;

  $.get(url, function (data) {

        if($.trim(data))
        {
          $(".dateInfo").remove();
          $(".quizListInfo").remove();
          $(".quizUl").append(data);
        }
   });
}
