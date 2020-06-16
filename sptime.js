(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.SPTime = {}));
}(this, function (exports) {
	//SETUP STUFF
	if (Object.assign === undefined) {
		(function() {
			Object.assign = function(target) {
				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}
				var output = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source !== undefined && source !== null) {
						for (var nextKey in source) {
							if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}
				return output;
			};
		})();
	}
	function msToTime(duration) {
		var milliseconds = parseInt((duration % 1000) / 100),
			seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}

	function Stopwatch() {
		this.time = 0;
		this.startTime = null;
		this.endTime = null;
	}
	Object.assign(Stopwatch.prototype, {
		getTime: function(toHMS) {
			return toHMS === true ? msToTime(this.time) : this.time;
		},
		start: function() {
			this.time = 0;
			this.startTime = Date.now();
		},
		stop: function() {
			this.endTime = Date.now();
			this.time = this.endTime - this.startTime;
		}
	});

	function LapStopwatch() {
		this.time = 0;
		this.startTime = null;
		this.endTime = null;
		this.laps = [];
	}
	Object.assign(LapStopwatch.prototype, {
		getTime: function(toHMS) {
			return toHMS === true ? msToTime(this.time) : this.time;
		},
		getLap: function(n, toHMS) {
			return toHMS === true ? msToTime(this.laps[n]) : this.laps[n];
		},
		resetLaps: function() {
			this.laps = [];
		},
		start: function() {
			this.time = 0;
			this.startTime = Date.now();
		},
		stop: function() {
			this.endTime = Date.now();
		},
		lap: function() {
			this.laps.push(Date.now());
		}
	});

	function PauseableStopwatch() {
		this.time = 0;
		this.startTime = null;
		this.endTime = null;
		this.started = false;
		this.paused = false;
		this.pausedTime = 0;
		this.pausedStart = null;
		this.pausedEnd = null;
	}
	Object.assign(PauseableStopwatch.prototype, {
		getTime: function(toHMS) {
			return toHMS === true ? msToTime(this.time) : this.time;
		},
		start: function() {
			this.started = true;
			this.time = 0;
			this.pausedTime = 0;
			this.startTime = Date.now();
		},
		stop: function() {
			this.started = false;
			if (this.paused) {
				this.paused = false;
				this.pausedTime += Date.now() - this.pausedStart;
			}
			this.endTime = Date.now();
			this.time = (this.endTime - this.startTime) - this.pausedTime;
		},
		pause: function() {if (this.started) {
			this.paused = true;
			this.pausedStart = Date.now();
		}},
		continue: function() {if (this.started) {
			this.paused = false;
			this.pausedEnd = Date.now();
			this.pausedTime += this.pausedEnd - this.pausedStart;
		}}
	});

	exports.msToTime = msToTime;

	exports.Stopwatch = Stopwatch;
	exports.LapStopwatch = LapStopwatch;
	exports.PauseableStopwatch = PauseableStopwatch;

	Object.defineProperty(exports, '__esModule', {value: true});
}));