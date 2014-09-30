(function() {
  var $,
    _this = this;

  $ = jQuery;

  window.Eureka = {
    init: function() {
      this.addNavClasses();
      this.buildMoreNav();
      this.handleFeatureBoard();
      return $('body').addClass('eureka-loaded');
    },
    addNavClasses: function() {
      return $('.top_nav ul li').each(function(idx, el) {
        var $el, id;
        $el = $(el);
        if ($el.find('.nav-title').length) {
          id = $el.find('.nav-title').html();
          if (id) {
            $el.addClass('primary');
          }
        } else {
          id = $el.find('a').html();
          if (id) {
            $el.addClass('secondary');
          }
        }
        if (id) {
          return $el.attr('id', 'nav-' + id.trim().toLowerCase().replace(' ', '-'));
        }
      });
    },
    buildMoreNav: function() {
      var $moreItems, $navItems, navItems, primary, secondary, _i, _j, _len, _len1, _ref;
      navItems = [];
      $('.top_nav li .nav-title').each(function(idx, el) {
        var $navItem, link, secondaryItems, title;
        $navItem = $(el).closest('li');
        title = el.innerHTML;
        link = $navItem.find('a').first().attr('href');
        secondaryItems = [];
        $navItem.find('li').each(function(idx, el) {
          var $subnavItem;
          $subnavItem = $(el);
          return secondaryItems.push({
            title: $subnavItem.find('a').html(),
            link: $subnavItem.find('a').attr('href')
          });
        });
        return navItems.push({
          title: title,
          link: link,
          subnavs: secondaryItems
        });
      });
      $moreItems = $("<li id=\"nav-more-items\">\n	<a href=\"javascript:void(0)\" class=\"toggle\">\n		<span class=\"nav-title\">More items</span>\n	</a>\n	<div class=\"nav-items\">\n\n	</div>\n</li>");
      $navItems = $moreItems.find('.nav-items');
      for (_i = 0, _len = navItems.length; _i < _len; _i++) {
        primary = navItems[_i];
        $navItems.append("<div class=\"primary\">\n	<a href=\"" + primary.link + "\">\n		<span>" + primary.title + "</span>\n	</a>\n</div>");
        _ref = primary.subnavs;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          secondary = _ref[_j];
          $navItems.append("<div class=\"secondary\">\n	<a href=\"" + secondary.link + "\">\n		<span>" + secondary.title + "</span>\n	</a>\n</div>");
        }
      }
      $('ul.nav:not(.right-nav)').append($moreItems);
      return $moreItems.find('.toggle').off('click').on('click', function() {
        return $moreItems.toggleClass('expanded');
      });
    },
    handleFeatureBoard: function() {
      if (!$('.project-board-container').length) {
        return;
      }
      $('.project-board-scroller').off('scroll');
      return $('.parking-lot-scroller').off('scroll');
    }
  };

  $(document).ready(function() {
    return Eureka.init();
  });

  $(document).on('page:load', function() {
    return Eureka.init();
  });

}).call(this);
