(function() {
  var $, injectScript;

  $ = jQuery;

  window.Eureka = {
    init: function() {
      this.addNavAttrs();
      this.buildBetterNav();
      this.addSearchButton();
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
      $moreItems = $("<li id=\"nav-more-items\">\n	<a href=\"javascript:void(0)\" class=\"toggle\">\n		More items\n	</a>\n	<div class=\"nav-items\">\n\n	</div>\n</li>");
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
    addSearchButton: function() {
      $('.nav.right-nav li').first().after("<li class=\"secondary\" id=\"search-toggle\">\n	<a href=\"javascript:void(0)\">\n		<i class=\"icon-search\"></i>\n	</a>\n</li>");
      return $('#search-toggle').on('click', function() {
        var $nav;
        $nav = $('.navbar-search');
        $nav.toggleClass('show');
        if ($nav.hasClass('show')) {
          return $nav.find('input').focus();
        }
      });
    },
    handleFeatureBoard: function() {
      var $popover, fixTags, hideReleases, releasesToHide, storageId;
      if (!$('.project-board-container').length) {
        return;
      }
      storageId = 'hidden-releases';
      releasesToHide = JSON.parse(localStorage.getItem(storageId));
      if (!releasesToHide) {
        releasesToHide = [];
      }
      $('.project-board-controls .filter-control').after("<span class=\"hide-control\">\n	<span class=\"result\">\n		Hiding <span id=\"release-hide-count\">0</span> Releases\n	</span>\n	<a id=\"hide-control-btn\" href=\"javascript:;\" class=\"btn btn-mini btn-primary\">\n		<i class=\"icon-eye-open\"></i>\n	</a>\n</span>");
      $popover = $("<div id=\"hide-popover\" class=\"popover feature-hide-popover bottom\">\n	<div class=\"arrow tooltip-arrow\"></div>\n	<div class=\"popover-inner\">\n		<div class=\"popover-content\">\n			<h4>Show the following releases</h4>\n			<div class=\"releases\"></div>\n			<a id=\"save-hide-control\" class=\"btn btn-primary\">Save</a>\n			<a id=\"reset-hide-control\" class=\"btn btn-default\">Reset</a>\n		</div>\n	</div>\n</div>");
      $('.project-board-scroller .release').each(function(idx, el) {
        var $release, releaseId, releaseTitle;
        $release = $(el);
        releaseId = $release.data('release-id');
        releaseTitle = $release.find('.heading a').first().html();
        $popover.find('.releases').append("<div class=\"release\">\n	<input\n		id=\"hide-release-" + releaseId + "\"\n		data-release-id=\"" + releaseId + "\"\n		type=\"checkbox\"\n		name=\"hide-releases\"\n		checked=\"checked\">\n	</input>\n	<label for=\"hide-release-" + releaseId + "\">" + releaseTitle + "</label>\n</div>");
        if ($.inArray(releaseId, releasesToHide) !== -1) {
          return $popover.find("#hide-release-" + releaseId).attr('checked', false);
        }
      });
      $('body').append($popover);
      $('#hide-control-btn').on('click', function() {
        var offset;
        offset = $(this).offset();
        $popover.toggle();
        return $popover.css({
          top: offset.top + 30,
          left: offset.left + $(this).width()
        });
      });
      $('#save-hide-control').on('click', function() {
        releasesToHide = [];
        $('#hide-popover input:not(:checked)').each(function(idx, el) {
          return releasesToHide.push($(el).data('release-id'));
        });
        localStorage.setItem(storageId, JSON.stringify(releasesToHide));
        hideReleases();
        return $('#hide-control-btn').trigger('click');
      });
      $('#reset-hide-control').on('click', function() {
        $popover.find('input').each(function() {
          console.log(this);
          return this.checked = true;
        });
        return $('#save-hide-control').trigger('click');
      });
      fixTags = function() {
        return $('.project-board-container .rendered-multi-select li').each((function(_this) {
          return function(idx, el) {
            if ($(el).html() === '&nbsp;') {
              return $(el).remove();
            }
          };
        })(this));
      };
      hideReleases = function() {
        var newWidth;
        releasesToHide = JSON.parse(localStorage.getItem(storageId));
        if (!releasesToHide) {
          return;
        }
        newWidth = 0;
        return $('.project-board-scroller .release').each(function(idx, el) {
          var $release, releaseId;
          $release = $(el);
          releaseId = $release.data('release-id');
          if ($.inArray(releaseId, releasesToHide) !== -1) {
            $release.hide();
          } else {
            $release.show();
            newWidth += $release.outerWidth(true);
          }
          $('.project-board-scroller .project-board').width(newWidth + 20);
          return $('#release-hide-count').html(releasesToHide.length);
        });
      };
      fixTags();
      hideReleases();
      document.body.removeEventListener('extensionAjaxComplete');
      return document.body.addEventListener('extensionAjaxComplete', function() {
        hideReleases();
        return fixTags();
      });
    }
  };

  injectScript = function() {
    var binder, injectedScript;
    binder = (function(_this) {
      return function() {
        var eacEvent;
        eacEvent = document.createEvent('Event');
        eacEvent.initEvent('extensionAjaxComplete', true, true);
        return jQuery(document).ajaxComplete(function(event, req, settings) {
          return document.body.dispatchEvent(eacEvent);
        });
      };
    })(this);
    injectedScript = document.createElement('script');
    injectedScript.type = 'text/javascript';
    injectedScript.text = '(' + binder + ')("");';
    return (document.body || document.head).appendChild(injectedScript);
  };

  $(document).ready((function(_this) {
    return function() {
      Eureka.init();
      return injectScript();
    };
  })(this));

  $(document).on('page:load', (function(_this) {
    return function() {
      return Eureka.init();
    };
  })(this));

}).call(this);
