$(document).ready(function(){
    var zhanbaoLen = ($('.panel-default').length)-1;
    $('.add-quiz-link').on('click', function(e) {
        e.preventDefault();

        var prototype = $('#prototype').html();

        if ($('#last-quiz-index').length) {
            var index = $('#last-quiz-index').val();
            var newForm = prototype.replace(/__name__/g, index);
            $('#last-quiz-index').val(++index);
            $('#last-quiz-index').before(newForm);
        } else {
            var index = 1;
            var newForm = prototype.replace(/__name__/g, index);
            $('.form-horizontal').append(newForm+'<input type="hidden" id="last-quiz-index" name="last-quiz-index" value="1">');
        }
        document.body.scrollTop=document.body.scrollHeight;


            var picks = [],pickNames = [], action = $(this).attr('data-id');
            $.each($('[name="homePick[]"]'), function() {
                picks.push($(this).val());
            });

            $.each($('[name="awayPick[]"]'), function() {
                picks.push($(this).val());
            });

            $.each($('[name="homePickName[]"]'), function() {
                pickNames.push($(this).val());
            });
            $.each($('[name="awayPickName[]"]'), function() {
                pickNames.push($(this).val());
            });

            var homeTeam = $('#recap_homeTeam option:selected').text(),
                awayTeam = $('#recap_awayTeam option:selected').text();

            var i = zhanbaoLen;
            if(action == 'recap_edit') {
                i -= 1;
                $('.panel-default input[name="recap[recapStats][_name_][team]"]').eq(i).val(homeTeam + ' ' + awayTeam);
                $('.panel-default input[name="recap[recapStats][_name_][player]"]').eq(i).val(picks[zhanbaoLen]+' '+pickNames[zhanbaoLen]);
                i++;
            } else {
                $.each($('.panel-default input[name="team[]"]'), function(k) {
                    $('.panel-default input[name="team[]"]').eq(k).val(homeTeam + ' ' + awayTeam);
                    $('.panel-default input[name="player[]"]').eq(k).val(picks[k]+' '+pickNames[k]);
                });
            }
            zhanbaoLen++


    });

    $('.add-event-link').on('click', function(e) {
        e.preventDefault();

        var prototype = $('#recapEvent').html();

        if ($('#last-quiz-index').length) {
            var index = $('#last-quiz-index').val();
            var newForm = prototype.replace(/__name__/g, index);
            $('#last-quiz-index').val(++index);
            $('#last-quiz-index').before(newForm);
        } else {
            var index = 1;
            var newForm = prototype.replace(/__name__/g, index);
            $('.form-horizontal').append(newForm+'<input type="hidden" id="last-event-index" name="last-event-index" value="1">');
        }
        document.body.scrollTop=document.body.scrollHeight;
    });

    $('.del-quiz').on('click', function(e) {
        $(this).parent().parent().remove();
    })
});