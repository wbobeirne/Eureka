$ = jQuery

window.Eureka = {

	init: ->
		$('body').addClass('eureka-loaded')

		@handleFeatureBoard()


	# Handles the display at products/*/feature_cards
	handleFeatureBoard: ->
		return if !$('.project-board-container').length

		$('.project-board-scroller').off('scroll')
		$('.parking-lot-scroller').off('scroll')
}

# Run init, or not, based on extension status
Eureka.init()
