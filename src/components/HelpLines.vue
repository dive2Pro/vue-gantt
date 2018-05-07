<template>
  <g>
    <line 
      v-for="col in columns"
      :key="col"
      :x1="x1(col)"
      :x2="x2(col)"
      :y1="y1(col)"
      :y2="y2(col)"
     />
  </g>
</template>

<script>
import { columns } from "./constants.js";

export default {
  name: "HelpRects",
  props: {
    stopY: {
      type: Number,
      required: true
    },
    startY: {
      type: Number,
      required: true
    },
    columnWidth: {
      type: Number,
      required: true
    }
  },
  methods: {
    x1: function(index) {
      return this.columnWidth * index + "px";
    },
    x2: function(index) {
      return this.columnWidth * index + "px";
    },
    y1: function(index) {
      return this.startY + 'px'
    },
    y2: function(index) {
      return this.stopY + 'px'
    }
  },
  computed: {
    columns: function() {
      return columns
    }
  }
};
</script>
<style scoped>

</style>
