<template>
  <div>
    <div class="virtualize-list">
        
    <VirualizeList :data="datas"
    :containerHeight="chartHeight"
    :dataCount="datas.length"
    >
    <template slot="cell" slot-scope="cell">
      <div :style="cell.getWrapperStyle()" class="svg-container">
          <svg 
          :style="{height: '100%', width: '100px'}"
          class="yaxis-container">
          </svg>
          <XAxis
            :calcStartx="calcStartx"
            :start="cell.start" :stop="cell.stop" :datas="datas" :getItemStyle="cell.getItemStyle"
            :timeWidth="timeWidth"
            :calcOffWidth="calcOffWidth"
            :proption="proption"
            />
      </div>

    </template>
    </VirualizeList>
    </div>
    <div class="graduation"/>
    <div class="slide" />
    <input type="range" max="1" min="0" step="0.01" v-model="proption" >
  </div>
</template>

<script>
import VirualizeList from "./components/VirtualizeList";
import XAxis from "./components/XAxis";
import dayjs from "dayjs";
const dayValueOf = dayjs()
  .add(1, "day")
  .diff(dayjs(), "valueOf"); // 0

const DATE = "2018-4-21, ";
const datas = [
  {
    id: 1, // ...
    name: "哈斯卡", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 0:0", // 微秒
      endTime: "2018-4-21, 6:22" // 微秒
    },
    YAxis: "上路", // 任务名
    highlightPoints: [
      {
        time: DATE + "5:30", // 微秒
        content: "-=-=-=-="
      }
    ],
    avarageValue: 3600000 // 微秒, 该任务平均花费的时间,
  },
  {
    id: 2, // ...
    name: "斧王", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 10:15", // 微秒
      endTime: "2018-4-21, 12:22" // 微秒
    },
    YAxis: "打野", // 任务名
    highlightPoints: [
      {
        time: DATE + "10:30", // 微秒
        onClick: e => {
          e.persist();
          console.log("hello");
        },
        getHighLightProps(data) {
          return {
            style: { cursor: "pointer" }
          };
        }
      }
    ],
    avarageValue: 7100000 // 微秒, 该任务平均花费的时间,
  },

  {
    id: 3, // ...
    name: "敌法师", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 03:15", // 微秒
      endTime: "2018-4-21, 12:22" // 微秒
    },
    YAxis: "FARM", // 任务名
    highlightPoints: [
      {
        time: DATE + "8:30",
        content: "狂战斧" // 微秒
      }
    ],
    avarageValue: 7200000 // 微秒, 该任务平均花费的时间,
  },

  {
    id: 4, // ...
    name: "祈求者", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 17:20", // 微秒
      endTime: "2018-4-21, 22:10" // 微秒
    },
    YAxis: "中路挂机者", // 任务名
    highlightPoints: [
      {
        time: DATE + "20:00",
        content: "A帐" // 微秒
      }
    ],
    avarageValue: 21200000 // 微秒, 该任务平均花费的时间,
  }
];
export default {
  name: "Gantt",
  components: { VirualizeList, XAxis },
  props: {
    datas: {
      type: Array,
      default: function() {
        return datas
          .concat(datas)
          .concat(datas)
          .concat(datas);
      },
      required: false
    },
    chartHeight: {
      type: Number,
      default: 500
    },
    initialProption: {
      type: Number | String,
      default: 0.4
    },
    startPercent: { type: Number, default: 0 },
    date: { type: String, default: "2018-4-21" },
    width: {
      type: Number | String,
      default: 1150
    }
  },
  computed: {
    containerStyle: function() {
      return {
        position: "relative",
        height: this.chartHeight + "px",
        overflow: "auto"
      };
    },
    startX: function() {
      return 100 + "px";
    },
    xAxisWidth: function() {
      return this.width - 100;
    },
    startOfDay: function() {
      return dayjs(this.date)
        .startOf("day")
        .millisecond();
    },
    calcOffWidth: function() {
      let proption = this.proption;
      return this.calcWidth;
    },
    timeWidth: function() {
      let proption = this.proption;
      return (start, stop) => {
        start = dayjs(start).valueOf();
        stop = dayjs(stop).valueOf();
        return this.calcWidth(stop - start);
      };
    }
  },
  data: function() {
    return {
      proption: this.initialProption + ""
    };
  },
  methods: {
    calcWidth: function(width) {
      const result = width / dayValueOf * this.xAxisWidth / this.proption;
      return result;
    },
    handleScroll: function(ev) {
      console.log(ev);
    },
    calcStartx: function(time) {
      return this.timeWidth(this.startOfDay, time);
    }
  }
};
</script>

<style scoped>
.svg-container {
  width: 100%;
}
.svg-container svg {
  height: 100%;
}
</style>

