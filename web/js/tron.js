$(document).ready(function ()
{
    getUserBalance();
    lazyLoadImages();
    hideable();
    showable();
    focusable();
    addEventForHelpIcon();
    addToggleEvent();
    addEventForBetSubjectOptions();
  // observer();
  $('#modal-backdrop').click(function (e){
    e.stopPropagation();
    return false;
  });

  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      preventClicks: true,
      preventClicksPropagation: true,
      loop: true,
      autoplay: 2000,
      onClick: function (swiper, event){
        window.location.href = $(swiper.clickedSlide).data('href');
      }
  });
});

/**
 *  判断是否时第一登陆的方法
 *
 */
function firstWindow(product)
{
  var cookieKey = 'firstSignDota';
  if(product == 'lol')
  {
      cookieKey = 'firstSignLol';
  }
  var isLoginSign = getCookie(cookieKey);

  if(isLoginSign == 1)
  {
    //第一次弹窗
    $('.modal-tron-sm').hide();
    $('#modal-backdrop').after(firstTemplate());
    $('#modal-backdrop').show();
    $('#first_login, #first_login .modal-tron-sm').show();

    addEventForCloseBtn();
  }else if(isLoginSign == 2){
    //注册第一次弹窗
    $('.modal-tron-sm').hide();
    var template = render(registerTemplate(),{ });
    $('#modal-backdrop').after(template);
    $('#modal-backdrop').show();
    $('#register, #register .modal-tron-sm').show();

    addEventForCloseBtn();
  }
}

function getFristLoginGolds()
{
  $('.modal-tron-sm').hide();
  $('.fade').remove();
  var currentAmount = $('#user-current-amount').val();
  flashMessage('成功领取首次登录金币！金币余额' + currentAmount );
  var domainVal = document.domain;

  if(domainVal.indexOf('ol.') > 0)
  {
    delete_cookie('firstSignLol', 0, -1, '/', "lol.dotacai.com");
  }else{
    delete_cookie('firstSignDota', 0, -1, '/', "www.dotacai.com");
  }
}

function addEventForBetSubjectOptions()
{
  $('.bet-subject-option').on('click', function (e)
  {
    var dataVal = $(this).data("val");
    var optionId = $(this).attr('id').split('-')[1];
    var optionName = $('#option-name-' + optionId).html();
    var template = render($('#modal-template').html(),
                          { optionId: $(this).attr('id'),
                            subject: $($(this).data('subject')).html(),
                            option: optionName + '(' + $(this).data('value') + ')',
                            balance: $('#user-current-amount').val()
                           });

    $('#modal-backdrop').siblings('.modal-tron-sm').remove();
    showTemplateAction(template);
    $(this).addClass('bet-subject-option-selected');
    $('.modal-tron-sm').show();

    observer($(this).data("value"));
    addEventForQuizSubmit($('#page-info').data('game-id'),
                          $(this).data('subject').split('-')[1],
                          $(this).attr('id').split('-')[1],
                          $(this).data('value'),
                          $(this).data('max'),
                          $($(this).data('subject')).text()
                         );
  });
}

function addEventForCloseBtn()
{
  $('[data-close]').click(
    function (e)
    {
      e.preventDefault();

      $($(this).data('close').split(',')).each(function (k, v)
      {
        $($.trim(v)).remove();
      });

      var id = $(this).attr('data-id');

      $('.bet-subject-option-selected').removeClass('bet-subject-option-selected');
      $('#modal-backdrop').hide();
      $('body').removeClass('modal-tron-open');
    }
  );
}

function addEventForQuizSubmit(game, subject, option, odds, max, subjectContent)
{
  $("#quizSubmit").on('click',function (event){

        event.preventDefault();

        //竞猜数判断
        var goldsNumber = $('.goldsNumber').val();

        var reg=/^[1-9]+[0-9]*]*$/;
        if(!reg.test(goldsNumber)) {
            alert("请填写大于1的整数");
            return ;
        }

        if(!isNumber(goldsNumber))
        {
          alert("请填写数字");
          return ;
        }
        if(goldsNumber < 1)
        {
          alert("请填写大于1的数字");
          return ;
        }

        if(goldsNumber - max > 0)
        {
          alert('抱歉，已超出单笔最大投注额' + max + '！');
          return ;
        }

        ajaxSubmit(game, subject, option, odds, max, goldsNumber, subjectContent);
  });
}

