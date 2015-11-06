
$(document).ready(function ()
{
	$( "#datepicker" ).datepicker({
	    defaultDate: $('#calendarStr').val()
	});
});

function skipToDate(that)
{
    var current_year = $(that).data('year');
    var current_mon  = $(that).data('month')-(-1);
    var current_day  = $(that).find('a').text();

    var current_url  = window.location.href;

    if(current_url.indexOf('winRate') > 0)
    {
    	window.location.href = '/admin/user/winRate/all?date='+current_year+'-'+current_mon+'-'+current_day;
    }else if(current_url.indexOf('profit') > 0){

    	window.location.href = '/admin/user/profit/all?date='+current_year+'-'+current_mon+'-'+current_day;
    }
}