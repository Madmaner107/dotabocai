/** 给Match增加3个方法
 * Math.round10
 * Math.floor10
 * Math.ceil10
 */
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

function flashMessage(message, type)
{
  var messageClassBase = 'flash-message';
  var messageClassAddition = '';

  if (type && type == 'warning')
  {
    messageClassAddition = 'flash-message-warning';
  }

  var $flashMessage = $('#flash-message');
  $flashMessage.removeClass();

  var $message = $('#flash-message .message');
  $message.text(message);

  $flashMessage.addClass(messageClassBase + ' ' + messageClassAddition);
  $flashMessage.slideDown();

  setTimeout(function(){ $flashMessage.slideUp('slow');}, 3000);

  $('#flash-message .icon-close').bind('click touchstart', function (e) {
    $flashMessage.slideUp('slow');
  });
}

function showable()
{
  $('[data-showable]').each(function (a, b)
  {
    if ($(this).data('show-animation') == 'slideDown')
    {
      $(this).slideDown('slow');
    }
    else
    {
      $(this).show();
    }

    if ($(this).data('hide-after'))
    {
      var that = $(this);

      setTimeout(function(){that.slideUp('slow');}, +$(this).data('hide-after'));
    }
  }
  );
}

function hideable()
{
  $('[data-hideable]').click(function (e)
  {
    var that = this;

    $($(this).data('hideable').split(',')).each(function (k, v)
    {
      if ($(that).data('animation') == 'slideUp')
      {
        $($.trim(v)).slideUp('slow');
      }
      else
      {
        $($.trim(v)).hide();
      }
    });
  }
  );
}

function render(template, vars)
{
  $.each(vars, function(k, v)
  {
    var pattern = '{{' + k + '}}';
    return template = template.replace(new RegExp(pattern, 'gi'), v);
  });

  return template;
}

//判断是否是数组
function isNumber(n)
{
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 *
 *  获取cookie
 */
function getCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;

}

/**
 *  删除cookie
 */
function delete_cookie(name, value, expires, path, domain)
{
  var cookie = name + "=" + escape(value) + ";";

  if (expires) {
    if(expires instanceof Date) {
      if (isNaN(expires.getTime()))
       expires = new Date();
    }
    else
      expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

    cookie += "expires=" + expires.toGMTString() + ";";
  }

  if (path)
    cookie += "path=" + path + ";";
  if (domain)
    cookie += "domain=" + domain + ";";

  document.cookie = cookie;
}

(function($){
  $.queryString = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (results == null)
    {
      return null;
    }
    else
    {
      return results[1] || 0;
    }
  }
})(jQuery);


function addToggleEvent()
{
  $('[data-toggleable]').click(function (e){
    e.preventDefault();
    var $container = $($(this).data('toggleable-container'));
    $('.active', $container).removeClass('active');

    var $target = $($(this).data('toggleable'));
    $(this).addClass('active');
    $('[data-tab-content]').hide();
    $target.show();
  });
}

function focusable()
{
  $(document).on('focusin', '[data-focus-on]', function (e){
    $($(this).data('focus-on')).addClass('border-golden');
  });

  $(document).on('focusout', '[data-focus-on]', function (e){
    $($(this).data('focus-on')).removeClass('border-golden');
  });
}
