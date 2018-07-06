
<template>
  <div class="zoneManager">

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

      <md-button class="md-icon-button"
                 @click="onBuildForest">
        <md-icon>refresh</md-icon>
        <md-tooltip>build forest</md-tooltip>
      </md-button>

      <supervisor :zoneForest="zoneForest"
                  :relOptions="relOptions"></supervisor>

    </div>

    <shared-tool-bar></shared-tool-bar>
    <zone-forest :zoneForest="zoneForest"
                 :relZoneAggregatesList="relZoneAggregatesList"
                 :zoneList="zoneList"></zone-forest>

  </div>
</template>

// loadModelPtr(model) {
//     if (this.modelsDictionary[model._server_id]) {
//       return this.modelsDictionary[model._server_id].promise;
//     }
//     this.modelsDictionary[model._server_id] = Q.defer();
//     try {
//       model.load(m => {
//         this.modelsDictionary[model._server_id].resolve(m);
//       });
//     } catch (error) {
//       let promise = this.modelsDictionary[model._server_id];
//       this.modelsDictionary[model._server_id] = undefined;
//       promise.reject();
//     }
//     return this.modelsDictionary[model._server_id].promise;
//   }

<script>
import zoneForest from "./zoneForest.vue";
var globalType;
var spinalSystem;
var viewer;
import EventBus from "../assets/utilities/EventBus.vue";
import BIMObjectManager from "../bim/BIMObjectManager.vue";
import sharedToolBar from "./sharedToolBar.vue";
import supervisor from "./supervisor.vue";
import { OperationCenter } from "spinal-models-operation_center";
import select from "../selection/select";
import swt from "../selection/SelectionWindowTool";
import { createWriteStream, supported, version } from "streamsaver";

export default {
  name: "zoneManager",
  data() {
    return {
      zoneForest: null,
      zoneArray: [],
      relOptions: null,
      relZoneAggregatesList: null,
      zoneList: null,
      relFO: null,
      show: false
    };
  },
  components: {
    zoneForest,
    sharedToolBar,
    bimObjectManager: BIMObjectManager,
    supervisor
  },
  methods: {
    onBuildForest: function() {
      let zoneForestTmp = this.relZoneAggregatesList.build(
        this.relOptions,
        this.zoneList
      );
      this.relFO.mod_attr("zoneForest", new Ptr(zoneForestTmp));

      const fileStream = createWriteStream("zoneList.txt");
      const writer = fileStream.getWriter();
      const encoder = new TextEncoder();
      let data = this.zoneList.toString(1);
      data += this.relZoneAggregatesList.toString(
        this.zoneList.list.length + 1,
        this.zoneList
      );
      let uint8array = encoder.encode(data + "\n\n");
      writer.write(uint8array);
      writer.close();
    },
    onCreateTree: function() {
      if (this.zoneForest) {
        this.zoneForest.addTree(
          "Zone",
          this.relZoneAggregatesList,
          this.zoneList
        );
      }
    },
    onModelChange: function() {
      this.onSimulation();
    },

    onSimulation: function() {
      if (this.relOptions.simulationMode) this.zoneForest.refreshAllColors();
    },

    onPrintForest: function() {
      if (this.zoneForest) console.log(this.zoneForest.list);
    },
    getEvents: function() {
      EventBus.$on("showPanelContent", show => {
        this.show = show;
      });
    },
    linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.operationCenter) {
              forgefile.operationCenter.load(model => {
                globalType.operationCenter = {
                  options: model.options
                };
                model.relForestOptionsZone.load(relFO => {
                  this.relFO = relFO;
                  relFO.zoneForest.load(zf => {
                    this.zoneForest = zf;
                    this.zoneForest.bind(this.onModelChange);
                  });
                  relFO.options.load(opt => {
                    this.relOptions = opt;
                  });
                });
                model.relZoneAggregatesList.load(relZoneAggregatesList => {
                  this.relZoneAggregatesList = relZoneAggregatesList;
                });
                model.zoneList.load(zoneList => {
                  this.zoneList = zoneList;
                });
              });
            } else {
              let operationCenter = new OperationCenter();
              operationCenter.relForestOptionsZone.load(relFO => {
                this.relFO = relFO;
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
              operationCenter.relZoneAggregatesList.load(
                relZoneAggregatesList => {
                  this.relZoneAggregatesList = relZoneAggregatesList;
                }
              );
              operationCenter.zoneList.load(zoneList => {
                this.zoneList = zoneList;
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
.zoneManager {
  height: calc(100% - 35px);
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
.zoneManager .md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.zoneManager .mainMenu > ul > li > div > div {
  padding: 0;
}

.zoneManager .md-icon-button {
  margin-left: 0px;
}

.zoneManager i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.zoneManager .md-ripple.md-list-item-content.md-disabled {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.zoneManager span {
  font-size: 14px;
}

.zoneManager button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.zoneManager .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>
