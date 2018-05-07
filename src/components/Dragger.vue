

<script>
const noop = () => {};
export default {
  name: "Dragger",
  data: function() {
    return {
      dragging: false,
      startX: null
    };
  },
  props: {
    onDragging: {
      type: Function,
      default: noop
    },
    onDragStateChange: {
      type: Function,
      default: noop
    },
    onDragEnd: {
      type: Function,
      default: noop
    }
  },
  methods: {
    mousedown: function(ev) {
      const { clientX } = ev;
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      if (this.dragging == false) {
        this.dragging = true;
      }
      this.startX = clientX;
      this.onDragStateChange(true);
      document.addEventListener("mousemove", this.mousemove, false);
      document.addEventListener("mouseup", this.mouseup, false);
    },
    mousemove: function(ev) {
      if (!this.dragging) {
        return;
      }
      if (this.startX == 0) {
        console.warn("startx = 0");
      }
      const { clientX } = ev;
      const deltaX = clientX - this.startX;
      this.onDragging(deltaX);
      this.startX = clientX;
    },
    mouseup: function(ev) {
      if (!this.dragging) {
        return;
      }
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "initial";
      const { target: { clientX } } = ev;
      const deltaX = clientX - this.startX;
      this.onDragStateChange(false);
      this.onDragEnd(deltaX);
      this.startX = null;
      this.dragging = false;
    }
  },
  beforeDestroy: function() {
    document.removeEventListener("mousemove", this.mousemove, false);
    document.removeEventListener("mouseup", this.mouseup, false);
  },
  render() {
    return this.$scopedSlots.default({
      mousedown: this.mousedown
    })[0];
  }
};
</script>
