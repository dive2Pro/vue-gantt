class PositionManager {
  constructor({
    dataCount,
    getItemSize,
    estimatedSize
  }) {
    this.dataCount = dataCount;
    this.getItemSize = getItemSize;
    this.estimatedSize = estimatedSize;

    this.lastMeasuredIndex = -1;
    this.dataMeasured = {};
  }

  getLastMeasuredDatum() {
    const last = this.dataMeasured[this.lastMeasuredIndex];
    return (
      last || {
        offset: 0,
        size: 0
      }
    );
  }

  getTotal() {
    // TODO: App 的 data 改变, 这里会被调用
    // console.log(this.lastMeasuredIndex, ' = lastMeasuredIndex')
    return (
      this.getLastMeasuredDatum().offset +
      this.getLastMeasuredDatum().size +
      (this.dataCount - this.lastMeasuredIndex - 1) * this.estimatedSize
    );
  }

  getDatumForIndex(index) {
    if (index > this.lastMeasuredIndex) {

      const lastDatum = this.getLastMeasuredDatum()
      let offset = lastDatum.offset + lastDatum.size
      for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {

        this.dataMeasured[i] = {
          offset,
          size: this.getItemSize(i)
        }
        offset += this.dataMeasured[i].size
      }
      this.lastMeasuredIndex = index
      // console.log(this.dataMeasured)
    }
    
    return this.dataMeasured[index]
  }

  getVisibleRange({
    offset,
    containerHeight
  }) {
    const total = this.getTotal();
    if (total == 0) {
      return {};
    }
    const maxOffset = offset + containerHeight;
    const start = this.getNestestIndexFor(offset);
    const datum = this.getDatumForIndex(start);
    offset = datum.size + datum.offset;
    let stop = start;

    while (offset < maxOffset) {
      stop++;
      offset = offset + this.getDatumForIndex(stop).size;
    }
    // console.log(start, stop , offset, maxOffset)
    return {
      start,
      stop
    };
  }

  getNestestIndexFor(offset) {
    let lastMeasuredIndex = this.lastMeasuredIndex;
    lastMeasuredIndex = Math.max(0, lastMeasuredIndex);
    const lastMeasuredDatum = this.getDatumForIndex(lastMeasuredIndex);

    if (offset <= lastMeasuredDatum.offset) {
      // binarySearch
      return this.binarySearch({
        low: 0,
        high: lastMeasuredIndex,
        offset
      });
    } else {
      // expotentionSearch
      return this.expotentionSearch({
        offset
      });
    }
  }

  expotentionSearch({
    offset
  }) {
    let index = 0,
      inteval = 1,
      currentOffset = 0;

    while (
      index < this.dataCount &&
      this.getDatumForIndex(index).offset < offset
    ) {
      index += inteval;
      inteval *= 2;
    }

    return this.binarySearch({
      low: 0,
      high: index,
      offset
    });
  }
  binarySearch({
    low,
    high,
    offset
  }) {
    let middle, datum;

    while (low < high) {
      middle = low + Math.floor((high - low) / 2);
      datum = this.getDatumForIndex(middle);
      if (offset == datum.offset) {
        return middle;
      }
      if (datum.offset < offset) {
        low = middle + 1;
      } else if (datum.offset > offset) {
        high = middle - 1;
      }
    }
    if (low > 0) {
      return low - 1;
    }
    return 0;
  }
}
export default {
  name: "Virtualize-List",
  props: {
    dataCount: {
      type: Number | String,
      required: true
    },
    containerHeight: {
      type: Number,
      required: true
    },
    estimatedSize: {
      type: Number,
      default: 50
    },
  },
  data: function () {
    return {
      start: 0,
      stop: 0,
      offset: -1 // 也可以从 props 中拿到
    };
  },
  methods: {
    handleScroll: function (ev) {
      const {
        target: {
          scrollTop
        }
      } = ev;
      this.offset = scrollTop
    },
    getItemSize: function (index) {
      return 50
    },
    getItemStyle: function(index) {
      const { offset, size} = this._positionManager.getDatumForIndex(index)
      return {
        position: 'absolute',
        top: offset ,
        height: size
      }
    },
    getWrapperStyle: function(){
      const self = this
      const totalHeight= self._positionManager.getTotal()
      return {...self.wrapperStyle, height: totalHeight + 'px'}
    }
  },
  created: function () {
    this._positionManager = new PositionManager({
      getItemSize: this.getItemSize,
      dataCount: this.dataCount,
      estimatedSize: this.estimatedSize
    });
  },
  mounted: function(){
    this.offset = 0
  } ,
  updated: function() {
    const {offset} = this
    const {
      start,
      stop
    } = this._positionManager.getVisibleRange({
      offset,
      containerHeight: this.containerHeight
    });
    this.start = start;
    this.stop = stop;
  },
  render(h) {
    const self = this
    return <div 
    class="container"
    style={{ height : self.containerHeight + 'px', overflow: 'auto'}}
    on-scroll={self.handleScroll}
  > 
  {
     self.$scopedSlots.cell ? self.$scopedSlots.cell({
      getItemStyle:self.getItemStyle,
      getWrapperStyle: self.getWrapperStyle,
      ...self.$data,
      }): <span>Hello</span>
  }
    </div>
  }
};
