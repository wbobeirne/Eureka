$ = jQuery

window.Eureka = {

	init: ->
		# Add these classes first to make things easier to reference
		@addNavAttrs()

		# Handle adding markup / binding events
		@buildBetterNav()
		@handleFeatureBoard()
		@handleFeatureDrawer()

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
					<span class="nav-title">More items</span>
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

	# Handles the display at products/*/feature_cards
	handleFeatureBoard: ->
		return if !$('.project-board-container').length

		# Initialize local storage
		storageId = 'expanded-releases'
		expandedReleases = JSON.parse(localStorage.getItem(storageId))
		if !expandedReleases
			expandedReleases = []

		# Add a spot to place expanded releases
		$('.project-board, .parking-lot-board').prepend('<div class="expanded-feature-container">')

		# Define a private function for rebuilding release markup
		buildRelease = ($release) ->
			$release.addClass('collapsed')

			# Add expand buttons to the releases
			$release.find('.inner').append("""
				<a href="javascript:void(0)" class="expand-btn">Expand</a>
				<a href="javascript:void(0)" class="collapse-btn">
					<i class="icon-remove"></i>
				</a>
			""")
			$release.find('.expand-btn').on('click', ->
				$release.parent()
					.find('.expanded-feature-container')
					.addClass('has-releases')
					.append($release)
				$release.addClass('expanded').removeClass('collapsed')

				expandedReleases.push($release.data('release-id'))
				localStorage.setItem(storageId, JSON.stringify(expandedReleases))
			)
			$release.find('.collapse-btn').on('click', ->
				$release = $(this).closest('.release')
				$release.parent().parent().append($release)
				$release.removeClass('expanded').addClass('collapsed')

				remainingReleases = []
				releaseId = $release.data('release-id')
				for id, i in expandedReleases
					if id != releaseId
						remainingReleases.push(id)
				expandedReleases = remainingReleases
				localStorage.setItem(storageId, JSON.stringify(expandedReleases))
			)

			# Expand if it's in the list
			if expandedReleases.indexOf($release.data('release-id')) != -1
				$release.find('.expand-btn').click()

			# hover state for expand button
			$release.find('.expand-btn').on('mouseenter', ->
				$(@).closest('.release').addClass('expand-hover')
			).on('mouseleave', ->
				$(@).closest('.release').removeClass('expand-hover')
			)

			$release.addClass('initialized')


		# Build all the releases initially
		$('.project-board-container .release').each((idx, el) ->
			buildRelease($(el))
		)
		# Listen in on AJAX requests. Rebuild releases as needed.
		document.body.removeEventListener('extensionAjaxComplete')
		document.body.addEventListener('extensionAjaxComplete', ->
			$('.project-board-container .release:not(.initialized)').each((idx, el) =>
				buildRelease($(el))
			)
		)


	# Make adjustments to the drawer
	handleFeatureDrawer: ->
		$drawer = $('#workspace .drawer')
		return if !$drawer.length

		# Show who gets sent a comment
		$drawer.on('click', '.comment .user-content', ->
			return if $drawer.find('.watcher-names').length

			# Build a list of watcher names
			watchers = []
			$drawer.find('.watchers img').each((idx, el) =>
				watchers.push($(el).attr('title'))
			)

			# Insert them beside the submit button
			return if !watchers.length
			$(this).parent().append("""
				<div class="watcher-names">
					Your comment will be emailed to: #{watchers.join(', ')}
				</div>
			""")
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

