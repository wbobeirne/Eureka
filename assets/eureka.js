(function() {
  var $, injectScript,
    _this = this;

  $ = jQuery;

  window.Eureka = {
    init: function() {
      this.addNavAttrs();
      this.buildBetterNav();
      this.handleFeatureBoard();
      this.handleFeatureDrawer();
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
          html: $('.top_nav .nav:not(.right-nav) .dropdown')
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
        if (item.html) {
          $item = item.html;
        } else {
          $item = $("<li class=\"primary\">\n	<a href=\"" + item.href + "\">" + item.text + "</a>\n</li>");
        }
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
      var buildRelease, expandedReleases, storageId;
      if (!$('.project-board-container').length) {
        return;
      }
      storageId = 'expanded-releases';
      expandedReleases = JSON.parse(localStorage.getItem(storageId));
      if (!expandedReleases) {
        expandedReleases = [];
      }
      $('.project-board, .parking-lot-board').prepend('<div class="expanded-feature-container">');
      buildRelease = function($release) {
        $release.addClass('collapsed');
        $release.find('.inner').append("<a href=\"javascript:void(0)\" class=\"expand-btn\">Expand</a>\n<a href=\"javascript:void(0)\" class=\"collapse-btn\">\n	<i class=\"icon-remove\"></i>\n</a>");
        $release.find('.expand-btn').on('click', function() {
          $release.parent().find('.expanded-feature-container').addClass('has-releases').append($release);
          $release.addClass('expanded').removeClass('collapsed');
          expandedReleases.push($release.data('release-id'));
          return localStorage.setItem(storageId, JSON.stringify(expandedReleases));
        });
        $release.find('.collapse-btn').on('click', function() {
          var i, id, releaseId, remainingReleases, _i, _len;
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
        if (expandedReleases.indexOf($release.data('release-id')) !== -1) {
          $release.find('.expand-btn').click();
        }
        $release.find('.expand-btn').on('mouseenter', function() {
          return $(this).closest('.release').addClass('expand-hover');
        }).on('mouseleave', function() {
          return $(this).closest('.release').removeClass('expand-hover');
        });
        return $release.addClass('initialized');
      };
      $('.project-board-container .release').each(function(idx, el) {
        return buildRelease($(el));
      });
      document.body.removeEventListener('extensionAjaxComplete');
      return document.body.addEventListener('extensionAjaxComplete', function() {
        var _this = this;
        return $('.project-board-container .release:not(.initialized)').each(function(idx, el) {
          return buildRelease($(el));
        });
      });
    },
    handleFeatureDrawer: function() {
      var $drawer;
      $drawer = $('#workspace .drawer');
      if (!$drawer.length) {
        return;
      }
      return $drawer.on('click', '.comment .user-content', function() {
        var watchers,
          _this = this;
        if ($drawer.find('.watcher-names').length) {
          return;
        }
        watchers = [];
        $drawer.find('.watchers img').each(function(idx, el) {
          return watchers.push($(el).attr('title'));
        });
        if (!watchers.length) {
          return;
        }
        return $(this).parent().append("<div class=\"watcher-names\">\n	Your comment will be emailed to: " + (watchers.join(', ')) + "\n</div>");
      });
    }
  };

  injectScript = function() {
    var binder, injectedScript,
      _this = this;
    binder = function() {
      var eacEvent;
      eacEvent = document.createEvent('Event');
      eacEvent.initEvent('extensionAjaxComplete', true, true);
      return jQuery(document).ajaxComplete(function(event, req, settings) {
        return document.body.dispatchEvent(eacEvent);
      });
    };
    injectedScript = document.createElement('script');
    injectedScript.type = 'text/javascript';
    injectedScript.text = '(' + binder + ')("");';
    return (document.body || document.head).appendChild(injectedScript);
  };

  $(document).ready(function() {
    Eureka.init();
    return injectScript();
  });

  $(document).on('page:load', function() {
    return Eureka.init();
  });

}).call(this);
