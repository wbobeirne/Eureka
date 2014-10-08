$ = jQuery

window.Eureka = {

	init: ->
		# Add these classes first to make things easier to reference
		@addNavAttrs()

		# Handle adding markup / binding events
		@buildBetterNav()
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

		$('.project-board-scroller').off('scroll')
		$('.parking-lot-scroller').off('scroll')
}

# Run init, or not, based on extension status
$(document).ready( =>
	Eureka.init()
)
# For turbolinks
$(document).on('page:load', =>
	Eureka.init()
)

