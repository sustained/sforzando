import Vue from "vue"
import { createRange } from "./music"

const notes = createRange("A0", "C8").reduce((map, note) => {
  map[note.name] = false
  return map
}, {})

export default new Vue.observable(notes)
