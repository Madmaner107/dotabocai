/*
 * 竞猜题目状态的切换（可投注，已关闭两个状态切换）
 */
 function changeQuizStatus(toStatus, quizId)
 {
  var confirmStr = toStatus == 1 ? '你确定开盘吗？' : '你确定关盘吗？';
  if(!confirm(confirmStr))
  {
    return ;
  }

 	$.ajax({
   			url:      '/admin/quiz/status/change',
   			type:     'post',
   			data:     { toStatus: toStatus, quizId: quizId },
   			dataType: 'json',
   			success:  function(response){
   				if(response.code == 200)
   				{
                  location.reload();
   				}else{
   					alert("异常！请联系管理员");
   				}
    		},
    		error: function() {
		        alert("异常！请联系管理员");
		    }
   		})
 }

 /**
  * 竞猜结算状态的切换
  */
function changeBalanceStatus(toBalanceStatus, quizId)
{
   $.ajax({
            url:      '/admin/quiz/balanceStatus/change',
            type:     'post',
            data:     { toBalanceStatus: toBalanceStatus, quizId: quizId },
            dataType: 'json',
            success:  function(response){
               if(response.code == 200)
               {
                  location.reload();
               }else if(response.code == 405){
                  alert(response.message);
               }
               else{
                  alert("异常！请联系管理员");
               }
         },
         error: function() {
              alert("异常！请联系管理员");
          }
         })
}

/**
 *  结算按钮，
 *  关闭并结算
 */
function acountTheQuiz(quizId)
{

  if(!confirm("你确定结算吗？"))
  {
    return ;
  }

  $.ajax({
      url:      '/admin/acount/quiz',
      type:     'post',
      data:     {quizId: quizId },
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
  })
}

/**
 *  我派错了，
 *  初始化比赛的结算状态
 *
 */
 function wrongToBase(quizId)
 {

  if(!confirm('你确定派错吗？'))
  {
    return ;
  }

  $.ajax({
      url:      '/admin/acount/wrong',
      type:     'post',
      data:     {quizId: quizId },
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
  })
 }

 /**
  *  取消结算
  *
  */
function acountCancel(quizId)
{

  if(!confirm('你确定取消结算吗？'))
  {
    return ;
  }

  $.ajax({
      url:      '/admin/acount/cancel',
      type:     'post',
      data:     {quizId: quizId },
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
  })
}

/**
 *  流盘结算
 *
 */
 function acountLiuPan(quizId)
 {
    if(!confirm('你确定流盘结算吗？'))
    {
      return ;
    }

    $.ajax({
      url:      '/admin/acount/liuPan',
      type:     'post',
      data:     {quizId: quizId },
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
  })
 }

/**
 *  点击选项查看赔率更新历史
 *
 */
function checkOddsChange(optionId)
{
    $.ajax({
      url:      '/admin/odds/change',
      type:     'post',
      data:     { optionId: optionId },
      dataType: 'json',
      success:  function(response){
        alert(response.message);
      },
      error: function() {
          alert("网络出问题了");
      }
    });
}

/**
 *  投注更新赔率js
 *
 */
function lowTheOdds(quizId, optionId)
{
    var $id = $('#quiz_'+quizId+'_'+optionId),
        goldsVal = $id.val(),
        golds = $.trim(goldsVal);
    if(!golds)
    {
      alert('请填写投注额');
      return ;
    }

    var reg=/^[1-9]+[0-9]*]*$/;
    if(!reg.test(golds))
    {
        alert("请填写大于1的整数");
        return ;
    }

    $.ajax({
      url:      '/admin/quiz/toLowOdds',
      type:     'post',
      data:     {quizId:quizId, optionId: optionId, golds:golds},
      dataType: 'json',
      success:  function(response){
        if(response.code == 200)
        {
            $id.val('');
            alert(response.message);
            window.location.reload();
        }else{
          alert(response.message);
        }

      },
      error: function() {
          alert("网络出问题了");
      }
    });
}

//设置选项预投注额
function setPreGolds(quizId, optionId) {
    var $id = $('#quiz_pre_golds_'+quizId+'_'+optionId),
        goldsVal = $id.val(),
        golds = $.trim(goldsVal);
    if(!golds)
    {
      alert('请填写投注额');
      return ;
    }

    var reg=/^[1-9]+[0-9]*]*$/;
    if(!reg.test(golds))
    {
        alert("请填写大于1的整数");
        return ;
    }

    $.ajax({
      url:      '/admin/quiz/setPreGolds',
      type:     'post',
      data:     {quizId:quizId, optionId: optionId, golds:golds},
      dataType: 'json',
      success:  function(response){
        if(response.code == 200)
        {
            $id.val(golds);
            alert(response.message);
            window.location.reload();
        }else{
          alert(response.message);
        }

      },
      error: function() {
          alert("网络出问题了");
      }
    });
}
