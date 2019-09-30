console.log('-1- payment address page init');

//ajax quick checkout payment address
var idPaymentRegion = '#input-payment-zone';
var idPaymentCity = '#input-payment-city';
var idPaymentCitySelect = '#selectinput-payment-city';
var idPaymentPostCode = '#input-payment-postcode';

function paymentGenerateSelectForRegionAndCity() {
  console.log('XXX -3- paymentGenerateSelectForRegionAndCity make input select2');
  $(idPaymentRegion).find('option')[0].remove();
  $(idPaymentRegion).select2({
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

  $(idPaymentCity).before('<select id="' + idPaymentCitySelect.replace('#', '') + '"></select>');
  $(idPaymentCity).hide();
  $(idPaymentCitySelect).select2({
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

function initPaymentAutocomplete() {
  console.log('XXX -2- initPaymentAutocomplete and add listeners to region and city and create select');
  this.paymentGenerateSelectForRegionAndCity();

  $('input[name=payment_address][value=new]').on('change', function (e) {
    console.log('XXX payment change same address on input name account', e.currentTarget.checked);
    // Need to wait for a second before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    if (!e.currentTarget.checked) {
      setTimeout(function () {
        this.initPaymentAutocomplete();
      }, 1000);
    }
  });

  $(idPaymentRegion).on('change', function (e) {
    console.log('XXX -5- schimba judet');
    // Need to wait before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    setTimeout(function () {
      this.paymentAutocompleteCity(e);
    }, 500);
  });

  $(idPaymentCitySelect).on('change', function (e) {
    console.log('XXX -6- schimba localitate zip: ', $(e.currentTarget), $(e.currentTarget.selectedOptions[0]).text(), e.currentTarget.value);
    // Need to wait before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
    $(idPaymentCity).val($(e.currentTarget.selectedOptions[0]).text()).trigger('change');
    $(idPaymentPostCode).val(e.currentTarget.value).trigger('change');
  });

}

function paymentAutocompleteCity(e) {
  console.log('XXX -4- paymentAutocomplete', $(e.currentTarget.selectedOptions[0]).text());

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

  $(idPaymentCitySelect).empty();
  var option = '';
  for (var i = 0; i < numeLocalitati.length; i++) {
    var newOption = new Option(numeLocalitati[i].nume, numeLocalitati[i].zip);
    $(idPaymentCitySelect).append(newOption);
  }

  $(idPaymentCitySelect).trigger('change');
}
console.log('-2- load second payment addresss script', $('input[name=payment_address][value=new]'));


$('input[name=payment_address][value=new]').on('change', function (e) {
  console.log('treb sa verific daca deja e randat payment', e.currentTarget.checked);
  if (!$('#selectinput-payment-city').length && e.currentTarget.checked) {
    console.log('trebuie randat', e.currentTarget.checked);
    initPaymentAutocomplete()
    console.log('XXX -1- load and call initPaymentAutocomplete');
  }
});