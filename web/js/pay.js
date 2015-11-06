var wxJsApi;
var pingppPayRequest;
var wechatPayRequest;

$(document).ready(function (){
  addEventForPayOption();
  addEventForPayInput();

  $('.tron-btn-pay').click(function (e){
    showPaymentMethodChooseBox();
  });

  wxJsApi = {
      failedMsg: '支付失败',
      successUrl: $('#urls').data('success-url'),
      failedUrl:  $('#urls').data('failure-url'),
      parameters: {},
      jsApiCall: function() {
          if(wxJsApi.parameters == 'undefined') {
              //alert(wxJsApi.failedMsg);
              document.location.href = wxJsApi.failedUrl;
          }
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            wxJsApi.parameters,
            function(res){
              if(res.err_msg == 'get_brand_wcpay_request:ok')
              {
                 document.location.href = wxJsApi.successUrl;
              } else {
                //alert(wxJsApi.failedMsg);
                document.location.href = wxJsApi.failedUrl;
              }
            }
          );
      },
      callpay: function() {
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', wxJsApi.jsApiCall, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', wxJsApi.jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', wxJsApi.jsApiCall);
            }
        }else{
            wxJsApi.jsApiCall();
        }
    },
    clickPay: function() {
        $('[data-option=wechat]').on('click', pay);
    }
  };
});

function addEventForPayOption()
{
  $('[data-pay-option]').click(function (e){
    e.preventDefault();

    $('[data-pay-option]').removeClass('tron-btn-ghost-active');
    $(this).addClass('tron-btn-ghost-active');
    $('[data-pay-custom]').val('');

    updateGoldAmountInfo(+$(this).data('amount'));
  });
}

function addEventForPayInput()
{
  $('[data-pay-custom]').on('keyup', function (e){
    e.preventDefault();

    // $(this).addClass('tron-btn-ghost-active');

    if ($(this).val() != '')
    {
      if (!validate(+$(this).val()))
      {
        alert('请填写大于等于1的整数');
        $(this).val('');

        return;
      }
      
      if($(this).val() >999999999999)
      {
        alert('土豪哥哥，充值太多了啦 (>_<)');
        $(this).val('');

        return;
      }
    }

    updateGoldAmountInfo(+$(this).val());
  });

  $('[data-pay-custom]').focus(function (e){
    $('[data-pay-option]').removeClass('tron-btn-ghost-active');
    $(this).attr('placeholder', '');
    updateGoldAmountInfo(+$(this).val());
  });

  $('[data-pay-custom]').focusout(function (e){
    $(this).attr('placeholder', '其他金额');
  });
}

function updateGoldAmountInfo(money)
{
  var bonusGold = bonus(money);

  $('.gold-amount').html(money * 100 + bonusGold);
  $('.bonus-amount').html(bonusGold);

  $('#pay-amount').val(money);
}

function bonus(money)
{
  var bonus = 0;

  if (money >= 1000 )
  {
    bonus = money * (.06 * 100);
  }
  else if (money >= 100)
  {
    bonus = money * (.05 * 100) ;
  }
  else if (money >= 20)
  {
    bonus = money * (.04 * 100);
  }
  else if (money >= 10)
  {
    bonus = money * (.03 * 100);
  }
  else if (money >= 5)
  {
    bonus = money * (.02 * 100);
  }
  else if (money >= 1)
  {
    bonus = money * (.01 * 100);
  }

  return bonus;
}

function validate(anything)
{
  var reg=/^[1-9]+[0-9]*]*$/;

  return !!reg.test(anything);
}

function showPaymentMethodChooseBox()
{
  if (+$('#pay-amount').val() <= 0)
  {
    return alert('请输入正确的金额');
  }

  // $('#modal-backdrop').show();
  // $('.payment-method-choose-box').show();
  $('.content').append($('#payment-method-choose-box').html());

  wxJsApi.clickPay();
  addEventToPaymentOptions();
  addModalCloseEvent();
}

function addEventToPaymentOptions()
{
  $('[data-option]').on('click', clickEventForPaymentOption);
}

function clickEventForPaymentOption()
{
  var option = $(this).data('option');

  $('[data-option-box]').removeClass('icon-option-selected');
  $('[data-option-box]').addClass('icon-option');

  $('.icon-loading-gif').hide();

  switch (option)
  {
    case 'wechat':
      $('[data-option-box]', $(this)).removeClass('icon-option');
      $('[data-option-box]', $(this)).addClass('icon-option-selected');
      $('.icon-loading-gif', $(this)).show();
      wxJsApi.clickPay();
      break;
    case 'alipay_wap':
      $('[data-option-box]', $(this)).removeClass('icon-option');
      $('[data-option-box]', $(this)).addClass('icon-option-selected');
      $('.icon-loading-gif', $(this)).show();
      pingppPay($(this));
      break;
    default:
  }

  $('[data-option]').off('click');
}

function pingppPay(optionElement)
{
  pingppPayRequest = $.ajax({
    url: optionElement.data('url'),
    dataType: 'json',
    method: 'post',
    data: {
      channel: optionElement.data('option'),
      amount: $('#pay-amount').val()
    },
    success: function (data)
    {
      pingpp.createPayment(data, function(result, error){
          if (result == "success") {
              // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
              alert('success');
          } else if (result == "fail") {
              // charge 不正确或者微信公众账号支付失败时会在此处返回
              alert('fail');
          } else if (result == "cancel") {
              // 微信公众账号支付取消支付
              alert('Cancel');
          }

          // alert(error.msg);
          // alert(error.extra);
      });
    },
    complete: function ()
    {
      $('.icon-loading-gif').hide();
    }
  });
}

function pay()
{
    // $('.tron-btn-pay').unbind('click');
    var that = $(this);
    //区分是否是lol或者dota的充值
    var isLolPay= $('#lol_pay').val();
    var categorySign = 'dota';
    if($.trim(isLolPay) && isLolPay == 'lol_pay')
    {
      categorySign = 'lol';
    }
    
    wechatPayRequest = $.ajax({
      url: '/wxpay/ajax/' + $('#pay-amount').val()+'?category='+categorySign,
      dataType: "json",
      method: 'post',
      beforeSend: function (xhr)
      {
        // $('.tron-btn-pay').off('click');
        // $('.tron-btn-pay').html('<span class="icon icon-loading"></span>处理中...');
      },
      success: function (data)
      {
        if(data.data.jsApiParameters) {
            wxJsApi.parameters = data.data.jsApiParameters;
            wxJsApi.callpay();
        } else {
            alert(wxJsApi.failedMsg);
            document.location.href = wxJsApi.failedUrl;
        }
      },
      complete: function ()
      {
        // $('.tron-btn-pay').html('立即充值');
        $('.icon-loading-gif').hide();
      }
    });

    return false;
}

function addModalCloseEvent()
{
  $('[data-close-modal]').click(function (e){
    $($(this).data('close-modal')).remove();
    $('#modal-backdrop').remove();

    if (wechatPayRequest)
    {
        wechatPayRequest.abort();
    }

    if (pingppPayRequest)
    {
      pingppPayRequest.abort();
    }
  });
}
