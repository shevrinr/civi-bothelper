(function ($) {
  $(document).ready(function () {
    if ($('crm-angular-js[modules="crmDashboard"]').length) {
      console.log("crmDashboard detected");
      $('#bootstrap-theme').removeAttr('id');
    } else {
      console.log("crmDashboard NOT detected");
    }

  });
})(CRM.$);