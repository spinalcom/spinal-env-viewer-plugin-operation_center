
<template>
  <md-button class="md-icon-button"
             @click="onLinkerActivationToggle">
    <md-icon>{{icon}}</md-icon>
    <md-tooltip>linker</md-tooltip>
  </md-button>

</template>

<script>
var globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
import Vue from "vue";
import EventBus from "../assets/utilities/EventBus.vue";
// import deviceForest from "../network/deviceForest.vue";
import networkConfigManager from "../networkConfig/networkConfigManager.vue";
// const devicesPanelComponentCtor = Vue.extend(deviceForest);
const networkConfigManagerPanelComponentCtor = Vue.extend(networkConfigManager);
export default {
  name: "linker",
  data() {
    return {
      icon: "link",
      linker: false,
      // devicesPanel: null,
      networkConfigManagerPanel: null
    };
  },
  props: [],
  components: {},
  methods: {
    // devicesPanelInit: function() {
    //   this.devicesPanel = new PanelClass(viewer, "linker");
    //   var _container = document.createElement("div");
    //   _container.className =
    //     this.devicesPanel.container.id + "-pannelcontainer";
    //   _container.style.height = "calc(100% - 45px)";
    //   _container.style.overflowY = "auto";
    //   this.devicesPanel.container.style.left = "calc(100vw - 68%)";
    //   // this.devicesPanel.container.style.bottom = "calc(100vh - 450px)";
    //   this.devicesPanel.container.style.top = "0px";

    //   this.devicesPanel.container.appendChild(_container);
    //   new devicesPanelComponentCtor().$mount(_container);
    // },
    networkConfigManagerPanelInit: function() {
      this.networkConfigManagerPanel = new PanelClass(viewer, "config Manager");
      globalType.spinal.panelManager.registerPanel(
        this.networkConfigManagerPanel,
        "operationCenter"
      );
      this.networkConfigManagerPanel.addVisibilityListener(() => {
        if (!this.networkConfigManagerPanel.isVisible()) {
          this.linker = false;
          this.icon = "link";
        }
        EventBus.$emit(
          "networkConfigManagerPanelVisibility",
          this.networkConfigManagerPanel.isVisible()
        );
      });

      var _container = document.createElement("div");
      _container.className =
        this.networkConfigManagerPanel.container.id + "-pannelcontainer";
      // _container.style.height = "calc(100% - 45px)";
      _container.style.overflowY = "auto";
      // this.networkConfigManagerPanel.container.style.left = "calc(100vw - 35%)";
      // this.networkConfigManagerPanel.container.style.right = "0px";

      // this.networkConfigManagerPanel.container.style.bottom = "calc(100vh - 450px)";
      // this.networkConfigManagerPanel.container.style.top = "0px";

      this.networkConfigManagerPanel.container.appendChild(_container);
      new networkConfigManagerPanelComponentCtor().$mount(_container);

      EventBus.$emit(
        "networkConfigManagerPanelCreated",
        this.networkConfigManagerPanel
      );
    },
    onLinkerActivationToggle: function() {
      if (this.linker) {
        this.linker = false;
        this.icon = "link";
        this.networkConfigManagerPanel.setVisible(false);
      } else {
        this.linker = true;
        this.icon = "clear";
        this.networkConfigManagerPanel.setVisible(true);
      }
    },
    getEvents: function() {}
    // updateIcon: function() {
    //   this.icon = this.linker ? "clear" : "link";
    // }
    // linkToDB: function() {
    //   spinalSystem
    //     .getModel()
    //     .then(forgefile => {
    //       if (forgefile) {
    //         if (forgefile.operationCenter) {
    //           forgefile.operationCenter.load(model => {
    //             model.relForestOptionsZone.load(relFO => {
    //               relFO.options.load(opt => {
    //                 if (typeof opt.linker === "undefined")
    //                   opt.add_attr({ linker: false });
    //                 this.linker = opt.linker;
    //                 this.updateIcon();
    //               });
    //             });
    //           });
    //         } else {
    //           setTimeout(() => {
    //             this.linkToDB();
    //           }, 200);
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    // this.linkToDB();
    // this.devicesPanelInit();
    this.networkConfigManagerPanelInit();
    this.getEvents();
  }
};
</script>



