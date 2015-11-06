$(document).ready(function (){
  checkNofitication();

  if ($('[data-page=bet-history]').length)
  {
    markNotificationAsRead();
  }
});

function checkNofitication()
{
  $.ajax({
    url: $('#notification-url').data('notification-show'),
    method: 'post',
    dataType: 'json',
    data: {
      gameId: $('#current-game').val()
    },
    success: function (response)
    {
      if (response.status.code == 200)
      {
        $('[data-notification-badage=settle-count]').text(response.data.count);

        if (+response.data.count > 0)
        {
          $('[data-notification-badage=settle-count]').show();
        }
      }
    }
  });
}

function markNotificationAsRead()
{
  $.ajax({
    url: $('#notification-url').data('notification-mark-read'),
    method: 'post',
    dataType: 'json',
    data: {
      gameId: $('#current-game').val()
    },
    success: function (response)
    {
      if (response.status.code == 200)
      {
        $('[data-notification-badage=settle-count]').hide();
        $('[data-notification-badage=settle-count]').text(0);
      }
    }
  });
}
