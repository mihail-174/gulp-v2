(function($) {
  if (typeof Drupal !== 'undefined') {
    Drupal.behaviors.webform = {
      attach: function(context, settings) {
        init();
      }
    };
  } else {
    init();
  }

  function init() {
    send_my_webform('form');
  }

  /*
   * функция отправляет данные с формы при клике на собственную кнопку
   * и при появлении ошибки не заполненного поля ставит фокус на первую ошибку
   */
  function send_my_webform(webform) {
    jQuery(webform).find('div.form-submit').on('click', function() {
      jQuery(this).parents('form').find('input.form-submit').click();
    });
    jQuery(this).parents('form').find('input.required.error').first().focus();
  }

})(jQuery);
