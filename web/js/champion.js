$(document).ready(function (){
  toggleDescription();
});

function toggleDescription()
{
  $('#image-header-handle').click(function (e){
    var toggleStatus = $.trim($(this).text());

    if (toggleStatus == '详情')
    {
      $($(this).data('target')).animate({height:'100%'});
      $('.image-header-title').hide();
      $('.league-intro').show();
      $(this).html('隐藏<span class="icon icon-down-nav"></span>');
    }
    else
    {
      $($(this).data('target')).animate({height:'30px'});
      $('.league-intro').hide();
      $('.image-header-title').show();

      $(this).html('详情<span class="icon icon-up-nav"></span>');
    }
  });
}

function addEventForBetSubjectOptions()
{
  $('.bet-subject-option').on('click', function (e)
  {
    var dataVal = $(this).data("val");
    var dataArr = dataVal.split('_');

    var quizId = dataArr[0];
    var optionId = dataArr[1];
    var odds = dataArr[2];
    var maxOptionAmount = dataArr[3];
    var subjectContent = $('#subject-'+quizId).html();

    var optionName = $('#option-name-' + optionId).html();

    var template = render($('#modal-template').html(),
                          { optionId: $(this).attr('id'),
                            subject: subjectContent,
                            option: optionName + '(' + $(this).data('value') + ')',
                            balance: $('#user-current-amount').val()
                           });

    $('#modal-backdrop').siblings('.modal-tron-sm').remove();
    showTemplateAction(template);
    $(this).addClass('bet-subject-option-selected');
    $('.modal-tron-sm').show();

    addEventForCloseBtn();
    observer($(this).data("value"));
    addEventForQuizSubmit(quizId, optionId, odds, maxOptionAmount, subjectContent);
                        
  });
}

function addEventForQuizSubmit(quizId, optionId, odds, max, subjectContent)
{
  $("#quizSubmit").on('click',function (event){

        event.preventDefault();

        //竞猜数判断
        var goldsNumber = $('.goldsNumber').val();

        var reg=/^[1-9]+[0-9]*]*$/;
        if(!reg.test(goldsNumber)) { alert("请填写大于1的整数"); return ; }

        if( goldsNumber < 1 ) { alert("请填写大于1的数字"); return ; }

        if(goldsNumber - max > 0) {  alert('抱歉，已超出单笔最大投注额' + max + '！'); return ; }

        ajaxSubmit(quizId, optionId, odds, max, goldsNumber, subjectContent);
  });
}

function ajaxSubmit(quizId, optionId, odds, max, goldsNumber, subjectContent)
{
      //提交竞猜
      $.ajax({
          url:      '/champion/quiz/submit',
          type:     'post',
          data:     {
            optionId: optionId,
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

              if(response.code == 407)
              {
                //金币不足
                var template = render($('#money-not-enough-template').html(),{ });
                showTemplateAction(template);
                $('#money-not-enough-template, #money-not-enough-template .modal-tron-sm').show();
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
                  ajaxSubmit(quizId, optionId, response.message, max, goldsNumber, subjectContent);
                });
              }else if(response.code == 200){
                //竞猜成功
                var template = render($('#quiz-success-template').html(),
                                      { subject: $('#subject-' + quizId).html(),
                                        option: $('#option-name-' + optionId).html() + '(' + response.odds + ')',
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
              //绑定关闭事件
              addEventForCloseBtn();
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
}


