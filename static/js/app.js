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
  var self = this;
  this.name = data.name;
  this.location = data.location;
  this.address = data.address;
  this.google_id = data.google_id;
  this.index = data.index;
  this.anecdote = data.anecdote;
  this.yelp_id = data.yelp_id;
  this.yelp_reviews = ko.observableArray([]);
  this.instagram_pics = ko.observableArray([]);
  this.get_info = function(place) {
    var $button = $(`#${place.index}`);
    var state_token = $button.attr('state');
    var yelp_reviews_url =`http://localhost:8000/${place.yelp_id}/yelp_reviews.json`;
    $.ajax(yelp_reviews_url, {
      method: "GET",
      dataType: "json",
      data: {
        state: state_token
      },
      success: function(data) {
        $('.list-group-item').attr('state', data.state);
        var reviews = data.reviews;
        self.yelp_reviews(reviews.map(function(r) {
          var rating = r.rating;
          var text = r.text;
          return {rating: rating, text: text}
        }));
      }
      });
    var instagram_media_url = "https://api.instagram.com/v1/media/search";
    $.ajax(instagram_media_url, {
      method: "GET",
      dataType: "jsonp",
      data: {
        lat: this.location.lat,
        lng: this.location.lng,
        access_token: "4669943377.05f60cb.3e27daca1b3e4fdfbacd69ac33d9c23d"
      },
      success: function(data) {
        var photos = data.data;
        self.instagram_pics(photos.map(function(p) {
          var alt = p.caption ? p.caption.text : "";
          var src = p.images.thumbnail.url;
          return {alt: alt, src: src};
        }));
      }
      });
  };
}


function initVariables(map, error){
  var places = [
    {
        icon: "https://cdn.shopify.com/s/files/1/1061/1924/products/Slice_Of_Pizza_Emoji_large.png?v=1480481064",
        name: "Dani's House of Pizza",
        location: {
          lat: 40.708981,
          lng: -73.830536
        },
        address: "81-28 Lefferts Blvd, Kew Gardens, NY 11415, United States",
        yelp_id: "danis-house-of-pizza-kew-gardens",
        google_id: "a139054801fa079999e28a14e287d8262bd73357",
        index: 0,
        anecdote: "good pizza",
    }, {
        name: "Martha's Country Bakery",
        location : {
          lat: 40.7203786,
          lng: -73.84603940000001
        },
        address: "70-28 Austin St, Forest Hills, NY 11375, United States",
        google_id: "1c66c074132e003bebba0e17a3b92a9584676725",
        yelp_id: "marthas-country-bakery-forest-hills",
        index: 1,
        anecdote: "marthas",
        icon: "https://cdn2.iconfinder.com/data/icons/food-desserts-drinks-and-sweets/512/cake1-512.png",
    }, {
        name: "Kew Gardens Cinemas",
        google_id: "7722282e33a1fd5b617ddc9f643433a2d4d82013",
        yelp_id: "kew-gardens-cinema-kew-gardens",
        location: {
          "lat": 40.709209,
          "lng": -73.829797
        },
        address: "8105 Lefferts Blvd, Kew Gardens, NY 11415, United States",
        index: 2,
        anecdote: "good movies",
        icon: "http://www.freeiconspng.com/uploads/cinema-movie-theatre-icon-2.png",
    }, {
        name: "Queens Library at Briarwood",
        google_id: "e58d0c93a7058ca17db4dd580c07d81bd1eb954e",
        yelp_id: "queens-borough-public-library-briarwood-briarwood",
        location: {
          "lat": 40.7101939,
          "lng": -73.8193376
        },
        address: "85-12 Main St, Briarwood, NY 11435, United States",
        index: 3,
        anecdote: "good books",
        icon: "static/images/book.png",
    }, {
        name: "Junior High School 217 Robert A Van Wyck",
        google_id: "68346857b194bea0e1cef38caa8710ea6bf0e0be",
        yelp_id: "",
        location: {
          "lat": 40.71050940000001,
          "lng": -73.8118746
        },
        address: "85-05 144th St, Jamaica, NY 11435, United States",
        index: 4,
        anecdote: "basketball",
        icon: "https://upload.wikimedia.org/wikipedia/commons/d/db/Sports_portal_bar_icon.png",
    },
  ];

  ko.applyBindings(new ViewModel(places, map, error));
  return places;
}
