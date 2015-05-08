$ = jQuery

window.Eureka = {

	init: ->
		# Add these classes first to make things easier to reference
		@addNavAttrs()

		# Handle adding markup / binding events
		@buildBetterNav()
		@addSearchButton()
		@handleFeatureBoard()

		# Mark as loaded
		$('body').addClass('eureka-loaded')

	# Adds classes to the navigation for styling.
	addNavAttrs: ->
		primaryId = null
		$('.top_nav ul li').each((idx, el) ->
			$el = $(el)
			if $el.find('.nav-title').length
				id = $el.find('.nav-title').html()
				if id
					primaryId = id.trim().toLowerCase().replace(' ', '-')
					$el.addClass('primary')
					$el.attr('id', 'nav-' + primaryId)
			else
				id = $el.find('a').html()
				if id
					id = id.trim().toLowerCase().replace(' ', '-')
					$el.addClass('secondary')
					$el.attr('id', 'nav-' + primaryId + '-' + id)
		)

	# Moves good navigation to top level items, bad navigation to extras menu
	buildBetterNav: ->
		# First, create a new nav element so we can hide the old one.
		navItems = [
			{
				text: '<i class="icon-home"></i>'
				href: '/roadmap'
			}
			{
				html: $('.top_nav .nav:not(.right-nav) .dropdown')
			}
			{
				text: '<i class="icon-tasks"></i> My work'
				href: $('#nav-null-my-work a').attr('href')
			}
			{
				text: '<i class="icon-calendar"></i> Releases'
				href: $('#nav-releases-portfolio a').attr('href')
			}
			{
				text: '<i class="icon-lightbulb"></i> Ideas'
				href: $('#nav-ideas-list a').attr('href')
			}
			{
				text: '<i class="icon-th"></i> Features board'
				href: $('#nav-features-board a').attr('href')
			}
			{
				text: '<i class="icon-th-list"></i> Features list'
				href: $('#nav-features-list a').attr('href')
			}
		]
		$oldNav = $('.top_nav .nav:not(.right-nav)')
		$newNav = $('<ul id="site-nav" class="nav">')

		for item in navItems
			if item.html
				$item = item.html
			else
				$item = $("""
					<li class="primary">
						<a href="#{item.href}">#{item.text}</a>
					</li>
				""")
			if window.location.pathname == item.href
				$item.find('a').addClass('current')

			$newNav.append($item)


		# Now, make a new nav that's collapsed that contains everything
		navItems = []
		$('.top_nav li .nav-title').each((idx, el) ->
			$navItem = $(el).closest('li')
			title = el.innerHTML
			link = $navItem.find('a').first().attr('href')
			secondaryItems = []

			$navItem.find('li').each((idx, el) ->
				$subnavItem = $(el)
				secondaryItems.push({
					title: $subnavItem.find('a').html()
					link: $subnavItem.find('a').attr('href')
				})
			)

			navItems.push({
				title: title
				link: link
				subnavs: secondaryItems
			})
		)

		# Re-add to DOM in extras menu
		$moreItems = $("""
			<li id="nav-more-items">
				<a href="javascript:void(0)" class="toggle">
					More items
				</a>
				<div class="nav-items">

				</div>
			</li>
		""")
		$navItems = $moreItems.find('.nav-items')

		for primary in navItems
			$navItems.append("""
				<div class="primary">
					<a href="#{primary.link}">
						<span>#{primary.title}</span>
					</a>
				</div>
			""")

			for secondary in primary.subnavs
				$navItems.append("""
					<div class="secondary">
						<a href="#{secondary.link}">
							<span>#{secondary.title}</span>
						</a>
					</div>
				""")

		$newNav.append($moreItems)
		$oldNav.after($newNav)
		$oldNav.remove()

		# Bind events
		$moreItems.find('.toggle').off('click').on('click', ->
			$moreItems.toggleClass('expanded')
		)

	addSearchButton: ->
		$('.nav.right-nav li').first().after("""
			<li class="secondary" id="search-toggle">
				<a href="javascript:void(0)">
					<i class="icon-search"></i>
				</a>
			</li>
		""")

		$('#search-toggle').on('click', ->
			$nav = $('.navbar-search')
			$nav.toggleClass('show')
			if $nav.hasClass('show')
				$nav.find('input').focus()
		)

	# Handles the display at products/*/feature_cards
	handleFeatureBoard: ->
		return if !$('.project-board-container').length
		storageId = 'hidden-releases'
		releasesToHide = JSON.parse(localStorage.getItem(storageId))
		if !releasesToHide
			releasesToHide = []

		# Set up hidden releases UI
		$('.project-board-controls .filter-control').after("""
			<span class="hide-control">
				<span class="result">
					Hiding <span id="release-hide-count">0</span> Releases
				</span>
				<a id="hide-control-btn" href="javascript:;" class="btn btn-mini btn-primary">
					<i class="icon-eye-open"></i>
				</a>
			</span>
		""")
		$popover = $("""
			<div id="hide-popover" class="popover feature-hide-popover bottom">
				<div class="arrow tooltip-arrow"></div>
				<div class="popover-inner">
					<div class="popover-content">
						<h4>Show the following releases</h4>
						<div class="releases"></div>
						<a id="save-hide-control" class="btn btn-primary">Save</a>
						<a id="reset-hide-control" class="btn btn-default">Reset</a>
					</div>
				</div>
			</div>
		""")
		$('.project-board-scroller .release').each((idx, el) ->
			$release = $(el)
			releaseId = $release.data('release-id')
			releaseTitle = $release.find('.heading a').first().html()
			# Add to popover list
			$popover.find('.releases').append("""
				<div class="release">
					<input
						id="hide-release-#{releaseId}"
						data-release-id="#{releaseId}"
						type="checkbox"
						name="hide-releases"
						checked="checked">
					</input>
					<label for="hide-release-#{releaseId}">#{releaseTitle}</label>
				</div>
			""")
			# Uncheck the ones we're hiding
			if $.inArray(releaseId, releasesToHide) != -1
				$popover.find("#hide-release-#{releaseId}").attr('checked', false)
		)

		# Add popover to dom, bind events.
		$('body').append($popover)
		$('#hide-control-btn').on('click', ->
			offset = $(this).offset()
			$popover.toggle()
			$popover.css({
				top: offset.top + 30
				left: offset.left + $(this).width()
			})
		)
		$('#save-hide-control').on('click', ->
			# Get a list of the releases to hide
			releasesToHide = []
			$('#hide-popover input:not(:checked)').each((idx, el) ->
				releasesToHide.push($(el).data('release-id'))
			)
			localStorage.setItem(storageId, JSON.stringify(releasesToHide))
			hideReleases()
			$('#hide-control-btn').trigger('click')
		)
		$('#reset-hide-control').on('click', ->
			$popover.find('input').each(->
				console.log(this)
				this.checked = true
			)
			$('#save-hide-control').trigger('click')
		)

		# Remove fake placeholder tags
		fixTags = ->
			$('.project-board-container .rendered-multi-select li').each((idx, el) =>
				if $(el).html() == '&nbsp;'
					$(el).remove()
			)

		# Hide the releases that should be hidden
		hideReleases = ->
			releasesToHide = JSON.parse(localStorage.getItem(storageId))
			if !releasesToHide
				return

			newWidth = 0
			$('.project-board-scroller .release').each((idx, el) ->
				$release = $(el)
				releaseId = $release.data('release-id')
				# Hide if it's meant to be hidden
				if $.inArray(releaseId, releasesToHide) != -1
					$release.hide()
				else
					$release.show()
					newWidth += $release.outerWidth(true)
				$('.project-board-scroller .project-board').width(newWidth + 20)
				$('#release-hide-count').html(releasesToHide.length)
			)

		# Run the functions we defined. On AJAX requests, rerun them.
		fixTags()
		hideReleases()
		document.body.removeEventListener('extensionAjaxComplete')
		document.body.addEventListener('extensionAjaxComplete', ->
			hideReleases()
			fixTags()
		)
}


# Injects a script to the page head to allow us to bind custom events that are
# otherwise inaccessible to Chrome extensions.
injectScript = ->
	binder = =>
		eacEvent = document.createEvent('Event')
		eacEvent.initEvent('extensionAjaxComplete', true, true)

		jQuery(document).ajaxComplete((event, req, settings) =>
			document.body.dispatchEvent(eacEvent)
		)

	injectedScript = document.createElement('script')
	injectedScript.type = 'text/javascript'
	injectedScript.text = '(' + binder + ')("");'
	(document.body || document.head).appendChild(injectedScript)

# Run init, or not, based on extension status
$(document).ready( =>
	Eureka.init()
	injectScript()
)
# For turbolinks
$(document).on('page:load', =>
	Eureka.init()
)