function ajaxSubmit(game, subject, option, odds, max, goldsNumber, subjectContent)
{
      //提交竞猜
      $.ajax({
          url:      '/quiz/submit',
          type:     'post',
          data:     {
            gameId: game,
            quizId: subject,
            optionId: option,
            golds: goldsNumber,
            odds: odds
          },
          dataType: 'json',
          beforeSend: function (xhr)
          {
            $('#quizSubmit').off('click');
            $('#quizSubmit').html('<span class="icon icon-loading"></span>处理中...');
          },
          success: function(response){

              $('.modal-tron-sm').hide();
              $('[data-modal]').remove();

              if(response.code == 407)
              {
                //金币不足
                var template = render($('#money-not-enough-template').html(),{ });
                showTemplateAction(template);
                $('#money-not-enough-template, #money-not-enough-template .modal-tron-sm').show()
              }else if(response.code == 409){
                //投注项目关闭
                var template = render($('#close-template').html(),{subject: subjectContent});
                showTemplateAction(template);
                $('#close-template, #close-template .modal-tron-sm').show();
                $('#close-template .bet-closed-info').html(response.message);
              }else if(response.code == 501){
                //赔率变更
                var template = render($('#odds-change-template').html(),{  });
                showTemplateAction(template);
                $('#oddsChange,#odds-change-template .modal-tron-sm').show();
                $('#oddsChange .text-white').html(goldsNumber);
                $('#oddsChange .text-bright-golden').html(Math.round10(+goldsNumber * (+response.message - 1), -2));
                $('#oddsChange #adds-change-title').html(response.oddsChangetitle);
                $('#quizAgain').on('click touchstart',function (event){
                  event.preventDefault();
                  ajaxSubmit(game, subject, option, response.message, response.maxBet, goldsNumber);
                });
              }else if(response.code == 200){
                //竞猜成功
                var template = render($('#quiz-success-template').html(),
                                      { subject: $('#subject-' + subject).html(),
                                        option: $('#option-name-' + option).html() + '(' + response.odds + ')',
                                        odds: response.odds,
                                        stake: goldsNumber,
                                        win: Math.round10(+goldsNumber * (+odds - 1), -2)
                                      });
                showTemplateAction(template);
                //修改页面余额
                var currentAmount = $('#user-current-amount').val();
                $('#user-current-amount').val(currentAmount-goldsNumber);
              }else{
                //其他提示信息
                var template = render($('#other-template').html(),{ });
                showTemplateAction(template);
                $('#other-template, #other-template .modal-tron-sm').show();
                $('.bet-closed-info').html(response.message);
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

function showTemplateAction(template)
{
  var modeaBackDrop = $('#modal-backdrop');
  modeaBackDrop.after(template);
  modeaBackDrop.show();

  addEventForCloseBtn();
}

function addEventForQuizAgain(gameId, quizId, optionId, optionInfo ,odds, maxBet ,goldsNumber)
{
  var quizinfo = 'game_'+gameId+'_'+quizId+'_'+optionId+'_'+odds+'_'+maxBet+'_'+optionInfo;

  ajaxSubmit(quizinfo, goldsNumber);
}

function observer(odds)
{
    $('[data-observer]').each(function (){
      var $self = $(this);
      var $element = $($(this).data('observer'));
      $element.bind('propertychange change keyup input paste click', function (e)
      {
        $self.text($(this).val());
        var val = +$(this).val() * (+odds - 1);
        $self.text(Math.round10(val, -2));
        // console.log($(this).val() * $($self.data('text')).data('value'));
        // console.log(round2d($(this).val() * $($self.data('text')).data('value')));
        // $self.text(round2d($(this).val() * $($self.data('text')).data('value')));
      }
      );
    });
}

/**
 *  注册时的送金币弹窗
 */
function registerTemplate()
{
    var res = $('#register').html();
    return res;
}

/**
 *  每日登陆时的弹窗
 *
 */
function firstTemplate()
{
    var res = $('#first_login').html();
    return res;
}

function addEventForHelpIcon()
{
  $('#help').click(function (e) {
    e.preventDefault();

    $('#modal-backdrop').show();
    $('#redeem-help-modal').show();
  });
}

function getUserBalance()
{
  $.ajax({
      url:      $('#user-current-amount').data('url'),
      type:     'post',
      dataType: 'json',
      success:  function(response){
        if (response.status.code != 200)
        {
          alert(response.status.message);
          return;
        }

        $('#user-current-amount').val(response.data);

        if ($.queryString('from') == 'paySuccess')
        {
          flashMessage('金币充值成功！金币余额：' + response.data);
        }
      }
    });
}

function lazyLoadImages()
{
  $("img.lazy").lazyload();
}

function showDailyBonusInfo()
{
  $('.modal-tron-sm').hide();
  $('#modal-backdrop').after($('.dailyBonusTips').html());
  $('#modal-backdrop').show();
  $('#dailyBonusTips, #dailyBonusTips .modal-tron-sm').show();
}

function setBonusNoticeRead()
{
  $('.modal-tron-sm').hide();
  $('.fade').remove();

  $.ajax({
      url:      '/user/setUserBonusRead',
      type:     'post',
      dataType: 'json',
      success:  function(response)
      {}
  });

}
