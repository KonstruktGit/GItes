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

	/** Recording UI **/
	this.func.onEvent("startRecording", function(data) {
		$(".cc-project").addClass("cc-recording");
	});

	this.func.onEvent("stopRecording", function(data) {
		$(".cc-project").removeClass("cc-recording");
	});

	/** Load Song **/
	$(document).on('click', '#cc-loadSongBtn', function(event) {
		event.preventDefault();
		_this.func.triggerEvent('loadSong');
	});

};
