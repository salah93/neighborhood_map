setTimeout(function() {
// If bootstrap stylesheet failed to load, use local fallback
  if ($('.row').css('margin-right') != '-15px') {
    let linkTemplate = '<link rel="stylesheet" href="X">';
    $('head')
      .append(linkTemplate.replace(
        'X', 'css/bootstrap.min.css'));
  }
}, 1000);
