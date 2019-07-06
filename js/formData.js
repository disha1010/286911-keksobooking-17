'use strict';

(function () {
  var housingType = window.adForm.querySelector('#type');
  var timein = window.adForm.querySelector('#timein');
  var timeout = window.adForm.querySelector('#timeout');
  var housingPrice = window.adForm.querySelector('#price');
  var housingTypeOptions = housingType.querySelectorAll('option');

  // нахождение минимальной цены за ночь
  var getMinPriceByHousingType = function () {
    var housingPrices = {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    };

    for (var i = 0; i < housingTypeOptions.length; i++) {
      var selectedTypeOption = housingTypeOptions[i].selected;
      var typeOptionValue = housingPrices[housingTypeOptions[i].value];
      if (selectedTypeOption) {
        housingPrice.min = typeOptionValue;
        housingPrice.placeholder = typeOptionValue;
      }
    }
  };

  // синхронизация времени заезда и выезда
  var timeSynchronization = function (mainTime, dependentTime) {
    dependentTime.value = mainTime.value;
  };

  housingType.addEventListener('change', getMinPriceByHousingType);

  timein.addEventListener('change', function () {
    timeSynchronization(timein, timeout);
  });

  timeout.addEventListener('change', function () {
    timeSynchronization(timeout, timein);
  });
})();
