$ = jQuery

window.Eureka = {

	init: ->
		@addNavClasses()
		@buildMoreNav()
		@handleFeatureBoard()
		
		$('body').addClass('eureka-loaded')

	# Adds classes to the navigation for styling.
	addNavClasses: ->
		$('.top_nav ul li').each((idx, el) ->
			$el = $(el)
			if $el.find('.nav-title').length
				id = $el.find('.nav-title').html()
				if id
					$el.addClass('primary')
			else
				id = $el.find('a').html()
				if id
					$el.addClass('secondary')

			
			if id
				$el.attr('id', 'nav-' + id.trim().toLowerCase().replace(' ', '-'))
		)

	# Moves good navigation to top level items, bad navigation to extras menu
	buildMoreNav: ->
		# Organize nav data
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

		$('ul.nav:not(.right-nav)').append($moreItems)
		
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

