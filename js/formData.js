'use strict';

(function () {
  var housingType = window.adForm.querySelector('#type');
  var timein = window.adForm.querySelector('#timein');
  var timeout = window.adForm.querySelector('#timeout');
  var housingPrice = window.adForm.querySelector('#price');
  var housingTypeOptions = housingType.querySelectorAll('option');
  var roomNumber = window.adForm.querySelector('#room_number');
  var capacity = window.adForm.querySelector('#capacity');

  var adAvatar = window.adForm.querySelector('#avatar');
  var adImagesContainer = window.adForm.querySelector('#images');
  var imgAvatar = document.querySelector('.ad-form-header__preview');
  var imgPhoto = document.querySelector('.ad-form__photo');

  // нахождение минимальной цены за ночь
  var getMinPriceByHousingType = function () {
    var HousingPrices = {
      BUNGALO: 0,
      FLAT: 1000,
      HOUSE: 5000,
      PALACE: 10000
    };

    housingTypeOptions.forEach(function (typeOption) {
      var selectedTypeOption = typeOption.selected;
      var typeOptionValue = HousingPrices[typeOption.value.toUpperCase()];
      if (selectedTypeOption) {
        housingPrice.min = typeOptionValue;
        housingPrice.placeholder = typeOptionValue;
      }
    });
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

  // add capacity option by rooms
  roomNumber.addEventListener('change', function (evt) {
    evt.preventDefault();
    var roomCount = +roomNumber.value;
    var capacityOption;
    capacity.innerHTML = '';

    var room100 = ['не для гостей'];
    var room1 = ['для 1 гостя'];
    var room2 = ['для 1 гостя', 'для 2 гостей'];
    var room3 = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'];

    var fillCapacity = function (selectedRoomCount, notForGuests) {
      selectedRoomCount.forEach(function (optionText, index) {
        capacityOption = document.createElement('option');
        capacity.value = index + 1;
        if (notForGuests) {
          capacity.value = index;
        }
        capacityOption.innerHTML = optionText;
        capacity.add(capacityOption);
      });
    };

    switch (roomCount) {
      case 100:
        fillCapacity(room100, true);
        break;
      case 3:
        fillCapacity(room3);
        break;
      case 2:
        fillCapacity(room2);
        break;
      case 1:
        fillCapacity(room1);
        break;
    }
  });

  var imageLoader = function (loaderInput, preview) {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    var curFiles = loaderInput.files;
    for (var i = 0; i < curFiles.length; i++) {
      var image = document.createElement('img');
      image.src = window.URL.createObjectURL(curFiles[i]);
      image.width = 70;
      image.height = 70;
      preview.appendChild(image);
    }
  };

  adAvatar.addEventListener('change', function () {
    imageLoader(adAvatar, imgAvatar);
  });

  adImagesContainer.addEventListener('change', function () {
    imageLoader(adImagesContainer, imgPhoto);
  });
})();
