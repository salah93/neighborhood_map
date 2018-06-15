const ViewModel = function(places, map, error) {
  const self = this;
  self.placesList = places.map(function(p) {
    return new Place(p);
  });

  self.filter = ko.observable('');
  self.currentList = ko.computed(function() {
    const l = self.placesList.filter(
      (place) => place.name.toLowerCase().match(
        new RegExp(`.*${self.filter().toLowerCase()}.*`)));
    const indices = l.map((p) => parseInt(p.index));
    map.dropMarkers(indices);
    return l;
  }, self);

  self.error = ko.observable(error);
  self.totalLength = ko.observable(places.length);
};

const Place = function(data) {
  this.name = data.name;
  this.location = data.location;
  this.address = data.address;
  this.index = data.index;
  this.anecdote = data.anecdote;
  this.yelp_id = data.yelp_id;
  this.yelp_reviews = ko.observableArray([]);
  this.instagram_pics = ko.observableArray([]);
};

Place.prototype.get_info = function(place) {
  const self = this;
  const yelpStorageKey = 'yelp-reviews-' + self.index;
  let storedArray = localStorage[yelpStorageKey];
  if (! storedArray || JSON.parse(storedArray).length == 0) {
    const yelpUrl =`/${place.yelp_id}/yelp_reviews.json`;
    $.ajax(yelpUrl, {
      method: 'GET',
      dataType: 'json',
      }).done(function(data) {
        const reviews = data.reviews;
        self.yelp_reviews(reviews.map(function(r) {
          const rating = r.rating;
          const text = r.text;
          return {rating: rating, text: text};
        }));
        localStorage.setItem(
          yelpStorageKey, JSON.stringify(self.yelp_reviews()));
      }).fail(function(jqXHR, error, exception) {
        self.yelp_reviews([]);
      });
  } else {
    if (self.yelp_reviews().length == 0) {
      self.yelp_reviews(JSON.parse(localStorage[yelpStorageKey]));
    }
  }
  const instagramStorageKey = 'instagram-pics-' + self.index;
  storedArray = localStorage[instagramStorageKey];
  if (! storedArray || JSON.parse(storedArray).length == 0) {
    const instagramMediaUrl = 'https://api.instagram.com/v1/media/search';
    const instagramAccessToken = (
      '4669943377.05f60cb.3e27daca1b3e4fdfbacd69ac33d9c23d');
    $.ajax(instagramMediaUrl, {
      method: 'GET',
      dataType: 'jsonp',
      data: {
        lat: self.location.lat,
        lng: self.location.lng,
        distance: 1000,
        access_token: instagramAccessToken,
      },
    }).done(function(data) {
        let photos = data.data;
        self.instagram_pics(photos.map(function(p) {
          const alt = p.caption ? p.caption.text : '';
          const src = p.images.thumbnail.url;
          return {alt: alt, src: src};
        }));
        localStorage.setItem(
          instagramStorageKey, JSON.stringify(self.instagram_pics()));
      }).fail(function(jqXHR, error, exception) {
        self.instagram_pics([]);
      });
  } else {
    if (self.instagram_pics().length == 0) {
      self.instagram_pics(JSON.parse(localStorage[instagramStorageKey]));
    }
  }
};


const initVariables = function(map, error) {
  const places = [
    {
        icon: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Slice_Of_Pizza_Emoji_large.png?v=1480481064',
        name: 'Dani\'s House of Pizza',
        place_id: 'ChIJCeaFFaVgwokRWbrmlcnEGzY',
        location: {
          lat: 40.708981,
          lng: -73.830536,
        },
        address: '81-28 Lefferts Blvd, Kew Gardens, NY 11415, United States',
        yelp_id: 'danis-house-of-pizza-kew-gardens',
        index: 0,
        anecdote: 'A bustling in and out pizza joint that exemplifies new york culture and cuisine. Cheap pizza, no bullshit attitudes, and a friendly space. You want a fast slice? Too bad. You want a good slice? Wait in line like everybody else princess. The place is too busy to be mad at them for the wait time, and the slice too good.',
    }, {
        icon: 'https://image.flaticon.com/icons/png/128/123/123292.png',
        name: 'No Pork Halal Kitchen',
        place_id: 'ChIJ6VUkrq1bwokRgVyaTfBCZVU',
        location: {
          lat: 40.6832795,
          lng: -73.9793,
        },
        address: '50 4th Ave, Brooklyn, NY 11217, USA',
        yelp_id: 'no-pork-halal-kitchen-brooklyn',
        index: 1,
        anecdote: 'The best chinese food in the city. Their impatience matched with their cuisine makes this chinese joint uniquely new york',
    }, {
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScRBzy8ekq7qu0HrHc7PBmnSKE7KuUxGkrzCjxMhGTy2D6pK74',
        name: 'Force Fitness Club',
        yelp_id: 'force-fitness-club-ridgewood-2',
        place_id: 'ChIJk3l3PIVewokR3aspQYtV8Tg',
        location: {
          lat: 40.7119001,
          lng: -73.8994671,
        },
        address: '63-03 Fresh Pond Rd, Ridgewood, NY 11385, USA',
        index: 2,
        anecdote: 'Never crowded, great place to get gains. Its all about them gains.',
    }, {
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa9Pv4ZPqpMr6O4lC5snVNEnpy6Booq7YfgKLgTm7iJLa7Xo7rgQ',
        name: 'Nature\'s Detox Juice Bar',
        yelp_id: 'natures-detox-queens',
        place_id: 'ChIJNQovSSBhwokRKIi4G69FdrM',
        location: {
          lat: 40.7065583,
          lng: -73.7924349,
        },
        address: '168-03 Jamaica Ave, Jamaica, NY 11435, USA',
        index: 3,
        anecdote: 'Fresh food, great juice bar, and close to home :).',
    }, {
        name: 'Prospect Park',
        yelp_id: 'prospect-park-brooklyn',
        place_id: 'ChIJQwRohxBbwokRmHrfAMb3ixc',
        location: {
          lat: 40.6602037,
          lng: -73.9689558,
        },
        address: 'Brooklyn, NY 11225, USA',
        index: 4,
        anecdote: 'A New York gem. It has its own zoo, hosts concerts, and has all around great vibes',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOX3OeTWLMUG3Ib5sCkwLMP9U-l4m8hqZt5R5r7UovXX6g_BxZ',
    }, {
        name: 'Rockaway Beach',
        yelp_id: 'rockaway-beach-and-boardwalk-rockaway-park',
        place_id: 'ChIJoxE3NnZowokRlTnWRcMzxOU',
        location: {
          lat: 40.5833388,
          lng: -73.8179384,
        },
        address: 'Queens, NY 11693, USA',
        index: 5,
        anecdote: 'Close to home beach where you can avoid the crowds of the other major NY beaches.',
        icon: 'http://icons.iconarchive.com/icons/google/noto-emoji-travel-places/256/42468-beach-with-umbrella-icon.png',
    },
  ];

  ko.applyBindings(new ViewModel(places, map, error));
  return places;
};
