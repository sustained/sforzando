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
export default {
  props: ["active"],

  methods: {
    playNote(note) {
      console.log(note)
    }
  },

  data() {
    return {
      octave: {
        start: 0,
        end: 4,
        startNote: "A",
        endNote: "C"
      },

      noteOffsets: ["C", "D", "E", "F", "G", "A", "B"]
    }
  },

  computed: {
    numOctaves() {
      return this.octave.end - this.octave.start
    },

    style() {
      return {
        "--keys": this.numOctaves * 7 - 4,
        "--octaves": this.numOctaves,
        "--key-width": "105px"
      }
    },

    keys() {
      const keys = []
      const whiteKeys = ["A", "B", "C", "D", "E", "F", "G"]
      const blackKeys = ["A#", null, "C#", "D#", null, "F#", "G#"]

      for (let i = 0; i < this.numOctaves * 7; i++) {
        const octave = Math.floor((i + 5) / 7) + this.octave.start
        const keyName = whiteKeys[i % 7]

        const key = {
          name: `${keyName}${octave}`,
          class: ["white", keyName, `${keyName}${octave}`],
          style: {
            "grid-column": `${i === 0 ? 1 : 4 + (i - 1) * 3} / span 3`
          }
        }

        keys.push(key)
      }

      keys.splice(keys.length - 4, 4)

      for (let i = 0; i < this.numOctaves * 7; i++) {
        const octave = Math.floor((i + 5) / 7) + this.octave.start
        const keyName = blackKeys[i % 7]

        if (keyName) {
          const key = {
            name: `${keyName}${octave}`,
            class: [
              "black",
              keyName.replace("#", "s"),
              `${keyName.replace("#", "s")}${octave}`
            ],
            style: {
              "grid-column": `${i === 0 ? 3 : 6 + (i - 1) * 3} / span 2`
            }
          }

          keys.push(key)
        }
      }

      keys.splice(keys.length - 4, 4)

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
  /* width: var(--key-width); */
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
  margin-bottom: 0.5rem;
}

.white {
  grid-row: 1 / span 3;
  /* grid-column: auto / span 3; */
  z-index: 2;
}

.black {
  grid-row: 1 / span 2;
  /* grid-column: auto / span 2; */
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
