(function() {
  var $;

  $ = jQuery;

  window.Eureka = {
    init: function() {
      $('body').addClass('eureka-loaded');
      return this.handleFeatureBoard();
    },
    handleFeatureBoard: function() {
      if (!$('.project-board-container').length) {
        return;
      }
      $('.project-board-scroller').off('scroll');
      return $('.parking-lot-scroller').off('scroll');
    }
  };

  Eureka.init();

}).call(this);
