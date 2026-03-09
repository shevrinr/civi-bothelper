CRM.$(function($) {
  var $radios = $('input[name="soft_credit_type_id"]');
  var $clearLink = $('.soft_credit_type_id-section .crm-clear-link');

  // 🔹 ADD TEXT LABEL ONCE
  if (!$clearLink.find('.crm-clear-text').length) {
    $clearLink.append('<span class="crm-clear-text"> Clear</span>');
    $clearLink.attr('aria-label', 'Clear gift recognition selection');
  }

  function toggleClearLink() {
    if ($radios.filter(':checked').length > 0) {
      $clearLink.css('visibility', 'visible');
    } else {
      $clearLink.css('visibility', 'hidden');
    }
  }

  $radios.on('change', function() {
    toggleClearLink();
  });

  $clearLink.off('click').on('click', function(e) {
    e.preventDefault();

    $radios.prop('checked', false);

    toggleClearLink();
    $radios.first().trigger('change');
  });

  toggleClearLink();
});
