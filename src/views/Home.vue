<template>
  <div class="home" @click="togglePlayback">
    <piano :octave-start="1" :octave-end="7" />

    <!-- <p>{{ pianoState }}</p> -->
  </div>
</template>

<script>
import Tone, { Buffer, Sequence, Transport, Event, Draw, context } from "tone"
import { Midi } from "@tonejs/midi"
import Piano from "@/components/Piano.vue"
import Instruments from "@/library/instruments"
import pianoState, { reset } from "@/library/piano-state"

export default {
  name: "home",

  data() {
    return {
      music: [
        ["C2", "D#2", "G2", "C3", "G2", "D#2"], // Cm (i)
        ["B1", "D2", "G2", "B2", "G2", "D2"], // G (V)
        ["A#1", "D2", "F2", "A#2", "F2", "D2"], // Bb (VII)
        ["A1", "C2", "F2", "A2", "F2", "C2"], // F (V / VII)
        ["G#1", "C2", "D#2", "G#2", "D#2", "C2"], // Ab (VI)
        ["G1", "C2", "D#2", "G2", "D#2", "C2"], // Cm (i)
        ["F#1", "C2", "D#2", "F#2", "D#2", "C2"], // F#dim7 (vii° / V)
        ["G1", "C2", "D2", "G2", "D2", "B1"] // Gsus4 (?) -> G (V)
      ],
      tempo: 60, // BPM
      playing: false,
      currentNoteIndex: 0
    }
  },

  components: {
    Piano
  },

  methods: {
    togglePlayback() {
      if (this.playing) {
        Transport.pause()
      } else {
        Transport.start()
      }

      this.playing = !this.playing
    }
  },

  created() {
    // Flatten the music... in the non-musical sense. o_O
    this.music = this.music.flat()

    const instruments = new Instruments()

    instruments.createSampler("piano", piano => {
      piano.release = 2
      piano.toMaster()

      /*
      Transport.bpm.value = this.tempo
      Transport.stop()
      Transport.scheduleRepeat(time => {
        piano.triggerAttackRelease(this.activeNote, "8n")

        // This is the awful part.
        Draw.schedule(() => {
          const notes = document.querySelectorAll("li")

          if (notes) {
            for (let i = 0; i < notes.length; i++) {
              notes[i].classList.remove("active")
            }
          }

          document
            .querySelector(`li.${this.previousNote.replace("#", "s")}`)
            .classList.add("active")
        }, time)

        if (++this.currentNoteIndex > this.music.length - 1) {
          this.currentNoteIndex = 0
        }
      }, "8n")
      */

      const now = Tone.now() + 0.5
      Midi.fromUrl("/audio/midi/bach_846.mid")
        .then(midi => {
          midi.tracks.forEach(track => {
            track.notes.forEach(note => {
              Transport.schedule(() => {
                piano.triggerAttackRelease(
                  note.name,
                  note.duration,
                  Tone.now(),
                  note.velocity
                )
              }, note.time + now)

              Transport.schedule(time => {
                Draw.schedule(() => {
                  pianoState[note.name] = true
                }, time)
              }, note.time + now)

              Transport.schedule(time => {
                Draw.schedule(() => {
                  pianoState[note.name] = false
                }, time)
              }, note.time + note.duration + now)
            })
          })
        })
        .catch(console.error)
    })

    Buffer.on("error", error => {
      console.error(error)
    })
  },

  computed: {
    pianoState() {
      return pianoState
    },

    previousNote() {
      let lastNote

      if (this.currentNoteIndex === 0) {
        lastNote = this.music.length - 1
      } else {
        lastNote = Math.max(0, this.currentNoteIndex - 1)
      }

      return this.music[lastNote]
    },

    activeNote() {
      return this.music[this.currentNoteIndex]
    }
  }
}
</script>
