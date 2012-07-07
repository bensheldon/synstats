// INTERFACE
$(document).ready(function() {
  $("[rel=tooltip]").tooltip();

    // Tablesorter
  $('#committers').tablesorter({  
    headers: { 0: { sorter: false} } 
  });

})
