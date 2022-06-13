//Data Table 
$(document).ready(function() {
    $('#tally_data').DataTable();
} );

$(document).ready(function() {
    $('#State_TG').DataTable();
} );

$(document).ready(function() {
    $('#AP_Constituency').DataTable();
} );

$(document).ready(function() {
    $('#TG_Constituency').DataTable();
} );

//select DropDown

$(document).on('change', '.div-toggle', function() {
  var target = $(this).data('target');
  var show = $("option:selected", this).data('show');
  $(target).children().addClass('hide');
  $(show).removeClass('hide');
});
$(document).ready(function(){
    $('.div-toggle').trigger('change');
});