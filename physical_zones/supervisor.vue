
<template>
  <md-button class="md-icon-button"
             @click="onSimulation">
    <md-icon>{{setIcon}}</md-icon>
    <md-tooltip>supervision</md-tooltip>
  </md-button>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;
var viewer;

import Vue from "vue";
var EventBus;
import chart from "../assets/utilities/chart.vue";

const timeSeriesPanelComponentCtor = Vue.extend(chart);
export default {
  name: "supervisor",
  data() {
    return {
      icon: "settings_input_antenna",
      timeSeriesPanel: null
    };
  },
  props: ["zoneForest", "relOptions"],
  components: {},
  methods: {
    onSimulation: function() {
      if (typeof this.relOptions.simulationMode === "undefined") {
        this.relOptions.add_attr({ simulationMode: false });
        setTimeout(() => {
          this.toggleSimulationMode();
        }, 500);
      } else {
        this.toggleSimulationMode();
      }
    },
    toggleSimulationMode: function() {
      if (this.relOptions != null) {
        if (this.relOptions.simulationMode.get()) {
          this.relOptions.simulationMode.set(false);
          this.icon = "settings_input_antenna";
          this.zoneForest.restoreColorMaterial();
          this.zoneForest.disactivateAllBIMGroups();
          this.timeSeriesPanel.setVisible(false);
        } else {
          this.relOptions.simulationMode.set(true);
          this.icon = "stop";
          this.zoneForest.activateAllBIMGroups();
          this.timeSeriesPanel.setVisible(true);
        }
        EventBus.$emit("simulationMode", this.relOptions.simulationMode);
      }
    },
    timeSeriesPanelInit: function() {
      this.timeSeriesPanel = new PanelClass(viewer, "Time Series");
      var _container = document.createElement("div");
      _container.className =
        this.timeSeriesPanel.container.id + "-pannelcontainer";
      _container.style.height = "calc(100% - 45px)";
      _container.style.overflowY = "auto";
      this.timeSeriesPanel.container.style.left = "calc(100vw - 35%)";
      // this.timeSeriesPanel.container.style.left = "100%-400px";
      this.timeSeriesPanel.container.style.top = "300px";
      this.timeSeriesPanel.container.appendChild(_container);
      new timeSeriesPanelComponentCtor().$mount(_container);
    },
    pluginActive: function() {
      if (
        typeof this.relOptions !== "undefined" &&
        typeof this.relOptions.simulationMode !== "undefined" &&
        typeof this.relOptions.button1Active !== "undefined" &&
        this.relOptions.simulationMode.get() &&
        this.relOptions.button1Active.get()
      )
        this.timeSeriesPanel.setVisible(true);
      else this.timeSeriesPanel.setVisible(false);
    },
    getEvents: function() {}
  },
  mounted() {
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.timeSeriesPanelInit();
    setTimeout(() => {
      if (
         this.relOptions != null &&
        typeof this.relOptions !== "undefined" &&
        typeof this.relOptions.button1Active !== "undefined"
      )
        this.relOptions.button1Active.bind(this.pluginActive);
    }, 500);
  },
  computed: {
    setIcon: function() {
      if (
        this.relOptions != null &&
        typeof this.relOptions !== "undefined" &&
        typeof this.relOptions.simulationMode !== "undefined"
      ) {
        this.icon = this.relOptions.simulationMode.get()
          ? "stop"
          : "settings_input_antenna";
        return this.icon;
      } else {
        this.icon = "settings_input_antenna";
        return this.icon;
      }
    }
  }
};
</script>






