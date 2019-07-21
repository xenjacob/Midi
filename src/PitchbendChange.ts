import { Header } from "./Header";

const privateHeaderMap = new WeakMap<PitchbendChange, Header>();

// convert [0-16383] to [-2,2]
export function PitchbendMIDItoFloat(MSB: number, LSB: number): number {
	return (MSB*128 + LSB) / 16383.0 * 4.0 - 2.0;
}

/**)
 * @typedef PitchbendChangeEvent
 * @property {number=} value
 * @property {number=} absoluteTime
 */


/**
 * Represents a pitch bend change event
 */
export class PitchbendChange implements PitchbendChangeInterface {

	/**
	 * The number value of the pitch bend
	 */
	value: number;

	/**
	 * The tick time of the event
	 */
	ticks: number;

	/**
	 * @param {PitchbendChangeEvent} event
	 * @param {Header} header
	 */
	constructor(event, header: Header) {

		privateHeaderMap.set(this, header);

		this.ticks = event.absoluteTime;
		this.value = event.value;
	}

	/**
	 * The time of the event in seconds
	 */
	get time(): number {
		const header = privateHeaderMap.get(this);
		return header.ticksToSeconds(this.ticks);
	}

	set time(t: number) {
		const header = privateHeaderMap.get(this);
		this.ticks = header.secondsToTicks(t);
	}

	toJSON(): PitchbendChangeJSON {
		return {
			ticks : this.ticks,
			time : this.time,
			value : this.value,
		};
	}
}

export interface PitchbendChangeJSON {
	ticks: number;
	time: number;
	value: number;
}

export interface PitchbendChangeInterface {
	ticks: number;
	time: number;
	value: number;

}