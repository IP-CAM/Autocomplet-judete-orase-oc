console.log('shipping js');

var idShippingRegion = '#input-shipping-zone';
var idShippingCity = '#input-shipping-city';
var idShippingCitySelect = '#selectinput-shipping-city';
var idShippingPostCode = '#input-shipping-postcode';

function shippingGenerateSelectForRegionAndCity() {
  console.log('XXX -3- shippingGenerateSelectForRegionAndCity make input select2');
  $(idShippingRegion).find('option')[0].remove();
  $(idShippingRegion).select2({
    placeholder: {
      id: '-1', // the value of the option
      text: 'Alege judet'
    },
    width: '100%',
    "language": {
      "noResults": function () {
        return "Nu exista judete";
      }
    },
  }).val(null).trigger('change');

  $(idShippingCity).before('<select id="' + idShippingCitySelect.replace('#', '') + '"></select>');
  $(idShippingCity).hide();
  $(idShippingCitySelect).select2({
    placeholder: {
      id: '-1', // the value of the option
      text: 'Alege localitate'
    },
    width: '100%',
    "language": {
      "noResults": function () {
        return "Nu sunt localitati";
      }
    },
  });
}

function initShippingAutocomplete() {
  console.log('XXX -2- initShippingAutocomplete');
  this.shippingGenerateSelectForRegionAndCity();

  // Binding the login_view input buttons when they are clicked to keep the binding alive to overcome the binding loss when the view is rendered.
  $('#login_view input[name=account]').on('click', function () {
    console.log('XXX shipping click on input name account');
    // Need to wait for a second before calling the initShippingAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    setTimeout(function () {
      this.initShippingAutocomplete();
    }, 1000);
  });

  $(idShippingRegion).on('change', function (e) {
    console.log('XXX -5- schimba judet');
    // Need to wait before calling the initShippingAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    setTimeout(function () {
      this.shippingAutocompleteCity(e);
    }, 500);
  });

  $(idShippingCitySelect).on('change', function (e) {
    console.log('XXX -6- schimba shipping localitate zip: ', $(e.currentTarget), $(e.currentTarget.selectedOptions[0]).text(), e.currentTarget.value);
    // Need to wait before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    $(idShippingCity).val($(e.currentTarget.selectedOptions[0]).text()).trigger('change');
    $(idShippingPostCode).val(e.currentTarget.value).trigger('change');
  });
}

function shippingAutocompleteCity(e) {
  console.log('XXX -4- shippingAutocompleteCity', $(e.currentTarget.selectedOptions[0]).text());

  var judetAles = $(e.currentTarget.selectedOptions[0]).text();

  var numeLocalitati = _.map(_.filter(window.bulkData, (obj) => {
    if (judetAles === 'Satu-Mare') {
      judetAles = 'Satu Mare';
    } else if (judetAles === 'Dimbovita') {
      judetAles = 'Dambovita'
    }
    return obj.region2_latin == judetAles
  }), (loc) => {
    return {
      nume: (judetAles === "Bucuresti" ? loc.region3_latin : loc.name_latin),
      zip: loc.zip
    };
  });

  $(idShippingCitySelect).empty();
  var option = '';
  for (var i = 0; i < numeLocalitati.length; i++) {
    var newOption = new Option(numeLocalitati[i].nume, numeLocalitati[i].zip);
    $(idShippingCitySelect).append(newOption);
  }

  $(idShippingCitySelect).trigger('change');
  //$(idShippingPostCode).val('').trigger('change');
}

setTimeout(function () {
  initShippingAutocomplete();
}, 500);
