var Map = function() {
  var self = this;
  self.map = null;
  self.markers = []
  self.infowindow = null;
  self.bounds = null
  self.nightMapType = null;
  self.zoomLevel = 13;
  self.center = {lat: 40.7413548, lng: -73.9980244};

  self.initMap = function() {
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

    self.markers = initVariables(self, false).map(function(p){
      return new google.maps.Marker({
        position: p.location,
        title: p.name,
        animation: google.maps.Animation.DROP,
        map: self.map,
        icon: {
          url: p.icon,
          scaledSize: new google.maps.Size(60, 60),
          origin: new google.maps.Point(0, 0), // used if icon is a part of sprite, indicates image position in sprite
          anchor: new google.maps.Point(20,40), // lets offset the marker image
        },
      });
    });

    self.setBounds();

    self.markers.forEach(m => m.addListener('click', function() {
      self.setInfoWindow(m)
    }))
    self.listTriggerEvents();
  };

  self.listTriggerEvents = function() {
    $(".modal").on("show.bs.modal", function(e) {
      var index = parseInt(e.relatedTarget.id);
      var marker = self.markers[index];
      self.closeInfoWindow();
    });

    $(".modal").on("hidden.bs.modal", function(e) {
        var index = parseInt(e.target.id.substring(8));
        var marker = self.markers[index];
        self.map.setZoom(self.zoomLevel);
        self.map.setCenter(marker.position);
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

  // change to unSelectMarker
  self.closeInfoWindow = function() {
    self.infowindow.close();
    if (self.infowindow.marker)
      self.infowindow.marker.setAnimation(null);
    self.infowindow.marker = null;
  }

  self.hideMarker = function(marker) {
    if (self.infowindow.marker == marker)
      self.closeInfoWindow();
    marker.setMap(null);
  };

  self.setContent = function(marker) {
    var content = `<div><h5>${marker.title}</h5></div>`;
    return content;
  };

  // change to selectMarker
  self.setInfoWindow = function(marker) {
    if (self.infowindow.marker != marker) {
      if (self.infowindow.marker != null)
        self.closeInfoWindow(self.infowindow.marker);
      self.infowindow.marker = marker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
      var content = self.setContent(marker);
      self.infowindow.setContent(content);
      self.infowindow.open(self.map, marker);
    }
  };

  self.dropMarkers = function(indices){
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
