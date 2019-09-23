<template>
  <div>
    <svg :width="diameter" :height="diameter" transform="rotate(-105) translate(-0.5, -0.5)">
      <path
        v-for="(segment, index) in segments"
        :key="index"
        stroke="#fff"
        :fill="colours[index]"
        stroke-width="2"
        :d="segment.path"
        :transform="segment.transform"
        shape-rendering="auto"
      />
    </svg>
  </div>
</template>

<script>
import { degreesToRadians, polarToCartesian } from "@/library/math"

export default {
  props: {
    radius: {
      type: Number,
      default() {
        return 250
      }
    }
  },

  data() {
    return {
      numSegments: 12,
      segments: [],
      colours: [
        "#FE0001", // C
        "#FF7F00", // G
        "#FFFD01", // D
        "#33CC32", // A
        "#C1F2FE", // E
        "#8ECAFF", // B
        "#7F89FD", // F# / Gb
        "#9023FF", // Db
        "#BB75FC", // Ab
        "#B7468B", // Eb
        "#A8677B", // Bb
        "#AB0034" // F
      ]
    }
  },

  created() {
    this.segments = new Array(this.numSegments)
      .fill()
      .map((_, i) => this.computeSegmentPath(i))
  },

  computed: {
    diameter() {
      return this.radius * 2
    },

    segmentSizeDegrees() {
      return 360 / this.numSegments
    }
  },

  methods: {
    degsToRads(angleDegs) {
      const { radius } = this

      const angleRads = (-angleDegs * Math.PI) / 180.0
      const x = radius + radius * Math.cos(angleRads)
      const y = radius + radius * Math.sin(angleRads)

      return [x, y]
    },

    computeSegmentPath(i) {
      const { radius, diameter, numSegments } = this

      const angleDegs = this.segmentSizeDegrees * (i + 1)
      const angleRads = degreesToRadians(this.segmentSizeDegrees) // angleDegs

      const arcTo = polarToCartesian(radius, angleRads)

      const path = [
        `M${radius},${radius}`,
        `l${radius},0`,
        `A${radius},${radius} 0 0,0 ${arcTo[0]},${arcTo[1]}`,
        "z"
      ].join(" ")

      const transform = `rotate(${angleDegs} ${radius} ${radius})`

      return { path, transform }
    }
  }
}
</script>

<style scoped>
svg {
  /* transform: translate(0.5px, 0.5px); */
}
</style>
