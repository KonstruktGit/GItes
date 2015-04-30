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

	_this.func.onEvent('cc-error', function(data) {
		$("#cc-alerts").append(modules.alert(data.msg, "danger", true));
	});

};