function filterInvalidCharacters() {
  $('input[name="name"]').on('input', function() {
    let value = $(this).val();
    value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, "");
    $(this).val(value.charAt(0).toUpperCase() + value.slice(1));
  });
}

function setInitialFeedbackStore() {
  $.feedback_store = {
    phone: '',
    email: '',
    name: '',
    city: '',
    question: '',
    timezone: (-1 * new Date().getTimezoneOffset()) / 60,
    utm_medium: $.query.get('utm_medium') || '',
    utm_placement: $.query.get('utm_placement') || '',
    utm_source: $.query.get('utm_source') || '',
    utm_term: $.query.get('utm_term') || '',
    utm_content: $.query.get('utm_content') || '',
    utm_campaign: $.query.get('utm_campaign') || '',
    utm_campaign_name: $.query.get('utm_campaign_name') || '',
    device_type: $.query.get('device_type') || '',
    utm_region_name: $.query.get('utm_region_name') || '',
    utm_placement: $.query.get('utm_placement') || '',
    utm_description: $.query.get('utm_description') || '',
    utm_device: $.query.get('utm_device') || '',
    page_url: window.location.href,
    user_location_ip: '',
    yclid: $.query.get('yclid') || '',
  }

  ymaps.ready(function () {
    ymaps.geolocation
      .get({ provider: 'yandex', autoReverseGeocode: true })
      .then(function (result) {
        var addTranslate = {
          country: 'Страна',
          province: 'Округ',
          area: 'Подокруг',
          locality: 'Город',
        }
        var reducerMapHandler = function (addrEl) {
          return addTranslate[addrEl.kind] + ': ' + addrEl.name
        }
        var uInf = result.geoObjects
          .get(0)
          .properties.get('metaDataProperty')
          .GeocoderMetaData.Address.Components.map(reducerMapHandler)
        $.feedback_store.city =
          result.geoObjects.get(0).properties.get('metaDataProperty')
            .GeocoderMetaData.Address.formatted || ''
        $.feedback_store.user_location_ip = uInf.join(', ')
      })
  })
}

function createFormData(data) {
  var formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value)
    }
  })

  return formData
}

function initFeedbackForm() {
  const $forms = $('[data-feedback-form]')

  $forms.on('submit', function (event) {
    event.preventDefault()

    // Проверка на заполнение honeypot-поля
    if ($(this).find('.honeypot').val() !== '') {
      event.preventDefault();
      alert('Отправка заблокирована.');
    }

    if ($(this).valid()) {
      var fields = $(this)
        .serializeArray()
        .reduce(function (acc, current) {
          return $.extend(acc, { [current.name]: current.value })
        }, {})

      localStorage.removeItem('lead_name')
      localStorage.removeItem('city')

      if (fields.name) {
        localStorage.setItem('lead_name', fields.name)
      }

      if (fields.city) {
        localStorage.setItem('city', fields.city)
      }

      var data = $.extend($.feedback_store, fields)
      var formData = createFormData(data)

      $.ajax('php/formProcessor.php', {
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
      }).always(function () {
        window.location = 'thanks.html'
      })
    }
  })
}

$(document).ready(function () {
  initFeedbackForm()
  setInitialFeedbackStore()

  filterInvalidCharacters()
  $('input').inputmask()
})
