'use strict';

(function () {
  var onLoad;
  var mapFilter = document.querySelector('.map__filters');
  var houseType = mapFilter.querySelector('#housing-type');
  var housePrice = mapFilter.querySelector('#housing-price');
  var houseRooms = mapFilter.querySelector('#housing-rooms');
  var houseGuests = mapFilter.querySelector('#housing-guests');
  var houseFeatures = Array.from(mapFilter.querySelectorAll('input[name="features"]'), function (item) {
    return item;
  });

  window.adsApi = {
    getFilters: function () {
      var filters = {
        type: houseType.value,
        price: housePrice.value,
        rooms: houseRooms.value,
        guests: houseGuests.value,
        features: houseFeatures
          .filter(function (e) {
            return e.checked;
          })
          .map(function (e) {
            return e.value;
          })
      };

      return filters;
    },
    filterAds: function (ads) {
      // here filtration logic
      var filter = window.adsApi.getFilters();
      var result = ads || [];
      if (filter.type !== 'any') {
        result = result.filter(function (ad) {
          return ad.offer.type === filter.type;
        });
      }
      if (filter.guests !== 'any') {
      //   result = result.filter(function (ad) {
      //     return ad.offer.guests >= filter.guests;
      //   });
      }
      if (filter.price !== 'any') {
      //   result = result.filter(function (ad) {
      //     return ad.offer.price === filter.price;
      //   });
      }
      if (filter.rooms !== 'any') {
      //   result = result.filter(function (ad) {
      //     return ad.offer.rooms === filter.rooms;
      //   });
      }
      if (filter.features.length) {
      //   result = result.filter(function (ad) {
      //     return ad.offer.features === filter.features;
      //   });
      }

      onLoad(result);
    },
    getFilteredAds: function (onFilter, onError) {
      onLoad = onFilter;
      window.backend.load(window.adsApi.filterAds, onError);
    }
  };
})();
