import { note, transpose } from "@tonaljs/tonal"
import { enharmonic } from "@tonaljs/note"
import { createRange } from "./music"
import { Sampler } from "tone"

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export const INSTRUMENT_BASE_URL = "/audio/samples/"

export const SAMPLE_RANGES = {
  bassElectric: ["A#2", "G5"],
  bassoon: ["A1", "G3"],
  cello: ["A2", "G#4"],
  clarinet: ["A#2", "F#5"],
  contrabass: ["A1", "G#2"],
  flute: ["A3", "E5"],
  frenchHorn: ["A0", "G1"],
  guitarAcoustic: ["A1", "G#3"],
  guitarElectric: ["A2", "F#5"],
  guitarNylon: ["A2", "G#5"],
  harmonium: ["A2", "G#4"],
  harp: ["A2", "G5"],
  organ: ["A1", "F#5"],
  piano: ["A0", "C7"], // TODO: Find alternate samples with full piano range.
  saxophone: ["A3", "G#4"],
  trombone: ["A#0", "G#2"],
  trumpet: ["A2", "G3"],
  tuba: ["A#0", "F2"],
  violin: ["A3", "G6"]
  // xylophone: [] // TODO: Find out why samples are missing or find alternatives.
}

export const INSTRUMENT_NAMES = Object.keys(SAMPLE_RANGES)

export const AVAILABLE_FORMATS = ["mp3", "ogg", "wav"]

export default class Instruments {
  constructor() {
    this.samplers = {}
    this.sampleMaps = {}

    this.generateSampleMaps()
  }

  generateSampleMaps() {
    for (const [instrument, [from, to]] of Object.entries(SAMPLE_RANGES)) {
      this.sampleMaps[instrument] = createRange(from, to).reduce((map, note) => {
        map[note.name] = note.name.replace("#", "s") + ".mp3"
        return map
      }, {})
    }

    return this.sampleMaps
  }

  getSamplerForInstrument(instrument, callback) {
    const sampler = this.samplers[instrument]

    if (!sampler) {
      sampler = createSampler(instrument, callback)
    }

    return sampler
  }

  createSampler(instrument, callback) {
    if (!INSTRUMENT_NAMES.includes(instrument)) {
      throw new Error(`Invalid instrument - ${instrument}.`)
      return
    }

    if (typeof callback !== "function") {
      callback = () => {}
    }

    const sampler = new Sampler(
      this.sampleMaps[instrument],
      () => callback(sampler),
      `${INSTRUMENT_BASE_URL}${instrument}/`
    )
    this.samplers[instrument] = sampler

    return sampler
  }
}
