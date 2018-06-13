
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

      <supervisor :zoneForest="zoneForest"
                  :relOptions="relOptions"></supervisor>

      <!-- <linker></linker> -->
    </div>

    <shared-tool-bar></shared-tool-bar>

    <!-- <div class='mainMenu'>
      <md-list class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="t in zoneArray"
                      :key="t.title.get()">
          <zoneTree :node="t"></zoneTree>
        </md-list-item>
      </md-list>
    </div> -->

    <!-- <draggable class="dragArea md-scrollbar"
               :options="{group:'ZoneNode'}"
               v-model="zoneArray"
               @start="drag=true"
               @end="onDragEnd"
               @change="onChange">
      <div class="adjust"
           v-for="t in zoneArray"
           :key="t.title.get()">
        <zoneTree :node="t"></zoneTree>
      </div>
    </draggable> -->

    <div class='mainMenu'>
      <md-list class=" md-scrollbar ">
        <draggable class="dragArea"
                   :options="{group:'ZoneNode'}"
                   v-model="zoneArray"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange"
                   @choose.stop>
          <md-list-item class="adjust"
                        v-for="t in zoneArray"
                        :key="t.id.get()">
            <zoneTree :node="t"></zoneTree>
          </md-list-item>
        </draggable>
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
import draggable from "vuedraggable";
var globalType;
var spinalSystem;
var viewer;
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
      // toggleSimulation: false,
      relOptions: null
    };
  },
  components: {
    zoneTree: zoneTree,
    sharedToolBar: sharedToolBar,
    bimObjectManager: BIMObjectManager,
    supervisor: supervisor,
    draggable
  },
  methods: {
    getArray: function() {
      this.zoneArray = [];
      if (this.zoneForest)
        for (let i = 0; i < this.zoneForest.list.length; i++) {
          this.zoneArray.push(this.zoneForest.list[i]);
        }
    },
    updateLst: function() {
      this.zoneForest.list.clear();
      if (this.zoneArray)
        for (let i = 0; i < this.zoneArray.length; i++) {
          this.zoneForest.list.push(this.zoneArray[i]);
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
      if (this.relOptions.simulationMode) this.zoneForest.refreshAllColors();
    },

    onPrintForest: function() {
      if (this.zoneForest) console.log(this.zoneForest.list);
    },
    onChange: function(evt) {
      if (evt.added) {
        evt.added.element.removeParent();
        evt.added.element.add_attr({ relOptions: this.zoneForest.relOptions });
        this.zoneForest.list.insert(evt.added.newIndex, [evt.added.element]);
      }
      if (evt.removed) {
        this.zoneForest.list.splice(evt.removed.oldIndex, 1);
      }
      if (evt.moved) {
        this.zoneForest.list.splice(evt.moved.oldIndex, 1);
        this.zoneForest.list.insert(evt.moved.newIndex, [evt.moved.element]);
      }
    },

    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        if (this.zoneForest.list.length) {
          let nextIndex = this.zoneForest.removeTree(root);
          // console.log("nextIndex", nextIndex);
          // if (this.zoneForest.list.length >= 0) {
          //   if (typeof this.zoneForest.list[nextIndex] != "undefined")
          //     EventBus.$emit(
          //       "zoneTreeContext",
          //       this.zoneForest.list[nextIndex]
          //     );
          //   else if (typeof this.zoneForest.list[nextIndex + 1] != "undefined")
          //     EventBus.$emit(
          //       "zoneTreeContext",
          //       this.zoneForest.list[nextIndex + 1]
          //     );
          //   else if (typeof this.zoneForest.list[nextIndex - 1] != "undefined")
          //     EventBus.$emit(
          //       "zoneTreeContext",
          //       this.zoneForest.list[nextIndex - 1]
          //     );
          // }
          // } else {
          //   EventBus.$emit("zoneTreeContext", null);
          // }
        }
      });
      // EventBus.$on("simulationMode", _toggleSimulation => {
      //   this.toggleSimulation = _toggleSimulation.get();
      //   console.log(this.toggleSimulation);
      // });
    },
    linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.operationCenter) {
              forgefile.operationCenter.load(model => {
                model.relForestOptions.load(relFO => {
                  relFO.zoneForest.load(zf => {
                    this.zoneForest = zf;
                    this.zoneForest.bind(this.onModelChange);
                  });
                  relFO.options.load(opt => {
                    this.relOptions = opt;
                  });
                });
              });
            } else {
              let operationCenter = new OperationCenter();
              operationCenter.relForestOptions.load(relFO => {
                relFO.zoneForest.load(zf => {
                  this.zoneForest = zf;
                  this.zoneForest.bind(this.onModelChange);
                });
                forgefile.add_attr({
                  operationCenter: new Ptr(operationCenter)
                });
                relFO.options.load(opt => {
                  this.relOptions = opt;
                });
              });
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
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
.draggable,
.draggable *,
.md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}

.mainMenu > ul > li > div > div {
  padding: 0;
}

.dragArea {
  min-height: 50px;
}
</style>
