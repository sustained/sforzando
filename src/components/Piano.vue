<template>
  <div class="keyboard" :style="style">
    <ul>
      <li v-for="(key, index) in keys" :key="index" :style="key.style" :class="key.class">
        <span @click="playNote(key)">{{ key.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { clamp } from "@/library/math"

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"]
const BLACK_KEYS = ["C#", "D#", null, "F#", "G#", "A#", null]
const NOTE_OFFSETS = ["C", "D", "E", "F", "G", "A", "B"]
const NUM_WHITE_KEYS_PER_OCTAVE = 7
const NUM_BLACK_KEYS_PER_OCTAVE = 5
const NUM_WHITE_KEYS_TOTAL = 52
const NUM_BLACK_KEYS_TOTAL = 36
const MIN_OCTAVE = 0
const MAX_OCTAVE = 8
const MIN_NOTE = 0
const MAX_NOTE = 6

export default {
  props: {
    activeNote: {
      type: String
    },

    octaveStart: {
      type: Number,
      validator(value) {
        return value >= MIN_OCTAVE && value <= MAX_OCTAVE
      },
      default() {
        return MIN_OCTAVE
      }
    },

    octaveEnd: {
      type: Number,
      validator(value) {
        return value >= MIN_OCTAVE && value <= MAX_OCTAVE
      },
      default() {
        return MAX_OCTAVE
      }
    },

    noteStart: {
      type: [Number, String],
      validator(value) {
        if (typeof value === "string") {
          return WHITE_KEYS.includes(value)
        } else {
          return value >= MIN_NOTE && value <= MAX_NOTE
        }
      },
      default() {
        return WHITE_KEYS.indexOf("A")
      }
    },

    noteEnd: {
      type: [Number, String],
      validator(value) {
        if (typeof value === "string") {
          return WHITE_KEYS.includes(value)
        } else {
          return value >= MIN_NOTE && value <= MAX_NOTE
        }
      },
      default() {
        return WHITE_KEYS.indexOf("C")
      }
    }
  },

  created() {
    if (typeof this.noteStart === "string") {
      this.offsets.noteStart = WHITE_KEYS.indexOf(this.noteStart)
    } else {
      this.offsets.noteStart = this.noteStart
    }

    if (typeof this.noteEnd === "string") {
      this.offsets.noteEnd = WHITE_KEYS.indexOf(this.noteEnd)
    } else {
      this.offsets.noteEnd = this.noteEnd
    }

    this.offsets.octaveStart = this.octaveStart
    this.offsets.octaveEnd = this.octaveEnd

    if (
      this.offsets.octaveStart > this.offsets.octaveEnd ||
      (this.offsets.octaveStart === this.offsets.octaveEnd &&
        this.offsets.noteStart > this.offsets.noteEnd)
    ) {
      throw new Error(
        "The start octave must be lower than or equal to the end octave and the start note must be lower than the end note."
      )
    }
  },

  methods: {
    playNote(note) {
      console.log(note)
    }
  },

  data() {
    return {
      offsets: {
        octaveStart: 0,
        octaveEnd: 3,
        noteStart: 0,
        noteEnd: 0
      }
    }
  },

  methods: {
    calculateOctave(n) {
      return (
        Math.floor(n / NUM_WHITE_KEYS_PER_OCTAVE) +
        Math.max(MIN_OCTAVE, this.offsets.octaveStart)
      )
    }
  },

  computed: {
    offsetStart() {
      // if (this.octaveStart === 0 && this.offsets.noteStart < 5) {
      //   return 5
      // }

      return clamp(this.offsets.noteStart, MIN_NOTE, MAX_NOTE)
    },

    offsetEnd() {
      return clamp(this.offsets.noteEnd, MIN_NOTE, MAX_NOTE)
    },

    totalWhiteKeys() {
      return Math.min(
        Infinity, // NUM_WHITE_KEYS_TOTAL,
        this.numOctaves * NUM_WHITE_KEYS_PER_OCTAVE -
          this.offsetStart -
          (NUM_WHITE_KEYS_PER_OCTAVE - (this.offsetEnd + 1))
      )
    },

    totalBlackKeys() {
      return Math.min(
        Infinity, // NUM_BLACK_KEYS_TOTAL,
        this.numOctaves * NUM_BLACK_KEYS_PER_OCTAVE -
          this.offsetStart -
          (NUM_BLACK_KEYS_PER_OCTAVE - (this.offsetEnd + 1))
      )
    },

    totalKeys() {
      return this.totalWhiteKeys + this.totalBlackKeys
    },

    numOctaves() {
      return (
        1 +
        (Math.min(MAX_OCTAVE, this.offsets.octaveEnd) -
          Math.max(MIN_OCTAVE, this.offsets.octaveStart))
      )
    },

    style() {
      return {
        "--keys": this.totalWhiteKeys,
        "--octaves": this.numOctaves
      }
    },

    keys() {
      const keys = []

      // White keys.
      for (let i = this.offsetStart, j = 0; j < this.totalWhiteKeys; i++, j++) {
        const octave = this.calculateOctave(i)
        const keyName = WHITE_KEYS[i % 7]

        // Skip < A0
        // if (octave === 0 && WHITE_KEYS.indexOf(keyName) < 5) {
        //   continue
        // }

        const key = {
          name: `${keyName}${octave}`,
          class: ["white", keyName, `${keyName}${octave}`],
          style: {
            "grid-column": `${j === 0 ? 1 : 4 + (j - 1) * 3} / span 3`
          }
        }

        keys.push(key)
      }

      // Black keys.
      for (let i = this.offsetStart, j = 0; j < this.totalWhiteKeys; i++, j++) {
        const octave = this.calculateOctave(i)
        const keyName = BLACK_KEYS[i % 7]

        // Skip E♯ (F) or B♯ (C).
        if (!keyName) {
          continue
        }

        // Skip > C8.
        if (octave >= 8) {
          continue
        }

        const keyNameClass = keyName.replace("#", "s")

        const key = {
          name: `${keyName}${octave}`,
          class: ["black", keyNameClass, `${keyNameClass}${octave}`],
          style: {
            "grid-column": `${j === 0 ? 3 : 6 + (j - 1) * 3} / span 2`
          }
        }

        keys.push(key)
      }

      return keys
    }
  }
}
</script>

<style scpoped>
body,
ul {
  margin: 0;
  padding: 0;
}

.keyboard {
  width: 100vw;
  height: calc(260px - calc(var(--octaves) * 10px));
  overflow-x: hidden;
}

.keyboard ul {
  height: 100%;
  width: 100%;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(calc(var(--keys) * 3), 1fr);
  grid-template-rows: repeat(3, 1fr);
}

li {
  text-align: center;
  background-color: white;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 0.25rem;
  font-weight: bold;
}

li.black span {
  transform: rotate(90deg);
  transform-origin: center 50%;
  margin-bottom: 0.75rem;
}

.white {
  grid-row: 1 / span 3;
  z-index: 2;
}

.black {
  grid-row: 1 / span 2;
  background-color: black;
  color: white;
  z-index: 3;
}

.blank {
  border-width: 0;
  grid-row: 1 / span 2;
}

li {
  transition: background-color 0.2s;
}

.Fs.active {
  background-color: rgb(174, 0, 0);
}
.G.active {
  background-color: rgb(255, 0, 0);
}
.Gs.active {
  background-color: rgb(255, 0, 0);
}
.A.active {
  background-color: rgb(255, 102, 0);
}
.As.active {
  background-color: rgb(255, 239, 0);
}
.B.active {
  background-color: rgb(153, 255, 0);
}
.C.active {
  background-color: rgb(0, 40, 255);
}
.Cs.active {
  background-color: rgb(0, 255, 242);
}
.D.active {
  background-color: rgb(0, 122, 255);
}
.Ds.active {
  background-color: rgb(5, 0, 255);
}
.E.active {
  background-color: rgb(71, 0, 237);
}
.F.active {
  background-color: rgb(99, 0, 178);
}
</style>
