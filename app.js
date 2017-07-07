var places = [
  {
      name: "first job",
      location: {
        lat: 40.6773151,
        lng: -73.97286009999999
      },
      address: "310 flatbush ave brooklyn, ny",
      id: "chij3zhe86hbwokr_87cnlsalai",
  },
  {
      name: "University",
      location: {
        lat: 40.7308228,
        lng: -73.997332
      },
      address: "Washington Square Park, New York, NY 10012, USA",
      id: "ChIJjX494pBZwokRGH620d9eYfo",
  },
];

var ViewModel = function() {
  var self = this
  //this.placesList = markers;
  this.placesList = places.map(function(p){
    return new Place(p); 
  });
  this.currentList = ko.observableArray(this.placesList);

  this.filter = function() {
    var filter = $('#filter').val();
    this.currentList(this.placesList.filter(place => place.name.match(new RegExp(`.*${filter}.*`))));
    //dropMarkers(this.currentList());
  };
}

var Place = function(data) {
  this.name = data.name;
  this.location = data.location;
  this.address = data.address;
  this.id = data.id;
}

ko.applyBindings(new ViewModel());
