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
