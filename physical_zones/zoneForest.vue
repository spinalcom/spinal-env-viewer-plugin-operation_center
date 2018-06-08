
<template>
  <div class="zoneForest">

    <bim-object-manager></bim-object-manager>

    <div class='mainButtons'>
      <md-button class="md-icon-button"
                 @click="onCreateTree">
        <md-icon>add</md-icon>
        <md-tooltip>Create Tree</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onPrintForest">
        <md-icon>print</md-icon>
        <md-tooltip>print zoneForest</md-tooltip>
      </md-button>

      <!-- <md-button class="md-icon-button"
                 @click="onSelect">
        <md-icon>print</md-icon>
        <md-tooltip>select</md-tooltip>
      </md-button> -->

      <supervisor :zoneForest="zoneForest"></supervisor>
    </div>

    <shared-tool-bar></shared-tool-bar>

    <div class='mainMenu'>
      <md-list class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="t in zoneArray"
                      :key="t.title.get()">
          <zoneTree :node="t"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

    <!-- <div class='mainMenu'>
      <md-list v-if="zoneForest !=null"
               class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="index in zoneForest.list.length"
                      :key="zoneForest.list[index-1].title.get()">
          <zoneTree :node="zoneForest.list[index-1]"></zoneTree>
        </md-list-item>
      </md-list>
    </div> -->

  </div>

</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;
var viewer = globalType.v;
import zoneTree from "./zoneTree.vue";
import EventBus from "../assets/utilities/EventBus.vue";
import BIMObjectManager from "../bim/BIMObjectManager.vue";
import sharedToolBar from "./sharedToolBar.vue";
import supervisor from "./supervisor.vue";
import { OperationCenter } from "spinal-models-operation_center";
import select from "../selection/select";
import swt from "../selection/SelectionWindowTool";

export default {
  name: "zoneForest",
  data() {
    return {
      zoneForest: null,
      title: "Zone",
      zoneArray: [],
      toggleSimulation: false
    };
  },
  components: {
    zoneTree: zoneTree,
    sharedToolBar: sharedToolBar,
    bimObjectManager: BIMObjectManager,
    supervisor: supervisor
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
      this.onSimulation();
    },

    onSimulation: function() {
      if (this.toggleSimulation) this.zoneForest.refreshAllColors();
    },

    onPrintForest: function() {
      if (this.zoneForest) console.log(this.zoneForest.list);
    },

    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        if (this.zoneForest) this.zoneForest.removeTree(root);
      });
      EventBus.$on("toggleSimulation", _toggleSimulation => {
        this.toggleSimulation = _toggleSimulation;
      });
    },
    linkToDB: function() {
      spinalSystem.getModel().then(forgefile => {
        if (forgefile) {
          if (forgefile.operationCenter) {
            forgefile.operationCenter.load(model => {
              model.zoneForest.load(zf => {
                this.zoneForest = zf;
                this.zoneForest.bind(this.onModelChange);
              });
            });
          } else {
            let operationCenter = new OperationCenter();
            console.log(operationCenter);
            operationCenter.zoneForest.load(zf => {
              this.zoneForest = zf;
              console.log(zf);
            });
            forgefile.add_attr({
              operationCenter: new Ptr(operationCenter)
            });
            this.zoneForest.bind(this.onModelChange);
          }
        }
      });
    }
  },

  mounted() {
    viewer = globalType.v;
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
.md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.mainMenu > ul > li > div > div {
  padding: 0;
}
</style>
