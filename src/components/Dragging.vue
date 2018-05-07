<script>

export default {
  name: "Dragging",
  props: {
    startPercent: {
      type: Number,
      required: true
    },
    percent: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    onChange: {
      type: Function,
      default: (...args) => {}
    }
  },
  methods: {
    handleDragging: function(direction, ...rest) {
      switch (direction) {
        case "left":
          return this.leftDragging.apply(this, rest);
        case "right":
          return this.rightDragging.apply(this, rest);
        default:
          return this.moving.apply(this, rest);
      }
    },
    leftDragging: function(delta) {
      // 改变了  startPercent, percent
      const { startPercent, percent, width } = this;
      let startX = startPercent * width;
      if (delta < 0 && startPercent <= 0) {
        return;
      } else if (delta > 0 && percent <= 0) {
        return;
      }
      const totalPercent = startPercent + percent;
      const totalWidth = width * totalPercent;
      let newPercent, newStartPercent;
      startX += delta;

      if (startX <= 0) {
        newStartPercent = 0;
        newPercent = totalPercent;
      } else if (startX >= totalWidth) {
        newPercent = 0;
        newStartPercent = totalPercent;
      } else {
        newStartPercent = (startX / width).toFixed(6) * 1;
        newPercent = (totalPercent - newStartPercent).toFixed(6) * 1;
      }
      const result = { startPercent: newStartPercent, percent: newPercent };
      this.onChange(result);
      this.$emit("dragging-change", result);
    },
    rightDragging: function(delta) {
      const { startPercent, percent, width } = this;
      // 改变的了percent
      const totalPercent = startPercent + percent;
      const startPercentWidth = startPercent * width
      const restWidth = (1 - totalPercent) * width;
      const percentWidth = percent * width;
      let newPercentWidth = percentWidth + delta;
      let newPercent = percent;
      if (newPercentWidth <= 0) {
        newPercent = 0;
      } else if (newPercentWidth + startPercentWidth >= width) {
        newPercent = 1 - startPercent;
      } else {
        newPercent = (newPercentWidth / width).toFixed(6) * 1;
      }
      this.onChange({
        startPercent,
        percent: newPercent
      });
    },
    moving: function(delta) {
      // 改变 startPercent
      const { startPercent, percent, width } = this;
      const percentWidth = percent * width;
      let startPercentWidth = width * startPercent + delta;
      let newStartPercent = startPercent;

      if (startPercentWidth <= 0) {
        newStartPercent = 0;
      } else if (startPercentWidth + percentWidth >= width) {
        newStartPercent = 1 - percent;
      } else {
        newStartPercent = (startPercentWidth / width).toFixed(6) * 1;
      }
      this.onChange({
        startPercent: newStartPercent,
        percent
      });
    },
  },
    render() {
      const result = this.$scopedSlots.default({handleDragging: this.handleDragging})
      return result[0]
    }
};

</script>
