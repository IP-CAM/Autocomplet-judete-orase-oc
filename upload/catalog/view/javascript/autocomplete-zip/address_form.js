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
    }).val(2679).trigger('change');

    $(idPaymentCity).before('<div class=""><select class="form-control" id="' + idPaymentCitySelect.replace('#', '') + '"></select></div>');
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
    console.log('XXX -2- initPaymentAutocomplete');

    this.paymentGenerateSelectForRegionAndCity();

    // Binding the login_view input buttons when they are clicked to keep the binding alive to overcome the binding loss when the view is rendered.
    $('.login-box input[name=account]').on('click', function () {
        console.log('XXX payment click on input name account');
        // Need to wait for a second before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
        setTimeout(function () {
            this.initPaymentAutocomplete();
        }, 1000);
    });


    $('input[name=shipping_address]').on('change', function (e) {
        console.log('XXX payment change same address on input name account');
        // Need to wait for a second before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
        if (!e.currentTarget.checked) {
            setTimeout(function () {
                console.log('activeaza si shipping address');
                // this.initShippingAutocomplete();
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

    var judetAles = document.getElementById('payment_address_address_1');
    //this.paymentAutocomplete(window);

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

setTimeout(function () {
    $('body').append('<div class="fuf"></div>')
    if ($('.fuf').length === 1) {
        initPaymentAutocomplete();

        console.log('-1- shipping_address first script');

        //ajax quick checkout payment address
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
            //$(idShippingRegion).off('change');
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

            $('input[name=shipping_address][value=new]').on('change', function (e) {
                console.log('XXX payment change same address on input name account', e.currentTarget.checked);
                // Need to wait for a second before calling the initPaymentAutocomplete(), otherwise the view is not fully rendered yet, the reference to the payment address cannot be found.
                if (!e.currentTarget.checked) {
                    setTimeout(function () {
                        this.initShippingAutocomplete();
                    }, 1000);
                }
            });
        }

        function shippingAutocompleteCity(e) {
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

            $(idShippingCitySelect).empty();
            var option = '';
            for (var i = 0; i < numeLocalitati.length; i++) {
                var newOption = new Option(numeLocalitati[i].nume, numeLocalitati[i].zip);
                $(idShippingCitySelect).append(newOption);
            }

            $(idShippingCitySelect).trigger('change');
            //$(idShippingPostCode).val('').trigger('change');
        }
        console.log('-2- Load and call init on change', $('input[name=shipping_address][value=new]'));

        // $('input[name=shipping_address][value=new]').on('change', function (e) {
        //     console.log('treb sa verific daca deja e randat shiping', e.currentTarget.checked);
        //     if (!$('#selectinput-shipping-city').length && e.currentTarget.checked) {
        //         console.log('trebuie randat', e.currentTarget.checked);
        //         initShippingAutocomplete()
        //         console.log('XXX -1- load and call initPaymentAutocomplete');
        //     }
        // });
    }
}, 800);


