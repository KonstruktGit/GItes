var CC = {
	init: function() {
		// Constructor
		var _this = this;
		$(function() {
			_this.ui(); // initialize UI interaction
			_this.midi(); // initialize MIDI listener
			_this.recorder(); // initialize Recording System
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
CC.loader = function() {
	var _this = this;
};
CC.midi = function() {
	console.log("Initializing MIDI...");
	var midiAccess = null,
		context = null,
		_this = this;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	context = new AudioContext();
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
		console.log("%cMIDI Initialized!", 'color: green');
	} else {
		console.log("%cMIDI Initalization Failed", "color: orange");
		this.func.error("No MIDI support present in your browser.");
	}

	function onMIDIInit(midi) {
		midiAccess = midi;

		var haveAtLeastOneDevice = false;
		var inputs = midiAccess.inputs.values();
		for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
			input.value.onmidimessage = MIDIMessageEventHandler;
			haveAtLeastOneDevice = true;
		}
		if (!haveAtLeastOneDevice) {
			this.func.error("No MIDI Devices Present");
		}
	}

	function onMIDIReject(err) {
		this.func.error(err);
	}

	function MIDIMessageEventHandler(event) {
		// Mask off the lower nibble (MIDI channel, which we don't care about)
		switch (event.data[0] & 0xf0) {
			case 0x90:
				if (event.data[2] != 0) { // If velocity != 0, this is a note-on message
					noteOn(event.data[1]);
					return;
				}
			case 0x80: // If velocity == 0, fall thru: it's a note-off.
				noteOff(event.data[1]);
				return;
		}
	}

	function noteOn(noteNumber) {
		_this.func.triggerEvent("noteOn", {
			noteNumber: noteNumber
		});
	}

	function noteOff(noteNumber) {
		_this.func.triggerEvent("noteOff", {
			noteNumber: noteNumber
		});
	}
};
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
CC.ui = function() {
	var _this = this,
		modules = {
			alert: function(text, type, dismissable) {
				type = type || "warning";
				dismissable = dismissable || false;

				var alert = '<div class="alert alert-'+type;
				if (dismissable) {
					alert += ' alert-dismissable" role="alert">';
					alert += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				} else {
					alert += '" role="alert">';
				}
				alert += text;
				alert += '</div>';
				return alert;
			}
		};

	this.func.onEvent('cc-error', function(data) {
		$("#cc-alerts").append(modules.alert(data.msg, "danger", true));
	});

	$(document).on('click', '#cc-recordBtn', function(event) {
		event.preventDefault();
		_this.func.triggerEvent('startRecording');
		$(this).addClass('hidden');
		$("#cc-stopRecordBtn").removeClass('hidden');
	});

	$(document).on('click', '#cc-stopRecordBtn', function(event) {
		event.preventDefault();
		_this.func.triggerEvent('stopRecording');
		$(this).addClass('hidden');
		$("#cc-recordBtn").removeClass('hidden');
	});

	/** Load Song **/
	$(document).on('click', '#cc-loadSongBtn', function(event) {
		event.preventDefault();
		_this.func.triggerEvent('loadSong');
	});

};
CC.init();
