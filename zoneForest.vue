
<template>
  <div class="zoneForest">

    <bim-object-manager></bim-object-manager>

    <div class='mainButtons'>
      <md-button class="md-icon-button"
                 @click="onCreateTree">
        <md-icon>add</md-icon>
        <md-tooltip>Create Tree</md-tooltip>
      </md-button>

      <!-- <md-button class="md-icon-button"
                 @click="onPrintForest">
        <md-icon>print</md-icon>
        <md-tooltip>print zoneForest</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onSelect">
        <md-icon>print</md-icon>
        <md-tooltip>select</md-tooltip>
      </md-button> -->

      <md-button class="md-icon-button"
                 @click="onSimulation">
        <md-icon>{{link}}</md-icon>
        <md-tooltip>Simulation</md-tooltip>
      </md-button>
    </div>

    <shared-tool-bar></shared-tool-bar>

    <div class='mainMenu'>
      <md-list class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="t in zoneArray"
                      :key="t.title">
          <zoneTree :node="t"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;

import zoneTree from "./zoneTree.vue";
import EventBus from "./EventBus.vue";
import BIMObjectManager from "./BIMObjectManager.vue";
import sharedToolBar from "./sharedToolBar.vue";
import { ConfigurationModel, Forest } from "./configurationModel";
var allDbIds = [];
// import select from "./select";
import swt from "./SelectionWindowTool";

export default {
  name: "zoneForest",
  data() {
    return {
      zoneForest: null,
      title: "Zone",
      zoneArray: [],
      spinalSystem: globalType.spinal.spinalSystem,
      simulationModel: null,
      viewer: globalType.v,
      coloringType: 0,
      toggleSimulate: false,
      link: "settings_input_antenna",
      special: false,
      refreshInterval: null,
      materialsArray: []
    };
  },
  components: {
    zoneTree: zoneTree,
    sharedToolBar: sharedToolBar,
    bimObjectManager: BIMObjectManager
  },
  methods: {
    getArray: function() {
      this.zoneArray = [];
      if (this.zoneForest)
        for (let i = 0; i < this.zoneForest.list.length; i++) {
          this.zoneArray.push(this.zoneForest.list[i]);
        }
    },
    onCreateTree: function() {
      if (this.zoneForest) {
        this.zoneForest.addTree(this.title);
      }
    },
    onModelChange: function() {
      this.getArray();
    },
    refreshAllColors: function() {
      // console.log("test");
      if (this.toggleSimulate) {
        let intervalle = 2;
        this.refreshInterval = setInterval(() => {
          // let dbid = [6612];
          // let color = "#FF0000";
          // let id = dbid[0];
          // let m = v.setColorMaterial(dbid, color, id);

          // m.color.setHex(0x00ff00);
          let BIMGroups = this.zoneForest.getAllBIMGroups();
          // console.log(BIMGroups);
          for (let index = 0; index < BIMGroups.length; index++) {
            const element = BIMGroups[index];
            if (element.currentValue.get() !== 0) {
              element.colorByValue1();
              this.refreshColors(element, element.color.get());
            }
          }
        }, intervalle * 1000);
      } else {
        clearInterval(this.refreshInterval);
      }
    },
    refreshColors: function(thing, color) {
      if (this.coloringType === 1) {
        var R = this.hexToR(color) / 255;
        var G = this.hexToG(color) / 255;
        var B = this.hexToB(color) / 255;
        var color2 = new THREE.Vector4(R, G, B, 0.5);
        for (let index = 0; index < thing.items.length; index++) {
          this.viewer.setThemingColor(thing.items[index].id.get(), color2);
        }
      } else {
        // if (thing.items[0]) {
        //   var index = this.contains(thing.items[0].id.get());
        //   if (!index) {
        //     var dbids = [];
        //     var id = dbids[0];
        //     for (let index = 0; index < thing.items.length; index++) {
        //       dbids.push(thing.items[index].id.get());
        //       allDbIds.push(thing.items[index].id.get());
        //       console.log(allDbIds);
        //     }
        //     var m = v.setColorMaterial(dbids, color, id);
        //     this.materialsArray.push({ id: id, material: m });
        //   } else {
        //     this.materialsArray[index].material.color.setHex(0x00ff00);
        //   }
        // }
        let dbids = [];
        for (let index = 0; index < thing.items.length; index++) {
          dbids.push(thing.items[index].id.get());
          allDbIds.push(thing.items[index].id.get());
          // console.log(allDbIds);
        }
        this.viewer.setColorMaterial(dbids, color);
      }
    },
    contains: function(id) {
      for (let index = 0; index < this.materialsArray.length; index++) {
        const element = this.materialsArray[index];
        return index;
      }
      return false;
    },
    hexToR: function(h) {
      return parseInt(this.cutHex(h).substring(0, 2), 16);
    },

    hexToG: function(h) {
      return parseInt(this.cutHex(h).substring(2, 4), 16);
    },

    hexToB: function(h) {
      return parseInt(this.cutHex(h).substring(4, 6), 16);
    },

    cutHex: function(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    },
    onSimulation: function() {
      if (this.toggleSimulate) {
        this.toggleSimulate = false;
        this.link = "settings_input_antenna";
        if (this.coloringType === 1) this.viewer.clearThemingColors();
        else {
          this.viewer.restoreColorMaterial(allDbIds);
        }
      } else {
        this.toggleSimulate = true;
        this.link = "stop";
      }
      this.refreshAllColors();
    },

    onDataChange: function() {
      let numberOfProcesseurs = 2;
      let offset = 0;
      if (this.toggleSimulate) {
        for (let index = 0; index < numberOfProcesseurs; index++) {
          const element = this.zoneForest.list[index];
          if (element !== undefined) {
            element.special.set(true);
            if (index === 0) offset = 8;
            element.BIMGroup.currentValue.set(
              this.simulationModel.temperature[index].get() / 1000 + offset
            );
            offset = 0;
          }
        }
      }
    },

    onPrintForest: function() {
      if (this.zoneForest) console.log(this.zoneForest.list);
    },
    onSelect: function() {
      // var s = new select(v);
      // s.loadModel(v.model);
      // console.log(s);
      var s = new swt(v);
      s.setModel(v.model);
      s.activate();
    },
    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        if (this.zoneForest) this.zoneForest.removeTree(root);
      });
    },
    linkToDB: function() {
      this.spinalSystem.getModel().then(forgefile => {
        if (forgefile) {
          if (forgefile.configurationModel) {
            forgefile.configurationModel.load(model => {
              this.zoneForest = model.zoneForest;
              this.zoneForest.bind(this.onModelChange);
            });
          } else {
            let configurationModel = new ConfigurationModel();
            this.zoneForest = configurationModel.zoneForest;
            forgefile.add_attr({
              configurationModel: new Ptr(configurationModel)
            });
            this.zoneForest.bind(this.onModelChange);
          }
        }
      });
      this.spinalSystem.load("SNMPModel").then(m => {
        this.simulationModel = m;
        this.simulationModel.bind(this.onDataChange);
        // console.log("values", this.simulationModel.temperature[0].get());
      });
    }
  },

  mounted() {
    this.linkToDB(), this.getEvents();
  }
};
</script>

<style scoped>
.zoneForest {
  height: calc(100% - 45px);
  width: calc(100% - 10px);
}

.mainButtons {
  display: block;
}
.mainMenu {
  height: calc(100% - 80px);
}
.md-scrollbar {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow-y: scroll;
}

.adjust {
  padding: 0;
  width: calc(100% - 5px);
}
</style>


<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.mainMenu > ul > li > div > div {
  padding: 0;
}
</style>



