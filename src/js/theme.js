(function($) {
  if (typeof Drupal !== 'undefined') {
    Drupal.behaviors.theme = {
      attach: function(context, settings) {
        init();
      }
    };
  } else {
    init();
  }

  function init() {
    // Ваш код
  }
})(jQuery);
