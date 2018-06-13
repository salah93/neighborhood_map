const ViewModel = function(places, map, error) {
  const self = this
  this.placesList = places.map(function(p){
    return new Place(p);
  });

  this.currentList = ko.observableArray(this.placesList);

  this.error = ko.observable(error);
  this.totalLength = ko.observable(places.length);

  this.filter = function() {
    const filter_value = $("#filter").val().toLowerCase();
    const selected = this.placesList.filter(place => place.name.toLowerCase().match(new RegExp(`.*${filter_value}.*`)));
    this.currentList(selected);
    const indices = selected.map(p => p.index);
    map.dropMarkers(indices);
  };

}

const Place = function(data) {
  const self = this;
  this.name = data.name;
  this.location = data.location;
  this.address = data.address;
  this.index = data.index;
  this.anecdote = data.anecdote;
  this.yelp_id = data.yelp_id;
  this.yelp_reviews = ko.observableArray([]);
  this.instagram_pics = ko.observableArray([]);
  this.get_info = function(place) {
    const $button = $(`#${place.index}`);
    const state_token = $button.attr('state');
    const yelp_url =`/${place.yelp_id}/yelp_reviews.json`;
    $.ajax(yelp_url, {
      method: "GET",
      dataType: "json",
      data: {
        state: state_token
      },
      success: function(data) {
        $('.list-group-item').attr('state', data.state);
        let reviews = data.reviews;
        self.yelp_reviews(reviews.map(function(r) {
          const rating = r.rating;
          const text = r.text;
          return {rating: rating, text: text}
        }));
      }
      });
    const instagram_media_url = "https://api.instagram.com/v1/media/search";
    const instagram_access_token = "4669943377.05f60cb.3e27daca1b3e4fdfbacd69ac33d9c23d";
    $.ajax(instagram_media_url, {
      method: "GET",
      dataType: "jsonp",
      data: {
        lat: this.location.lat,
        lng: this.location.lng,
        distance: 1000,
        access_token: instagram_access_token
      },
      success: function(data) {
        let photos = data.data;
        self.instagram_pics(photos.map(function(p) {
          const alt = p.caption ? p.caption.text : "";
          const src = p.images.thumbnail.url;
          return {alt: alt, src: src};
        }));
      }
      });
  };
}


function initVariables(map, error){
  const places = [
    {
        icon: "https://cdn.shopify.com/s/files/1/1061/1924/products/Slice_Of_Pizza_Emoji_large.png?v=1480481064",
        name: "Dani's House of Pizza",
        location: {
          lat: 40.708981,
          lng: -73.830536
        },
        address: "81-28 Lefferts Blvd, Kew Gardens, NY 11415, United States",
        yelp_id: "danis-house-of-pizza-kew-gardens",
        index: 0,
        anecdote: "A bustling in and out pizza joint that exemplifies new york culture and cuisine. Cheap pizza, no bullshit attitudes, and a friendly space. You want a fast slice? Too bad. You want a good slice? Wait in line like everybody else princess. The place is too busy to be mad at them for the wait time, and the slice too good.",
    }, {
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
        name: "No Pork Halal Kitchen",
        location : {
          "lat": 40.6832795,
          "lng": -73.9793
        },
        address: "50 4th Ave, Brooklyn, NY 11217, USA",
        yelp_id: "no-pork-halal-kitchen-brooklyn",
        index: 1,
        anecdote: "The best chinese food in the city. Their impatience matched with their cuisine makes this chinese joint uniquely new york",
    }, {
        icon:"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        name: "Force Fitness Club",
        yelp_id: "force-fitness-club-ridgewood-2",
        location: {
          "lat": 40.7119001,
          "lng": -73.8994671
        },
        address: "63-03 Fresh Pond Rd, Ridgewood, NY 11385, USA",
        index: 2,
        anecdote: "Working out.",
    }, {
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        name: "Nature's Detox Juice Bar",
        yelp_id: "natures-detox-queens",
        location: {
          "lat": 40.7065583,
          "lng": -73.7924349
        },
        address: "168-03 Jamaica Ave, Jamaica, NY 11435, USA",
        index: 3,
        anecdote: "Good Food.",
    }, {
        name: "Prospect Park",
        yelp_id: "prospect-park-brooklyn",
        location: {
          "lat": 40.6602037,
          "lng": -73.9689558
        },
        address: "Brooklyn, NY 11225, USA",
        index: 4,
        anecdote: "Cool Place to Chill",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/generic_recreational-71.png",
    }, {
        name: "Rockaway Beach",
        yelp_id: "rockaway-beach-and-boardwalk-rockaway-park",
        location: {
          "lat": 40.5833388,
          "lng": -73.8179384
        },
        address: "Queens, NY 11693, USA",
        index: 5,
        anecdote: "Beach",
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
    },
  ];
  console.log(places);

  ko.applyBindings(new ViewModel(places, map, error));
  return places;
}
