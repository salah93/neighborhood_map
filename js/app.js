var ViewModel = function(places, map, error) {
  var self = this
  this.placesList = places.map(function(p){
    return new Place(p); 
  });

  this.currentList = ko.observableArray(this.placesList);

  this.error = ko.observable(error);

  this.filter = function() {
    var filter = $('#filter').val();
    var selected = this.placesList.filter(place => place.name.match(new RegExp(`.*${filter}.*`)));
    this.currentList(selected);
    var indices = selected.map(p => p.index);
    map.dropMarkers(indices);
  };
}

var Place = function(data) {
  this.name = data.name;
  this.location = data.location;
  this.address = data.address;
  this.id = data.id;
  this.index = data.index;
  this.anecdote = data.anecdote;
}


function initVariables(map, error){
  var places = [
    {
        name: "first job",
        location: {
          lat: 40.6773151,
          lng: -73.97286009999999
        },
        address: "310 flatbush ave brooklyn, ny",
        id: "chij3zhe86hbwokr_87cnlsalai",
        index: 0,
        anecdote: 'first job yo',
    },
    {
        name: "University",
        location: {
          lat: 40.7308228,
          lng: -73.997332
        },
        address: "Washington Square Park, New York, NY 10012, USA",
        id: "ChIJjX494pBZwokRGH620d9eYfo",
        index: 1,
        anecdote: 'university yo',
    },
  ];

  ko.applyBindings(new ViewModel(places, map, error));
  return places;
}
