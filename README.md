# SPTime
A JavaScript for Timers and Stopwatches.
PLEASE NOTE: the smallest unit of converted time displayable is one-tenth of a second (as in 00:00:00.0, where it is to the right of the decimal point.)
This was an old project I dusted off from my documents.
(Please note: the Timers will come soon, I'm still working on it.)

## NOTES
General Rule: When starting a stopwatch, the `time` property will always reset to 0, therefore you can use the stopwatch multiple times.
Stopwatches use either `Date.now` or `performance.now`, depending on whether `SPTime.usePerformance` is set to true or false.

### STOPWATCHES
- `Stopwatch`: uses two dates from start and end, therefore the `time` property will stay 0 until the stopwatch has been stopped.
- `LapStopwatch`: `Stopwatch` with a lap function.
- `PauseableStopwatch`: `Stopwatch` with a pause function. Pausing before starting will not do anything.
- `ElementDisplayStopwatch`: a stopwatch used for display on elements. It updates every time `project` is called.

### TIMERS
- `Timer`: `setTimeout` but with the ability to stop if needed.
- `PausableTimer` - `Timer` with a pause function. Pausing before starting will not do anything.
- `ElementDisplayTimer`: a timer used for display on elements. It updates every time `project` is called.

### EXAMPLE USE
Making an `ElementDisplayStopwatch` and then displaying it on a DIV element:
```javascript
var div = document.getElementById("stopwatchdisplay");
var s = new SPTime.ElementDisplayStopwatch();
s.start();
setInterval(function(){
	s.project(div, true);
}, 10);
```
