<template>
  <div :style="{height: '50px', width: '100%'}" class="slide-container">
      <div :style="leftPlaceHolder" />
      <Dragging
        :startPercent="startPercent"
        :percent="percent"
        :width="width"
        :onChange="onChange"
      >
      <template slot-scope="dragging">
          <div class="dragging-container" >
            <Dragger
                :onDragging="(delta) => dragging.handleDragging('left', delta)"
            >
                <template slot-scope="dragger">
                    <div @mousedown="dragger.mousedown" :style="{height: '50px', width: '50px', backgroundColor: 'red'}"/>
                </template>
            </Dragger>
            <Dragger
                :onDragging="(delta) => dragging.handleDragging('moving', delta)"
            >
                <template slot-scope="dragger">
                    <div @mousedown="dragger.mousedown"  :style="[{height: '50px', width: '50px', backgroundColor: 'lightblue'}, sliderStyle]"/>
                </template>
            </Dragger>
             <Dragger
                :onDragging="(delta) => dragging.handleDragging('right', delta)"
            >
                <template slot-scope="dragger">
                    <div @mousedown="dragger.mousedown"  :style="{height: '50px', width: '50px', backgroundColor: 'green'}"/>
                </template>
            </Dragger>
          </div>
      </template>
      </Dragging>
      <div :style="rightPlaceHolder" />
  </div>
</template>

<script>
import Dragging from "./Dragging";
import Dragger from "./Dragger";

export default {
  name: "Slide",
  components: { Dragging, Dragger },
  props: {
    percent: {
      type: Number,
      required: true
    },
    startPercent: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    // onChange: function({ percent, startPercent }) {
    //   console.log(percent, startPercent);
    // }
  },
  computed: {
      rightPlaceHolder: function() {
          return {
              flex: '1'
          }
      },
      leftPlaceHolder: function() {
          const {startPercent, width} = this
          return {
              width: startPercent * width + 'px'
          }
      },
      sliderStyle: function() {
          const { width, percent } = this
          return {
              width: width * percent + 'px'
          }
      }
  }
};
</script>

<style scoped>
.slide-container {
  display: flex;
}

.slide-container > div {
  height: 100%;
}
.dragging-container {
  display: flex;
}
</style>
