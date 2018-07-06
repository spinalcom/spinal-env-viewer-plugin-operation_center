


<template>
  <md-content class="deviceForest md-scrollbar">

    <forest v-if="deviceForest!=null"
            :forest="deviceForest"
            :type="'device'"
            :group="'deviceNode'"></forest>

  </md-content>
</template>

<script>
var globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
import forest from "../assets/utilities/forest.vue";
import EventBus from "../assets/utilities/EventBus.vue";

export default {
  name: "deviceForest",
  data() {
    return {
      deviceConfigPanel: null
    };
  },
  props: ["deviceForest"],
  components: {
    forest
  },
  methods: {
    getEvents: function() {
      EventBus.$on("deviceConfigPanelCreated", deviceConfigPanel => {
        this.deviceConfigPanel = deviceConfigPanel;
        EventBus.$off("deviceConfigPanelCreated");
      });
      EventBus.$on("removeDeviceRoot", root => {
        if (this.deviceForest.list.length) {
          let nextIndex = this.deviceForest.removeTree(root);
        }
      });
    },
    linkToDB: function() {}
  },

  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    this.linkToDB();
    this.getEvents();
  }
};
</script>


