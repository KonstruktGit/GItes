var CC = {
	init: function() {
		// Constructor
		this.midi(); // enable MIDI listener
		this.recorder(); // enable Recording System
	},
	func: {
		triggerEvent: function(event, detail) {
			var event = new CustomEvent(event,{
				detail: detail,
				bubbles: true,
				cancelable: true
			});
			window.dispatchEvent(event);
		},
		onEvent: function(event_name, callback) {
			window.addEventListener(event_name, function(data) {
				callback(data.detail);
			});
		},
		error: function(str) {
			console.error(str);
		}
	},
	registry: {}
};