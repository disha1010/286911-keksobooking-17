'use strict';

(function () {
  var onLoad;

  window.adsApi = {
    getFilters: function () {
      var filters = {
        type: window.filters.type.value,
        price: window.filters.price.value,
        rooms: window.filters.rooms.value,
        guests: window.filters.guests.value,
        features: window.filters.features
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
        result = result.filter(function (ad) {
          switch (filter.guests) {
            case '2': return ad.offer.guests === 2;
            case '1': return ad.offer.guests === 1;
            case '0': return ad.offer.guests >= 100 || ad.offer.guests === 0;
            default: return false;
          }
        });
      }
      if (filter.price !== 'any') {
        result = result.filter(function (ad) {
          switch (filter.price) {
            case 'low': return ad.offer.price <= 10000;
            case 'middle': return ad.offer.price >= 10000 && ad.offer.price <= 50000;
            case 'high': return ad.offer.price >= 50000;
            default: return false;
          }
        });
      }
      if (filter.rooms !== 'any') {
        result = result.filter(function (ad) {
          return ad.offer.rooms === +filter.rooms;
        });
      }
      if (filter.features.length) {
        result = result.filter(function (ad) {
          var all = true;
          filter.features.forEach(function (f) {
            all = all & (ad.offer.features.indexOf(f) >= 0);
          });
          return all;
        });
      }

      onLoad(result);
    },
    getFilteredAds: function (onFilter, onError) {
      onLoad = onFilter;
      window.backend.load(window.adsApi.filterAds, onError);
    }
  };
})();
