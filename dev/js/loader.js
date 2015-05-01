CC.loader = function() {
	var _this = this;

	this.func.onEvent("loadSong", function(data) {
		console.log("Load Song");
	});
};
