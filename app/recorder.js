CC.recorder = function() {
	console.log("%cRecorder Initialized", "color: green");
	var _this = this,
		recording = false;
		notes_pressed = [];

	this.registry.recorded_notes = [];
	
	this.func.onEvent("noteOn", function(data) {
		notes_pressed.push(data.noteNumber);
	});

	this.func.onEvent("noteOff", function(data) {
		if (recording) {
			_this.registry.recorded_notes.push(notes_pressed.slice());
		}
		notes_pressed.splice(notes_pressed.indexOf(data.noteNumber), 1);
	});
};