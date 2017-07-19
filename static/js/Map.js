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
    self.silverMapType = new google.maps.StyledMapType(
          [
            {
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#f5f5f5"
                            }
                    ]
              },
            {
                "elementType": "labels.icon",
                "stylers": [
                      {
                              "visibility": "off"
                            }
                    ]
              },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#616161"
                            }
                    ]
              },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                      {
                              "color": "#f5f5f5"
                            }
                    ]
              },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                      {
                              "visibility": "off"
                            }
                    ]
              },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#bdbdbd"
                            }
                    ]
              },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#eeeeee"
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
                              "color": "#757575"
                            }
                    ]
              },
            {
                "featureType": "poi.business",
                "stylers": [
                      {
                              "visibility": "on"
                            }
                    ]
              },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                      {
                              "color": "#588d6d"
                            }
                    ]
              },
            {
                "featureType": "poi.school",
                "stylers": [
                      {
                              "visibility": "on"
                            }
                    ]
              },
            {
                "featureType": "poi.school",
                "elementType": "geometry.fill",
                "stylers": [
                      {
                              "color": "#696360"
                            }
                    ]
              },
            {
                "featureType": "poi.school",
                "elementType": "labels.text",
                "stylers": [
                      {
                              "visibility": "on"
                            }
                    ]
              },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#ffffff"
                            }
                    ]
              },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                      {
                              "visibility": "off"
                            }
                    ]
              },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#757575"
                            }
                    ]
              },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#dadada"
                            }
                    ]
              },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#616161"
                            }
                    ]
              },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                      {
                              "visibility": "off"
                            }
                    ]
              },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#9e9e9e"
                            }
                    ]
              },
            {
                "featureType": "transit",
                "stylers": [
                      {
                              "visibility": "off"
                            }
                    ]
              },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#e5e5e5"
                            }
                    ]
              },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#eeeeee"
                            }
                    ]
              },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                      {
                              "color": "#c9c9c9"
                            }
                    ]
              },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                      {
                              "color": "#4d4a8a"
                            },
                      {
                              "weight": 1
                            }
                    ]
              },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                      {
                              "color": "#9e9e9e"
                            }
                    ]
              }
          ], {name: "Silver"});

    var custom_maptype_id = 'silver_map'
    self.map = new google.maps.Map($("#map")[0], {
      center: self.center,
      zoom: self.zoomLevel,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', custom_maptype_id]
      },
    });
    self.map.mapTypes.set(custom_maptype_id, self.silverMapType);
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
      //var index = parseInt(e.relatedTarget.id);
      //var marker = self.markers[index];
      self.closeInfoWindow();
    });

    $(".modal").on("hidden.bs.modal", function(e) {
      var index = parseInt(e.target.id.substring(8));
      var marker = self.markers[index];
      self.map.setCenter(marker.position);
      self.map.setZoom(self.zoomLevel);
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
