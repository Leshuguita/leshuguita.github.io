const audio = new Audio('./audio/both.ogg');

const Conductor = {
	startOffset: 0,	// Start offset in frames
	bpm: 162,
	offBeat: false,
	lastOffBeat: false,
	get crotchet() {
		return 3600/this.bpm;	//Frames per beat
	},
	get songPosition() {
		return audio.currentTime*60 - this.startOffset;	//Song position in frames
	}
};