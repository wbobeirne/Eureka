(function() {
  var $,
    _this = this;

  $ = jQuery;

  window.Eureka = {
    init: function() {
      this.addNavAttrs();
      this.buildBetterNav();
      this.handleFeatureBoard();
      return $('body').addClass('eureka-loaded');
    },
    addNavAttrs: function() {
      var primaryId;
      primaryId = null;
      return $('.top_nav ul li').each(function(idx, el) {
        var $el, id;
        $el = $(el);
        if ($el.find('.nav-title').length) {
          id = $el.find('.nav-title').html();
          if (id) {
            primaryId = id.trim().toLowerCase().replace(' ', '-');
            $el.addClass('primary');
            return $el.attr('id', 'nav-' + primaryId);
          }
        } else {
          id = $el.find('a').html();
          if (id) {
            id = id.trim().toLowerCase().replace(' ', '-');
            $el.addClass('secondary');
            return $el.attr('id', 'nav-' + primaryId + '-' + id);
          }
        }
      });
    },
    buildBetterNav: function() {
      var $item, $moreItems, $navItems, $newNav, $oldNav, item, navItems, primary, secondary, _i, _j, _k, _len, _len1, _len2, _ref;
      navItems = [
        {
          text: '<i class="icon-home"></i>',
          href: '/roadmap'
        }, {
          text: '<i class="icon-tasks"></i> My work',
          href: $('#nav-null-my-work a').attr('href')
        }, {
          text: '<i class="icon-calendar"></i> Releases',
          href: $('#nav-releases-portfolio a').attr('href')
        }, {
          text: '<i class="icon-lightbulb"></i> Ideas',
          href: $('#nav-ideas-list a').attr('href')
        }, {
          text: '<i class="icon-th"></i> Features board',
          href: $('#nav-features-board a').attr('href')
        }, {
          text: '<i class="icon-th-list"></i> Features list',
          href: $('#nav-features-list a').attr('href')
        }
      ];
      $oldNav = $('.top_nav .nav:not(.right-nav)');
      $newNav = $('<ul id="site-nav" class="nav">');
      for (_i = 0, _len = navItems.length; _i < _len; _i++) {
        item = navItems[_i];
        $item = $("<li class=\"primary\">\n	<a href=\"" + item.href + "\">" + item.text + "</a>\n</li>");
        if (window.location.pathname === item.href) {
          $item.find('a').addClass('current');
        }
        $newNav.append($item);
      }
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
      for (_j = 0, _len1 = navItems.length; _j < _len1; _j++) {
        primary = navItems[_j];
        $navItems.append("<div class=\"primary\">\n	<a href=\"" + primary.link + "\">\n		<span>" + primary.title + "</span>\n	</a>\n</div>");
        _ref = primary.subnavs;
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          secondary = _ref[_k];
          $navItems.append("<div class=\"secondary\">\n	<a href=\"" + secondary.link + "\">\n		<span>" + secondary.title + "</span>\n	</a>\n</div>");
        }
      }
      $newNav.append($moreItems);
      $oldNav.after($newNav);
      $oldNav.remove();
      return $moreItems.find('.toggle').off('click').on('click', function() {
        return $moreItems.toggleClass('expanded');
      });
    },
    handleFeatureBoard: function() {
      var expandedReleases, storageId;
      if (!$('.project-board-container').length) {
        return;
      }
      storageId = 'expanded-releases';
      expandedReleases = JSON.parse(localStorage.getItem(storageId));
      if (!expandedReleases) {
        expandedReleases = [];
      }
      $('.project-board, .parking-lot-board').prepend('<div class="expanded-feature-container">');
      $('.project-board-container .release').each(function(idx, el) {
        var $release;
        $release = $(el);
        $release.addClass('collapsed');
        return $release.find('.inner').append("<a href=\"javascript:void(0)\" class=\"expand-btn\">Expand</a>\n<a href=\"javascript:void(0)\" class=\"collapse-btn\">\n	<i class=\"icon-remove\"></i>\n</a>");
      });
      $('.release .expand-btn').on('click', function() {
        var $release;
        $release = $(this).closest('.release');
        $release.parent().find('.expanded-feature-container').addClass('has-releases').append($release);
        $release.addClass('expanded').removeClass('collapsed');
        expandedReleases.push($release.data('release-id'));
        return localStorage.setItem(storageId, JSON.stringify(expandedReleases));
      });
      $('.release .collapse-btn').on('click', function() {
        var $release, i, id, releaseId, remainingReleases, _i, _len;
        $release = $(this).closest('.release');
        $release.parent().parent().append($release);
        $release.removeClass('expanded').addClass('collapsed');
        remainingReleases = [];
        releaseId = $release.data('release-id');
        for (i = _i = 0, _len = expandedReleases.length; _i < _len; i = ++_i) {
          id = expandedReleases[i];
          if (id !== releaseId) {
            remainingReleases.push(id);
          }
        }
        expandedReleases = remainingReleases;
        return localStorage.setItem(storageId, JSON.stringify(expandedReleases));
      });
      return $('.project-board-container .release').each(function(idx, el) {
        if (expandedReleases.indexOf($(el).data('release-id')) !== -1) {
          return $(el).find('.expand-btn').click();
        }
      });
    }
  };

  $(document).ready(function() {
    return Eureka.init();
  });

  $(document).on('page:load', function() {
    return Eureka.init();
  });

}).call(this);
