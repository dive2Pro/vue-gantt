<template>
  <g style="taskStyle" class="task-g">
    <text style="textStyle" :y="textY">
        {{task.name}}
    </text> 
    <rect :style="avarageStyle" :width="avarageWidth" />    
    <rect :style="usedStyle" :width="usedWidth"/>
  </g>
</template>

<script>
export default {
  name: "Task",
  props: {
    readOnly: { type: Boolean, default: false },
    task: { type: Object },
    datum: { type: Object },
    calcStartx: { type: Function },
    timeWidth: { type: Function },
    calcOffWidth: { type: Function }
  },
  data: function data() {
    const { top, height } = this.datum;
    const { usedTime: { startTime, endTime }, avarageValue } = this.task;
    const { calcStartx, timeWidth, calcOffWidth } = this;
    const result = {
      textStyle: {
        y: top + 12 + "px"
      },
      textY: top + 12 + "px",
      avarageStyle: {
        y: top + 16 + "px",
        height: 12 + "px",
        fill: "red"
      },
      usedStyle: {
        y: top + 12 + 18 + "px",
        fill: "green",
        height: `12px`
      },
      taskStyle: { x: this.calcStartx(startTime) + "px", y: top + "px" }
    };
    return result;
  },
  computed: {
    avarageWidth: function() {
      const { calcOffWidth, task: { avarageValue } } = this;
      return calcOffWidth(avarageValue) + "px";
    },
    usedWidth: function() {
      const { timeWidth, task: { usedTime: { startTime, endTime } } } = this;
      return timeWidth(startTime, endTime) + "px";
    }
  },
  beforeMount: function() {},
  created: function() {},
  updated: function() {
    console.log("updated task");
  }
};
</script>

<style scoped>
.task-g {
  font-size: 12px;
}
</style>
