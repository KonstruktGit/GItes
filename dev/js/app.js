var CC = {
	init: function() {
		// Constructor
		var _this = this;
		$(function() {
			_this.ui(); // initialize UI interaction
			_this.midi(); // initialize MIDI listener
			_this.recorder(); // initialize Recording System
			_this.loader(); // initialize Song Loader
		});
	},
	func: (function() {
		var _this = this;
		return {
			triggerEvent: function(event, detail) {
				var event = new CustomEvent(event,{
					detail: detail,
					bubbles: true,
					cancelable: true
				});
				_this.dispatchEvent(event);
			},
			onEvent: function(event_name, callback) {
				_this.addEventListener(event_name, function(data) {
					callback(data.detail);
				});
			},
			error: function(str) {
				this.triggerEvent("cc-error", {
					msg: str
				});
			}
		}
	}()),
	registry: {}
};
