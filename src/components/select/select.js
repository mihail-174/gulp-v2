(function($) {
  if (typeof Drupal !== 'undefined') {
    Drupal.behaviors.select = {
      attach: function(context, settings) {
        init();
      }
    };
  } else {
    init();
  }

  function init() {
    [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function(el) {
      new SelectFx(el);
    });
  }

})(jQuery);
