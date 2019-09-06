<template>
  <div class="home" @click="togglePlayback">
    <piano :active="activeNote" />
  </div>
</template>

<script>
import {
  Buffer,
  Sequence,
  Transport,
  Event,
  Sampler,
  Draw,
  context
} from "tone";

import HelloWorld from "@/components/HelloWorld.vue";
import PianoOctave from "@/components/PianoOctave.vue";
import Piano from "@/components/Piano.vue";

import Instruments from "@/library/instruments";

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
      samples: [
        ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1"],
        ["G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2"],
        ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3"],
        ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"]
      ],
      currentNoteIndex: 0
    };
  },

  components: {
    Piano
  },

  methods: {
    togglePlayback() {
      if (this.playing) {
        Transport.stop();
      } else {
        Transport.start();
      }

      this.playing = !this.playing;
    }
  },

  created() {
    this.music = this.music.flat(); // Flatten the music... in the non-musical sense. o_O

    const sampleMap = this.samples.flat().reduce((acc, val) => {
      acc[val] = `${val.replace("#", "s")}.mp3`;
      return acc;
    }, {});

    const sampler = new Sampler(
      sampleMap,
      () => {
        sampler.toMaster();

        Transport.bpm.value = this.tempo;
        Transport.scheduleRepeat(time => {
          sampler.triggerAttackRelease(this.activeNote, "8n");

          // This is the awful part.
          Draw.schedule(() => {
            const notes = document.querySelectorAll("li");

            if (notes) {
              for (let i = 0; i < notes.length; i++) {
                notes[i].classList.remove("active");
              }
            }

            document
              .querySelector(`li.${this.previousNote.replace("#", "s")}`)
              .classList.add("active");
          }, time);

          if (++this.currentNoteIndex > this.music.length - 1) {
            this.currentNoteIndex = 0;
          }
        }, "8t");
      },
      "/audio/samples/piano/"
    );

    sampler.release = 2;

    Buffer.on("error", error => {
      console.error(error);
    });
  },

  computed: {
    previousNote() {
      let lastNote;

      if (this.currentNoteIndex === 0) {
        lastNote = this.music.length - 1;
      } else {
        lastNote = Math.max(0, this.currentNoteIndex - 1);
      }

      return this.music[lastNote];
    },

    activeNote() {
      return this.music[this.currentNoteIndex];
    }
  }
};
</script>

<style>
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
