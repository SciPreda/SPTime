# SPTime
A JavaScript for Timers and Stopwatches.
PLEASE NOTE: the smallest unit of converted time displayable is one-tenth of a second (as in 00:00:00.0, where it is to the right of the decimal point.)
This was an old project I dusted off from my documents.
(Please note: the Timers will come soon, I'm still working on it.)

## NOTES
General Rule: When starting a stopwatch, the `time` property will always reset to 0, therefore you can use the stopwatch multiple times.
Stopwatches listed in the Simple Stopwatches section mainly use `Date.now`.

### STOPWATCHES
- `Stopwatch`: uses two dates from start and end, therefore the `time` property will stay 0 until the stopwatch has been stopped.
- `LapStopwatch`: `Stopwatch` with a lap function.
- `PauseableStopwatch`: `Stopwatch` with a pause function. Pausing before starting will not do anything.
