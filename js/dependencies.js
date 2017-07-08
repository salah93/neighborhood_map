setTimeout(function() {
// If bootstrap stylesheet failed to load, use local fallback
  if ($('.row').css('margin-right') != '-15px') {
    var link_template = '<link rel="stylesheet" href="X">';
    $('head')
      .append(link_template.replace(
        'X',  'css/bootstrap.min.css'))
  }
}, 1000);
