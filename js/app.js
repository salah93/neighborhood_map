var ViewModel = function(places, map, error) {
  var self = this
  this.placesList = places.map(function(p){
    return new Place(p);
  });

  this.currentList = ko.observableArray(this.placesList);

  this.error = ko.observable(error);

  this.filter = function() {
    var filter = $("#filter").val();
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
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
        name: "Dani's House of Pizza",
        location: {
          lat: 40.708981,
          lng: -73.830536
        },
        address: "81-28 Lefferts Blvd, Kew Gardens, NY 11415, United States",
        id: "a139054801fa079999e28a14e287d8262bd73357",
        index: 0,
        anecdote: "good pizza",
    }, {
        name: "Martha's Country Bakery",
        location : {
          lat: 40.7203786,
          lng: -73.84603940000001
        },
        address: "70-28 Austin St, Forest Hills, NY 11375, United States",
        id: "1c66c074132e003bebba0e17a3b92a9584676725",
        index: 1,
        anecdote: "marthas",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
    }, {
        name: "Kew Gardens Cinemas",
        id: "7722282e33a1fd5b617ddc9f643433a2d4d82013",
        location: {
          "lat": 40.709209,
          "lng": -73.829797
        },
        address: "8105 Lefferts Blvd, Kew Gardens, NY 11415, United States",
        index: 2,
        anecdote: "good movies",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/movies-71.png",
    }, {
        name: "Queens Library at Briarwood",
        id: "e58d0c93a7058ca17db4dd580c07d81bd1eb954e",
        location: {
          "lat": 40.7101939,
          "lng": -73.8193376
        },
        address: "85-12 Main St, Briarwood, NY 11435, United States",
        index: 3,
        anecdote: "good books",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png",
    }, {
        name: "Junior High School 217 Robert A Van Wyck",
        id: "68346857b194bea0e1cef38caa8710ea6bf0e0be",
        location: {
          "lat": 40.71050940000001,
          "lng": -73.8118746
        },
        address: "85-05 144th St, Jamaica, NY 11435, United States",
        index: 4,
        anecdote: "basketball",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png",
    },
  ];

  ko.applyBindings(new ViewModel(places, map, error));
  return places;
}
