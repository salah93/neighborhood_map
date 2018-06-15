const MyMap = function() {
  const self = this;
  self.map = null;
  self.markers = [];
  self.infowindow = null;
  self.bounds = null;
  self.nightMapType = null;
  self.zoomLevel = 13;
  self.center = {lat: 40.7413548, lng: -73.9980244};

  self.initiate = function() {
    self.infowindow = new google.maps.InfoWindow();
    self.bounds = new google.maps.LatLngBounds();
    self.silverMapType = new google.maps.StyledMapType(
          [
            {
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#f5f5f5',
                            },
                    ],
              },
            {
                'elementType': 'labels.icon',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#616161',
                            },
                    ],
              },
            {
                'elementType': 'labels.text.stroke',
                'stylers': [
                      {
                              'color': '#f5f5f5',
                            },
                    ],
              },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'labels',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#bdbdbd',
                            },
                    ],
              },
            {
                'featureType': 'poi',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#eeeeee',
                            },
                    ],
              },
            {
                'featureType': 'poi',
                'elementType': 'labels.text',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'featureType': 'poi',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#757575',
                            },
                    ],
              },
            {
                'featureType': 'poi.business',
                'stylers': [
                      {
                              'visibility': 'on',
                            },
                    ],
              },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry.fill',
                'stylers': [
                      {
                              'color': '#588d6d',
                            },
                    ],
              },
            {
                'featureType': 'poi.school',
                'stylers': [
                      {
                              'visibility': 'on',
                            },
                    ],
              },
            {
                'featureType': 'poi.school',
                'elementType': 'geometry.fill',
                'stylers': [
                      {
                              'color': '#696360',
                            },
                    ],
              },
            {
                'featureType': 'poi.school',
                'elementType': 'labels.text',
                'stylers': [
                      {
                              'visibility': 'on',
                            },
                    ],
              },
            {
                'featureType': 'road',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#ffffff',
                            },
                    ],
              },
            {
                'featureType': 'road',
                'elementType': 'labels.icon',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'featureType': 'road.arterial',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#757575',
                            },
                    ],
              },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#dadada',
                            },
                    ],
              },
            {
                'featureType': 'road.highway',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#616161',
                            },
                    ],
              },
            {
                'featureType': 'road.local',
                'elementType': 'labels',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'featureType': 'road.local',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#9e9e9e',
                            },
                    ],
              },
            {
                'featureType': 'transit',
                'stylers': [
                      {
                              'visibility': 'off',
                            },
                    ],
              },
            {
                'featureType': 'transit.line',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#e5e5e5',
                            },
                    ],
              },
            {
                'featureType': 'transit.station',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#eeeeee',
                            },
                    ],
              },
            {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': [
                      {
                              'color': '#c9c9c9',
                            },
                    ],
              },
            {
                'featureType': 'water',
                'elementType': 'geometry.fill',
                'stylers': [
                      {
                              'color': '#4d4a8a',
                            },
                      {
                              'weight': 1,
                            },
                    ],
              },
            {
                'featureType': 'water',
                'elementType': 'labels.text.fill',
                'stylers': [
                      {
                              'color': '#9e9e9e',
                            },
                    ],
              },
          ], {name: 'Silver'});

    const customMaptypeId = 'silver_map';
    self.map = new google.maps.Map($('#map')[0], {
      center: self.center,
      zoom: self.zoomLevel,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', customMaptypeId],
      },
    });
    self.map.mapTypes.set(customMaptypeId, self.silverMapType);
    self.map.setMapTypeId(customMaptypeId);

    self.infowindow.addListener('closeclick', self.closeInfoWindow);
    self.map.addListener('click', self.closeInfoWindow);

    self.markers = initVariables(self, false).map(function(p) {
      return new google.maps.Marker({
        position: p.location,
        title: p.name,
        animation: google.maps.Animation.DROP,
        map: self.map,
        place_id: p.place_id,
        icon: {
          url: p.icon,
          scaledSize: new google.maps.Size(60, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 40), // lets offset the marker image
        },
      });
    });

    self.setBounds();
    self.service = new google.maps.places.PlacesService(self.map);

    self.markers.forEach((m) => m.addListener('click', function() {
      self.setInfoWindow(m);
    }));
    self.listTriggerEvents();
  };

  self.listTriggerEvents = function() {
    $('.modal').on('show.bs.modal', function(e) {
      self.closeInfoWindow();
    });

    $('.modal').on('hidden.bs.modal', function(e) {
      let id = e.target.id;
      const index = id.split('-').slice('-1');
      const marker = self.markers[parseInt(index)];
      self.map.setCenter(marker.position);
      self.map.setZoom(self.zoomLevel);
      self.setInfoWindow(marker);
    });
  };

  self.setBounds = function() {
    self.markers.forEach((m) => self.bounds.extend(m.position));
    self.map.fitBounds(self.bounds);
    google.maps.event.addListenerOnce(
      self.map, 'bounds_changed', function(event) {
          if (this.getZoom()) {
              this.setZoom(self.zoomLevel);
          }
    });
  };

  // change to unSelectMarker
  self.closeInfoWindow = function() {
    self.infowindow.close();
    if (self.infowindow.marker) {
      self.infowindow.marker.setAnimation(null);
    }
    self.infowindow.marker = null;
  };

  self.hideMarker = function(marker) {
    if (self.infowindow.marker == marker) {
      self.closeInfoWindow();
    }
    marker.setMap(null);
  };


  self.setContent = function(marker) {
    return new Promise(function(resolve, reject) {
      const request = {
        placeId: marker.place_id,
        fields: [
          'opening_hours', 'rating',
          'formatted_address', 'formatted_phone_number'],
      };
      self.service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          let content = `<div><h5>${marker.title}</h5><p>${place.formatted_address}</p>`;
          if (place.formatted_phone_number) {
            content += `<p>${place.formatted_phone_number}</p>`;
          }
          if (place.rating) {
            content += `<p>Rating: ${place.rating}/5</p>`;
          }
          if (place.opening_hours) {
            const hours = place.opening_hours.weekday_text;
            for (let i=0; i < hours.length; i++) {
              content += `<p>${hours[i]}</p>`;
            }
          }
          content += '</div>';
          resolve(content);
        } else {
          reject(`<div><h5>${marker.title}</h5></div>`);
        }
      });
      // return `<div><h1>${marker.title}</h1></div>`;
    });
  };


  // change to selectMarker
  self.setInfoWindow = function(marker) {
    if (self.infowindow.marker != marker) {
      if (self.infowindow.marker != null) {
        self.infowindow.setContent('');
        self.closeInfoWindow(self.infowindow.marker);
      }
      self.infowindow.marker = marker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
      self.setContent(marker).then(function(content) {
        self.infowindow.setContent(content);
      }, function(apiErrorContent) {
        self.infowindow.setContent(content);
      });
      self.infowindow.open(self.map, marker);
    }
  };

  self.dropMarkers = function(indices) {
    let index = 0;
    for (let i=0; i < self.markers.length; i++) {
      if (i != indices[index]) {
        self.hideMarker(self.markers[i]);
      } else {
        const marker = self.markers[i];
        if (marker.getMap() == null) {
          marker.setAnimation(google.maps.Animation.DROP);
          marker.setMap(self.map);
        }
        index++;
      }
    }
  };
};
