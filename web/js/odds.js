$(document).ready(function (){
  setInterval(function(){
      checkOdds();
  }, 5000);
});

function checkOdds()
{
  $.ajax({
    url: $('#page-info').data('check-odds-url'),
    type: 'post',
    dataType: 'json',
    data: {
      id: $('#page-info').data('game-id'),
      version: $('#version').val()
    },
    success: function (response)
    {
      if (response.status.code == 200)
      {
        updateOdds(response.data);
      }
    }
  });
}

function updateOdds(data)
{
  $('#version').val(data.version);

  $.each(data.remove, function (k, v){
    $('#bet-subject-cell-' + v).remove();
  });

  $.each(data.change, function (subject, v){
    if (v['status'] == 0)
    {
      $('#bet-subject-cell-' + subject).remove();
      console.log('Bet ' + subject + ' is closed!');

      return true;
    }

    if (!$('#bet-subject-cell-' + subject).length)
    {
      // addSubject();
    }

    $.each(v['options'], function (option, info)
    {
      $option = $('#option-' + option);

      if (!info['show'])
      {
        $option.remove();

        return true;
      }

      if (!$option.length)
      {
        //addOption()
      }

      if ($option.data('value') != info['odds'])
      {
        $option.data('value', info['odds']);
        $option.data('max', info['max']);

        $('#option-odds-' + option).text(info['truncated_odds']);
      }
    });
  });
}
