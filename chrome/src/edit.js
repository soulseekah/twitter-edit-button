var TwitterEditButton = function() {
	var self = this;

	/** Initialize */
	self.init = function() {
		/** Check expected environment */
		if ( !jQuery( '.home-tweet-box' ) )
			return; /** Not logged in */

		/** Inject edit buttons when requested */
		jQuery( '#timeline' ).delegate( '.my-tweet', 'mouseover', function( e ) {
			self.inject_edit_button( e.currentTarget );
		} );
	}

	/** Adds an edit button next to the delete button */
	self.inject_edit_button = function( e ) {

		/** End if already exists */
		if ( jQuery( e ).find( '.action-edit-container' ).length )
			return;

		/** Build a button up */
		var delete_action = jQuery( e ).find( '.action-del-container' );
		var edit_action_container = jQuery( '<li></li>' );
		edit_action_container.addClass( 'action-edit-container' );
		var edit_action = jQuery( '<a></a>' );
		edit_action.attr( 'role', 'button' );
		edit_action.addClass( 'with-icn js-action-edit js-tooltip' );
		edit_action.attr( 'href', '#' );
		edit_action.append( '<span class="icon sm-edit"></span>' );
		edit_action.append( '<b>Edit</b>' );
		edit_action.bind( 'click', self.edit );
		edit_action_container.append( edit_action );
		delete_action.before( edit_action_container );
	}

	/** An edit action */
	self.edit = function( e ) {

		/**
			FIXME: there are issues with real clicks due to isolation
			we aren't able to trigger( 'click' ) the delete buttons
			inside this callback, at least I wasn't...
			A less robust approach is to the API calls ourselves, meh.
		*/

		if ( !confirm( 'Are you sure you want this off and edited?' ) )
			return; /** Changed you mind, huh? */

		/** Retrive and and expand the text */
		var text = jQuery( e.currentTarget ).parents( '.my-tweet' ).find( '.tweet-text' );
		var input = jQuery( '.home-tweet-box .tweet-box' );

		/** And delete the old one */
		var destroy = jQuery.post( '/i/tweet/destroy', {
			'_method': 'DELETE',
			'id': jQuery( e.currentTarget ).parents( '.my-tweet' ).attr( 'data-tweet-id' ),
			'authenticity_token': jQuery ( '.authenticity_token' ).val()
		}, null, 'json' ).done( function() {
			jQuery( e.currentTarget ).parents( '.my-tweet' ).fadeOut();

			/** Type its text in for redaction */
			input.trigger( 'focus' );
			input.find( 'div' ).text( text.text().trim() );
		} );

		e.preventDefault();
	}
}

var edit = new TwitterEditButton();
edit.init();
