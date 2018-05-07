<template>
    <g>
      <Task
        v-for="(item, index) in items" :key="item.id +'-' + index "
        :timeWidth="timeWidth"
        :calcOffWidth="calcOffWidth"
        :datum="getItemStyle(start + index)" :task="item" :readOnly="readOnly" :calcStartx="calcStartx" />
    </g>

</template>

<script>
import Task from "./Task";
export default {
  name: "XAxis",
  props: {
    start: { type: Number },
    stop: { type: Number },
    datas: { type: Array },
    getItemStyle: { type: Function },
    readOnly: { type: Boolean },
    calcStartx: { type: Function },
    timeWidth: { type: Function },
    calcOffWidth: { type: Function },
    proption: {type: String | Number}
  },
  components: { Task },
  data: function() {
    return {};
  },
  computed: {
    items: function() {
      const { start, stop, datas } = this;
      const items = datas.slice(start, stop);
      return items;
    }
  },
  updated: function() {
    // console.log("xasis - updated");
  }
};
</script>
