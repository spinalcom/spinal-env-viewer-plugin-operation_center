
<template>
  <div class="panelButton">
    <md-button v-if="this.panel != null"
               class=" md-icon-button "
               @click="toggle">
      <md-icon v-if="panel.showContent">unfold_less</md-icon>
      <md-icon v-else>unfold_more</md-icon>
      <!-- <md-tooltip md-direction="top">hide-show</md-tooltip> -->
    </md-button>
  </div>
</template>

<script>
let globalType = typeof window === "undefined" ? global : window;

export default {
  name: "panelButton",
  data() {
    return {
      panel: null,
      group: null,
      index: null
    };
  },
  components: {},
  methods: {
    toggle: function() {
      if (this.panel != null) {
        if (this.panel.showContent) {
          this.panel.showContent = false;

          // this.panel.container.style.minHeight = "35px";
          // this.panel.container.style.height = "0px";
          // if (this.group != null && this.index != null) {
          //   let panelGroup =
          //     globalType.spinal.panelManager.panelsGroup[this.group];
          //   let top = this.panel.container.style.top;

          //   for (
          //     let index = this.index + 1;
          //     index < panelGroup.length;
          //     index++
          //   ) {
          //     const panel = panelGroup[index];
          //     let newTop = "calc( 35px +" + top * index + " px )";
          //     panel.container.style.top = newTop;
          //     // panel.container.style.minHeight = "35px";
          //     // panel.container.style.height = "200px";
          //     // console.log(newTop);
          //   }
          // }
        } else {
          this.panel.showContent = true;
          // this.panel.container.style.minHeight = "35px";
          // this.panel.container.style.height = "200px";
        }
        if (this.panel.showContent) {
          this.panel.container.style.height = this.panel.currentHeight;
        } else {
          this.panel.currentHeight = this.panel.container.style.height;
          this.panel.container.style.height = "35px";
        }
        if (this.panel.container.style.left < "10px")
          globalType.spinal.panelManager.renderGroup(this.group);
      }
    },
    getEvents: function() {}
  },
  mounted() {
    this.getEvents();
  }
};
</script>

<style scoped>
.panelButton {
  position: absolute;
  top: 0px;
  right: 5%;
  padding-top: 7px;
}
.panelButton button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px !important;
  height: 20px !important;
}

.panelButton i.md-icon.md-icon-font.md-theme-default {
  font-size: 20px !important;
}
</style>







