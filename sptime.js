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
	exports.usePerformance = false;
	function timenow() {
		if (exports.usePerformance === true) {
			return performance.now();
		}
		return Date.now();
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
			this.startTime = timenow();
		},
		stop: function() {
			this.endTime = timenow();
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
		clearLaps: function() {
			this.laps = [];
		},
		start: function() {
			this.time = 0;
			this.startTime = timenow();
		},
		stop: function() {
			this.endTime = timenow();
		},
		lap: function() {
			this.laps.push(timenow());
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
			this.startTime = timenow();
		},
		stop: function() {
			this.started = false;
			if (this.paused) {
				this.paused = false;
				this.pausedTime += timenow() - this.pausedStart;
			}
			this.endTime = timenow();
			this.time = (this.endTime - this.startTime) - this.pausedTime;
		},
		pause: function() {if (this.started) {
			this.paused = true;
			this.pausedStart = timenow();
		}},
		continue: function() {if (this.started) {
			this.paused = false;
			this.pausedEnd = timenow();
			this.pausedTime += this.pausedEnd - this.pausedStart;
		}}
	});

	function ElementDisplayStopwatch() {
		this.time = 0;
		this.startTime = null;
		this.endTime = null;
	}
	Object.assign(ElementDisplayStopwatch.prototype, {
		getTime: function(toHMS) {
			return toHMS === true ? msToTime(this.time) : this.time;
		},
		project: function(elm, toHMS) {
			var ct = timenow();
			this.time = ct - this.startTime;
			elm.innerHTML = this.getTime(toHMS);
		},
		start: function() {
			this.time = 0;
			this.startTime = timenow();
		},
		stop: function() {
			this.endTime = timenow();
			this.time = this.endTime - this.startTime;
		}
	});

	function Timer(ms, ontimeout) {
		this.time = ms || 1000;
		this.ontimeout = ontimeout || function() {console.log("Timer ended")};
		this.runner = null;
		this.running = false;
	}
	Object.assign(Timer.prototype, {
		start: function() {if (this.running === false) {
			this.running = true;
			this.runner = setTimeout(this.timeout, this.time);
		}},
		stop: function() {if (this.running === true) {
			this.running = false;
			clearTimeout(this.runner);
		}}
	});

	function PausableTimer(ms, ontimeout) {
		this.time = ms || 1000;
		this.dectime = ms || 1000;
		this.ontimeout = ontimeout || function() {console.log("Timer ended")};
		this.runner = null;
		this.running = false;
		this.paused = false;
		this.pausedStart = null;
		this.pausedEnd = null;
	}
	Object.assign(PausableTimer.prototype, {
		start: function() {if (this.running === false) {
			this.running = true;
			this.dectime = this.time;
			this.runner = setTimeout(this.ontimeout, this.time);
		}},
		stop: function() {if (this.running === true) {
			if (this.paused === true) {
				this.continue();
			}
			this.running = false;
			clearTimeout(this.runner);
		}},
		pause: function() {if (this.running === true && this.paused === false) {
			this.paused = true;
			this.pausedStart = timenow();
			clearTimeout(this.runner);
		}},
		continue: function() {if (this.running === true && this.paused === true) {
			this.paused = false;
			this.pausedEnd = timenow();
			var d = this.pausedEnd - this.pausedStart;
			this.dectime -= d;
			this.runner = setTimeout(this.ontimeout, this.dectime);
		}}
	});

	function ElementDisplayTimer(ms, ontimeout) { //min. 10ms
		this.time = ms || 1000;
		this.dectime = ms || 1000;
		this.ontimeout = ontimeout || function() {console.log("Timer ended")};
		this.runner = null;
		this.running = false;
		this.startTime = null;
	}
	Object.assign(ElementDisplayTimer.prototype, {
		start: function() {if (this.running === false) {
			this.running = true;
			this.dectime = this.time;
			this.startTime = timenow();
			this.runner = setTimeout(this.ontimeout, this.time);
		}},
		stop: function() {if (this.running === true) {
			this.running = false;
			clearTimeout(this.runner);
		}},
		project: function(elm, toHMS) {if (this.running === true) {
			var ct = timenow();
			this.dectime = ct - this.startTime;
			var t = toHMS === true ? msToTime(this.time - this.dectime) : this.time - this.dectime;
			if (this.time - this.dectime === 0 || this.time - this.dectime < 0) {
				t = toHMS === true ? msToTime(0) : 0;
			}
			elm.innerHTML = t;
		}}
	});

	exports.msToTime = msToTime;

	exports.Stopwatch = Stopwatch;
	exports.LapStopwatch = LapStopwatch;
	exports.PauseableStopwatch = PauseableStopwatch;
	exports.ElementDisplayStopwatch = ElementDisplayStopwatch;

	exports.Timer = Timer;
	exports.PausableTimer = PausableTimer;
	exports.ElementDisplayTimer = ElementDisplayTimer;

	Object.defineProperty(exports, '__esModule', {value: true});
}));