'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var ROOMS_100 = ['не для гостей'];
  var ROOMS_1 = ['для 1 гостя'];
  var ROOMS_2 = ['для 1 гостя', 'для 2 гостей'];
  var ROOMS_3 = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'];

  var housingType = window.adForm.querySelector('#type');
  var timein = window.adForm.querySelector('#timein');
  var timeout = window.adForm.querySelector('#timeout');
  var housingPrice = window.adForm.querySelector('#price');
  var housingTypeOptions = housingType.querySelectorAll('option');
  var roomNumber = window.adForm.querySelector('#room_number');
  var capacity = window.adForm.querySelector('#capacity');


  var avatarFileChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var imagesFileChooser = document.querySelector('#images');
  var adPreview = document.querySelector('.ad-form__photo');

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

  var fillCapacity = function (selectedRoomCount, notForGuests) {
    capacity.innerHTML = '';

    selectedRoomCount.forEach(function (optionText, index) {
      var capacityOption = document.createElement('option');
      capacity.value = index + 1;
      if (notForGuests) {
        capacity.value = index;
      }
      capacityOption.innerHTML = optionText;
      capacity.add(capacityOption);
    });
  };

  // add capacity option by rooms
  roomNumber.addEventListener('change', function (evt) {
    evt.preventDefault();

    switch (roomNumber.value) {
      case '100':
        fillCapacity(ROOMS_100, true);
        break;
      case '3':
        fillCapacity(ROOMS_3);
        break;
      case '2':
        fillCapacity(ROOMS_2);
        break;
      case '1':
        fillCapacity(ROOMS_1);
        break;
    }
  });

  var isFileImg = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var renderNewImg = function (preview, file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];

    if (isFileImg(file)) {
      renderNewImg(avatarPreview, file);
    }
  });

  imagesFileChooser.addEventListener('change', function () {
    Array.from(imagesFileChooser.files).forEach(function (file) {
      if (isFileImg(file)) {
        var adPreviewImg = document.createElement('img');
        adPreviewImg.width = 70;
        adPreviewImg.height = 70;
        renderNewImg(adPreviewImg, file);

        adPreview.appendChild(adPreviewImg);
      }
    });
  });
})();
