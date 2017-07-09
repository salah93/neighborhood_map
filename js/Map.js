var Map = function () {
  var self = this;
  self.map = null;
  self.markers = []
  self.infowindow = null;
  self.bounds = null
  self.nightMapType = null;
  self.zoomLevel = 13;
  self.center = {lat: 40.7413548, lng: -73.9980244};

  self.initMap = function () {
    self.infowindow = new google.maps.InfoWindow();
    self.bounds = new google.maps.LatLngBounds();
    self.nightMapType = new google.maps.StyledMapType(
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

    var custom_maptype_id = 'night_time'
    self.map = new google.maps.Map($("#map")[0], {
      center: self.center,
      zoom: self.zoomLevel,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', custom_maptype_id]
      },
    });
    self.map.mapTypes.set(custom_maptype_id, self.nightMapType);
    self.map.setMapTypeId(custom_maptype_id);

    self.infowindow.addListener('closeclick', self.closeInfoWindow);

    self.markers = initVariables(self).map(function(p){
      return new google.maps.Marker({
        position: p.location,
        title: p.name,
        animation: google.maps.Animation.DROP,
        id: p.id,
        map: self.map,
      });
    });

    self.setBounds();

    self.markers.forEach(m => m.addListener('click', function() {
      self.setInfoWindow(m)
    }))
    $('.list-group').click(function(data){
      var index = parseInt(data.target.id)
      var marker = self.markers[index];
      self.setInfoWindow(marker);
    });
  };

  self.setBounds = function() {
    self.markers.forEach(m => self.bounds.extend(m.position));
    self.map.fitBounds(self.bounds);
    google.maps.event.addListenerOnce(self.map, 'bounds_changed', function(event) {
          if (this.getZoom()){
              this.setZoom(self.zoomLevel);
          }
    });
  };

  self.closeInfoWindow = function () {
    self.infowindow.close();
    self.infowindow.marker = null;
  }

  self.hideMarker = function (marker) {
    if (self.infowindow.marker == marker)
      self.closeInfoWindow();
    marker.setMap(null);
  };

  self.setInfoWindow = function (marker) {
    if (self.infowindow.marker != marker) {
      self.infowindow.marker = marker;
      var content = `<div><h1>${marker.title}</h1></div>`
      self.infowindow.setContent(content);
      self.infowindow.open(self.map, marker);
    }
  };

  self.dropMarkers = function (indices){
    var index = 0;
    for (var i=0; i < self.markers.length; i++) {
      if (i != indices[index]){
        self.hideMarker(self.markers[i]);
      }
      else {
        var marker = self.markers[i];
        if (marker.getMap() == null){
          marker.setAnimation(google.maps.Animation.DROP);
          marker.setMap(self.map);
        }
        index++;
      }
    }
  }
};
