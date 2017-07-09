var map;
var markers = []
var infowindow = null;

function googleError() {
  initVariables();
  $('#map').append('<h1 class="text-center">Could not connect to Google Maps API</h1><img style="margin: auto; display: block" class="img-thumbnail" src="images/Happy-User-Web-Design.gif" alt="amir from collegehumor clapping his hands. Error gif">');
}

function initMap () {
  var zoomLevel = 13;
  var nightMapType = new google.maps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#263c3f"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6b9a76"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#38414e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#212a37"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9ca5b3"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#1f2835"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#f3d19c"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2f3948"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#dde6f5"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#515c6d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        }
  ], {name: "Night"});
  var center = {lat: 40.7413548, lng: -73.9980244};
  map = new google.maps.Map($("#map")[0], {
    center: center,
    zoom: zoomLevel,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'night_time']
    },
  });
  map.mapTypes.set('night_time', nightMapType);
  map.setMapTypeId('night_time');
  //markers = places.map(function(p){
  markers = initVariables().map(function(p){
    return new google.maps.Marker({
      position: p.location,
      title: p.name,
      animation: google.maps.Animation.DROP,
      id: p.id,
      map: map,
    });
  });

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++){
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
  google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
        if (this.getZoom()){
            this.setZoom(zoomLevel);
        }
  });


  infowindow = new google.maps.InfoWindow();
  infowindow.addListener('closeclick', function()  {
    closeInfoWindow(infowindow); 
  });

  markers.forEach(m => m.addListener('click', function() {
    setInfoWindow(m, infowindow) 
  }))
  $('.list-group').click(function(data){
    var index = parseInt(data.target.id)
    var marker = markers[index];
    setInfoWindow(marker, infowindow);
  });
}

function closeInfoWindow(iw){
  iw.close();
  iw.marker = null;
}

function hideMarker(marker) {
  if (infowindow.marker == marker)
    closeInfoWindow(infowindow);
  marker.setMap(null);
}

function setInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    var content = `<div><h1>${marker.title}</h1></div>`
    infowindow.setContent(content);
    infowindow.open(map, marker);
  }
}

function dropMarkers(indices){
  var index = 0;
  for (var i=0; i < markers.length; i++) {
    if (i != indices[index]){
      hideMarker(markers[i]);
    }
    else {
      if (markers[i].getMap() == null){
        markers[i].setAnimation(google.maps.Animation.DROP);
        markers[i].setMap(map);
      }
      index++;
    }
  }
}
