
<template>
  <md-button class="md-icon-button"
             @click="onSimulation">
    <md-icon>{{link}}</md-icon>
    <md-tooltip>supervision</md-tooltip>
  </md-button>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;
var viewer;

import EventBus from "../asset/utilities/EventBus.vue";
export default {
  name: "supervisor",
  data() {
    return {
      link: "settings_input_antenna",
      simulationModel: null,
      toggleSimulation: false
    };
  },
  props: ["zoneForest"],
  components: {},
  methods: {
    onSimulation: function() {
      if (this.toggleSimulation) {
        this.toggleSimulation = false;
        this.link = "settings_input_antenna";
        this.zoneForest.restoreColorMaterial();
      } else {
        this.toggleSimulation = true;
        this.link = "stop";
      }
      EventBus.$emit("toggleSimulation", this.toggleSimulation);
    },
    onDataChange: function() {
      let numberOfProcesseurs = 2;
      let offset = 0;
      if (this.toggleSimulation) {
        for (let index = 0; index < numberOfProcesseurs; index++) {
          const element = this.zoneForest.list[index];
          if (element !== undefined) {
            element.special.set(true);
            if (index === 0) offset = 8;
            element.BIMGroup.currentValue.set(
              this.simulationModel.temperature[index].get() / 1000 + offset
            );
            element.BIMGroup.populateTimeSeries();
            offset = 0;
          }
        }
      }
    },
    getEvents: function() {},
    linkToDB: function() {
      spinalSystem.load("SNMPModel").then(m => {
        this.simulationModel = m;
        this.simulationModel.bind(this.onDataChange);
      });
    }
  },
  mounted() {
    viewer = globalType.v;
    this.getEvents();
    this.linkToDB();
  }
};
</script>






