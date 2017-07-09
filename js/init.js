function initMap() {
  new Map().initMap();
}

function googleError () {
    initVariables(new Map());
    $('#map').append('<h1 class="text-center">Could not connect to Google Maps API</h1><img style="margin: auto; display: block" class="img-thumbnail" src="images/Happy-User-Web-Design.gif" alt="amir from collegehumor clapping his hands. Error gif">');
};
