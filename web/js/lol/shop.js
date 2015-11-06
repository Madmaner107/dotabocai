$(document).ready(
  function ()
  {
    addEventForItemFilter();
    addEventForItemFilterCriteria();
  }
);

function addEventForItemFilter()
{
  $('[data-filter]').click(
    function (e)
    {
      e.preventDefault();

      //$('[data-filter]').removeClass('active');

      $('[data-filter-criteria-for]').not('[data-filter-criteria-for=' + $(this).data('filter') + ']').hide();
      $('[data-filter-criteria-for=' + $(this).data('filter') + ']').toggle();

      // if ($('[data-filter-criteria-for=' + $(this).data('filter') + ']').is(":visible"))
      // {
      //   $(this).addClass('active');
      // }
    }
  );
}

function addEventForItemFilterCriteria()
{
  $('[data-for]').click(
    function (e)
    {
      e.preventDefault();

      $('[data-for]').removeClass('active');
      $(this).addClass('active');
      $('[data-filter=' + $(this).data('for') + '] .filter').text($(this).text());
      $('[data-filter=' + $(this).data('for') + ']').data('value', $(this).data('value'));
      filter();
    }
  );
}

function filter()
{
  var criterias = {};

  $('[data-filter]').each(function (index, element){
    criterias[$(this).data('filter')] = $(this).data('value');
  });

  window.location.href='http://' + window.location.host + window.location.pathname + '?' + $.param(criterias);
}
