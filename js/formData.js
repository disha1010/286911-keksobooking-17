'use strict';

(function () {
  var housingType = window.adForm.querySelector('#type');
  var timein = window.adForm.querySelector('#timein');
  var timeout = window.adForm.querySelector('#timeout');
  var housingPrice = window.adForm.querySelector('#price');
  var housingTypeOptions = housingType.querySelectorAll('option');
  var roomNumber = window.adForm.querySelector('#room_number');
  var capacity = window.adForm.querySelector('#capacity');

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

  roomNumber.addEventListener('change', function (evt) {
    evt.preventDefault();
    var room = roomNumber.value;
    var capacityOption;
    capacity.innerHTML = '';

    if (room > 3) {
      capacityOption = document.createElement('option');
      capacity.value = 0;
      capacityOption.innerHTML = 'не для гостей';
      capacity.add(capacityOption);
    } else {
      for (var i = 0; i < room; i++) {
        capacityOption = document.createElement('option');
        capacity.value = i + 1;
        if ((i + 1) === 1) {
          capacityOption.innerHTML = 'для ' + (i + 1) + ' гостя';
        } else {
          capacityOption.innerHTML = 'для ' + (i + 1) + ' гостей';
        }
        capacity.add(capacityOption);
      }
    }
  });
})();
