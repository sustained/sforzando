<template>
  <div class="keyboard" :style="style">
    <ul>
      <li
        v-for="(key, index) in keys"
        :key="index"
        :style="key.style"
        :class="[...key.class, {active: noteActive(key.name)}]"
        @mouseover="$emit('hover', key.name)"
        @click="$emit('click', key.name)"
      >
        <span v-show="showNoteNames">{{ key.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { clamp } from "@/library/math"
import pianoState from "@/library/piano-state"

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
    showNoteNames: {
      type: Boolean,
      default() {
        return false
      }
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
    noteActive(note) {
      return pianoState[note] === true
    },

    calculateOctave(n) {
      return (
        Math.floor(n / NUM_WHITE_KEYS_PER_OCTAVE) +
        Math.max(MIN_OCTAVE, this.offsets.octaveStart)
      )
    }
  },

  computed: {
    pianoState() {
      return pianoState
    },

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

<style scoped>
body,
ul {
  margin: 0;
  padding: 0;
}

.keyboard {
  width: 100%;
  height: calc(260px - calc(var(--octaves) * 10px));
  overflow-x: hidden;
  border-bottom: 1px solid black;
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
  position: relative;
  text-align: center;
  background-color: white;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 0.25rem;
  font-weight: bold;
}

li span {
  pointer-events: none !important;
}

li.black span {
  transform: rotate(90deg);
  transform-origin: center 50%;
  margin-bottom: 0.75rem;
}

.white {
  background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%);
  border-top: 1px solid #777;
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  grid-row: 1 / span 3;
  z-index: 2;
}

.white.active {
  border-bottom: 4px solid rgba(0, 0, 0, 0.85);
}

.black {
  grid-row: 1 / span 2;
  background: linear-gradient(45deg, #222 0%, #555 100%);
  border-radius: 0 0 3px 3px;
  /* border: 1px solid #000; */
  /* box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -5px 2px 3px rgba(0, 0, 0, 0.3) inset, 0 2px 4px rgba(0, 0, 0, 0.4); */
  color: white;
  z-index: 3;
}

.black:active {
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to right, #444 0%, #222 100%);
}

/*
.white.active::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 216px 5px 0px;
    border-style: solid;
    border-color: transparent transparent transparent rgba(0,0,0,0.1);
    position: absolute;
    left: 0px;
    top: 0px;
}

.white.active::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 216px 5px 0px;
    border-style: solid;
    border-color: transparent transparent transparent rgba(0,0,0,0.1);
    position: absolute;
    right: 0px;
    top: 0px;
}
*/

.blank {
  border-width: 0;
  grid-row: 1 / span 2;
}

li {
  transition: all 0.2s ease-out;
}

.Fs.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(174, 0, 0) 200%
  );
}
.G.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(255, 0, 0) 200%
  );
}
.Gs.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(255, 0, 0) 200%
  );
}
.A.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(255, 102, 0) 200%
  );
}
.As.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(255, 239, 0) 200%
  );
}
.B.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(153, 255, 0) 200%
  );
}
.C.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(0, 40, 255) 200%
  );
}
.Cs.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(0, 255, 242) 200%
  );
}
.D.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(0, 122, 255) 200%
  );
}
.Ds.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(5, 0, 255) 200%
  );
}
.E.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(71, 0, 237) 200%
  );
}
.F.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgb(99, 0, 178) 200%
  );
}
</style>
