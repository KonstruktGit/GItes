CC.recorder = function() {
	console.log("%cRecorder Initialized", "color: green");
	var _this = this,
		notes_pressed = [];

	this.registry.recording = false;
	this.registry.recorded_notes = [];
	
	this.func.onEvent("noteOn", function(data) {
		notes_pressed.push(data.noteNumber);
	});

	this.func.onEvent("noteOff", function(data) {
		if (_this.registry.recording) {
			_this.registry.recorded_notes.push(notes_pressed.slice());
		}
		notes_pressed.splice(notes_pressed.indexOf(data.noteNumber), 1);
	});

	this.func.onEvent("startRecording", function(data) {
		console.log("Recording Started...")
		_this.registry.recording = true;
	});

	this.func.onEvent("stopRecording", function(data) {
		console.log("Recording Stopped.");
		_this.registry.recording = false;
	});
};
