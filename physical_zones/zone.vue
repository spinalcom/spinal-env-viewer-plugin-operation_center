
<template>
  <div draggable="true"
       @dragstart.stop="drag"
       class="zone"
       v-bind:class="{zoneSelector : isSelected}">

    <div @click="sendContext">

      <md-list @click="test">
        <md-list-item>

          <md-button class="md-icon-button "
                     @click="toggleShow()">
            <md-icon>{{hideShowIcon}}
            </md-icon>
            <!-- <md-tooltip md-direction="top">hide-show</md-tooltip> -->
          </md-button>

          <div class="md-list-item-text">
            <span>{{node.element.name.get()}}</span>
          </div>

          <div v-if=" BIMGroup !=null && BIMGroup.active.get()==true"
               class="md-list-item-text">
            <span>{{BIMGroup.currentValue.get()}}</span>
          </div>

          <div v-if=" BIMGroup !=null &&BIMGroup.active.get()=== true"
               class="md-list-item-text">
            <span>{{BIMGroup.name.get()}}</span>
          </div>

          <md-button v-if="networkEditingMode && node.element.type.get()==='Equipement'"
                     class="md-icon-button "
                     @click="sendEquipement">
            <md-icon>send
            </md-icon>
            <!-- <md-tooltip md-direction="top">hide-show</md-tooltip> -->
          </md-button>

          <md-menu md-direction="bottom-start">
            <md-button class="md-icon-button"
                       md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>

            <md-menu-content class="small-menu">
              <md-menu-item v-if="node.element.type.get()==='Zone'"
                            @click="onAddChild()">
                Zone
              </md-menu-item>
              <md-menu-item @click="onAddEquip()">
                Equipement
              </md-menu-item>
            </md-menu-content>
          </md-menu>

          <md-button v-if="simulationMode"
                     class="md-icon-button"
                     @click="toggleActivation()">
            <md-icon>{{toggleSimulationIcon}}</md-icon>
            <md-tooltip md-direction="top">activation</md-tooltip>
          </md-button>

          <md-button class="md-icon-button "
                     @click="moveUp">
            <md-icon>expand_less
            </md-icon>
            <!-- <md-tooltip md-direction="top">hide-show</md-tooltip> -->
          </md-button>

          <md-button class="md-icon-button "
                     @click="moveDown">
            <md-icon>expand_more
            </md-icon>
            <!-- <md-tooltip md-direction="top">hide-show</md-tooltip> -->
          </md-button>

          <!-- <md-button class="md-icon-button"
                     @click="test()">
            <md-icon>print</md-icon>
          </md-button> -->

          <!-- <input type="checkbox"
                 id="checkbox"
                 v-model="toggleSimulationIcon"> -->

          <!-- <md-switch v-model="simulation"></md-switch> -->

          <!-- <md-button class="md-icon-button"
                     @click="onAddEquip()">
            <md-icon>add_to_queue</md-icon>
            <md-tooltip md-direction="top">New Equip</md-tooltip>
          </md-button> -->

        </md-list-item>
      </md-list>

    </div>

    <!-- <div v-show="node.showContent.get()">
      <md-list v-if="arrayTree.length>0">
        <md-list-item class="adjust  "
                      v-for="child in arrayTree"
                      :key="child.name.get()">
          <zone :node="child"></zone>
        </md-list-item>
      </md-list>
    </div> -->

    <!-- <draggable class="dragArea"
               :options="{group:'people'}"
               v-model="arrayTree"
               @start="drag=true"
               @end="onDragEnd"
               @change="onChange">
      <div v-show="node.showContent.get()"
           class="adjust  "
           v-for="child in arrayTree"
           :key="child.name.get()">
        <zone :node="child"></zone>
      </div>
    </draggable> -->

    <div>
      <md-list>
        <draggable class="dragArea "
                   v-bind:class="{ dragAreaB: isSelected} "
                   :options="{group:{ name:'ZoneNode',  pull:'clone'}}"
                   v-model="arrayTree"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange">
          <md-list-item @click="test"
                        v-show="node.showContent.get()"
                        class="adjust  "
                        v-for="(child,index) in arrayTree"
                        :key="child.element.id.get()">
            <zone :node="child"
                  @up="onUp(index)"
                  @down="onDown(index)"
                  :relZoneAggregatesList="relZoneAggregatesList"
                  :zoneList="zoneList"></zone>
          </md-list-item>

        </draggable>
      </md-list>
    </div>
    <!-- <div v-show="node.showContent.get()">
      <md-list v-if="node.children.length>0">
        <md-list-item class="adjust  "
                      v-for="index in node.children.length"
                      :key="node.children[index-1].element.name.get()">
          <zone :node="node.children[index-1]"></zone>
        </md-list-item>
      </md-list>
    </div> -->
    <bim-group v-if="BIMGroup !=null &&node.showContent.get()"
               :node="node"
               :nodeSelected="isSelected"></bim-group>

  </div>
</template>

<script>
import draggable from "vuedraggable";
let globalType = typeof window === "undefined" ? global : window;
import DialogPrompt from "../assets/utilities/dialogPrompt.vue";
import zone from "./zone.vue";
var EventBus;

import BIMGroupVue from "../bim/BIMGroup.vue";
export default {
  name: "zone",
  data() {
    return {
      arrayTree: [],
      hideShowIcon: "arrow_drop_down",
      isSelected: false,
      toggleSimulationIcon: "check_box_outline_blank",
      simulationMode: false,
      networkEditingMode: false,
      BIMGroup: null
    };
  },
  components: {
    zone: zone,
    bimGroup: BIMGroupVue,
    draggable
  },
  props: ["node", "relZoneAggregatesList", "zoneList"],
  // watch: {
  //   BIMGroup: function(newBIMGroup) {
  //     console.log(newBIMGroup);

  //     this.setActivationIcon();
  //   }
  // },
  methods: {
    onUp: function(_index) {
      if (_index > 0) {
        let ele = this.node.children[_index];
        this.node.children.splice(_index, 1);
        this.node.children.insert(_index - 1, [ele]);
      }
    },
    onDown: function(_index) {
      if (_index < this.node.children.length - 1) {
        let ele = this.node.children[_index];
        this.node.children.splice(_index, 1);
        this.node.children.insert(_index + 1, [ele]);
      }
    },
    sendEquipement: function() {
      EventBus.$emit("equipementOnly", this.node.element);
    },
    moveUp: function() {
      this.$emit("up");
    },
    moveDown: function() {
      this.$emit("down");
    },
    test: function() {},
    getArray: function() {
      this.arrayTree = [];
      for (let i = 0; i < this.node.children.length; i++) {
        this.arrayTree.push(this.node.children[i]);
      }
    },
    onAddChild: function() {
      this.node.createChild("Zone", this.relZoneAggregatesList, this.zoneList);
      this.node.updateShowContent(true);
    },
    onAddEquip: function() {
      this.node.createChild(
        "Equipement",
        this.relZoneAggregatesList,
        this.zoneList
      );
      this.node.updateShowContent(true);
    },
    sendContext: async function() {
      if (this.node.element.type.get() === "Zone")
        EventBus.$emit("zoneContext", this);
      if (this.node.element.type.get() === "Equipement")
        EventBus.$emit("equipementContext", this);
      this.isSelected = true;
      // console.log(this.node);
      // this.node.test();
      let ids = await this.node.getItems();
      globalType.v.select(ids, Autodesk.Viewing.SelectionMode.MIXED);
    },
    refresh: function() {
      // if (typeof this.node.element["relZoneContains"] !== "undefined")
      //   this.node.element["relZoneContains"].load(BIMGroupLst => {
      //     this.BIMGroup = BIMGroupLst[0];
      //   });
      this.getArray();
      this.hideShowIcon = this.node.showContent.get()
        ? "arrow_drop_down"
        : "arrow_drop_up";
      if (this.BIMGroup != null) {
        this.toggleSimulationIcon = this.BIMGroup.active.get()
          ? "check_box"
          : "check_box_outline_blank";
      }
    },
    refreshBIMGroup: function() {
      if (this.BIMGroup != null) {
        this.toggleSimulationIcon = this.BIMGroup.active.get()
          ? "check_box"
          : "check_box_outline_blank";
      }
    },
    onChange: function(evt) {
      // if (evt.added) {
      //   //TODO
      //   if (evt.added.element.isRoot()) {
      //     evt.added.element.setParent(this.node);
      //     evt.added.element.rem_attr("relOptions");
      //   }
      //   this.node.children.insert(evt.added.newIndex, [evt.added.element]);
      //   this.node.updateShowContent(true);
      // }
      // if (evt.removed) {
      //   console.log("test");
      //   this.node.children.splice(evt.removed.oldIndex, 1);
      //   this.node.updateShowContent();
      // }
      // if (evt.moved) {
      //   this.node.children.splice(evt.moved.oldIndex, 1);
      //   this.node.children.insert(evt.moved.newIndex, [evt.moved.element]);
      // }
    },
    drag: function(ev) {
      if (this.node.element.type.get() === "Equipement")
        ev.dataTransfer.setData("equipement", this.node.element._server_id);
    },
    toggleShow: function() {
      if (this.node.showContent.get()) {
        this.node.updateShowContent(false);
        // this.hideShowIcon = "keyboard_arrow_right";
      } else if (
        this.node.children.length > 0 ||
        (this.BIMGroup != null && this.BIMGroup.BIMObjects.length > 0)
      ) {
        this.node.updateShowContent(true);
        // this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    toggleActivation: function() {
      if (this.BIMGroup != null)
        if (this.BIMGroup.active.get()) {
          // this.BIMGroup.active.set(false);
          this.node.setAllDatasActive(false);
          this.toggleSimulationIcon = "check_box_outline_blank";
        } else {
          this.node.setAllDatasActive(true);
          // this.node.BIMGroup.element.active.set(true);
          this.toggleSimulationIcon = "check_box";
        }
    },
    setActivationIcon: function() {
      if (this.BIMGroup != null)
        this.toggleSimulationIcon = this.BIMGroup.active.get()
          ? "check_box"
          : "check_box_outline_blank";
    },
    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {
      let event1 = EventBus.$on("simulationMode", this.cbEventTest);
      EventBus.$on("networkConfigManagerPanelVisibility", visibility => {
        this.networkEditingMode = visibility;
      });
    },
    verifySimulationMode: async function() {
      try {
        // console.log(this.node);
        let root = await this.node.getRoot();
        // console.log(this.node.element.name.get(), root.element.name.get());
        let test = root.relOptions.load(options => {
          if (typeof options.simulationMode !== "undefined")
            this.simulationMode = options.simulationMode.get();
          if (this.simulationMode) this.setActivationIcon();
        });
      } catch (error) {
        console.error(error);
      }
    },
    cbEventTest: function(_toggleSimulation) {
      this.simulationMode = _toggleSimulation.get();
      // console.log(this.simulationMode);
      if (this.simulationMode) this.setActivationIcon();
    }
    // test: function() {
    //   EventBus.$off("simulationMode", this.cbEventTest);
    // }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    setTimeout(() => {
      this.verifySimulationMode();
    }, 20);

    this.node.bind(this.refresh);

    if (typeof this.node.element["relZoneContains"] !== "undefined")
      this.node.element["relZoneContains"].load(BIMGroupLst => {
        this.BIMGroup = BIMGroupLst[0];
        this.BIMGroup.bind(this.refreshBIMGroup);
      });
    this.getEvents();
  }
  // berforeDestroy() {
  //   console.log("dest");
  //   EventBus.$off("simulationMode", this.cbEventTest);
  // }
};
</script>


<style scoped>
.zone {
  width: 100%;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-right-width: 0px;

  border-left: 2px rgba(0, 0, 0, 1);
  border-left-style: solid;

  /* border-bottom-width: 0px; */
}

.dragArea {
  min-height: 1px;
}
.dragAreaB {
  min-height: 1px;
  background-color: rgba(196, 20, 58, 0.5);
}

.dragArea > li > div > div {
  padding: 0px 0px 0px 4px;
}
</style>

<style>
.zoneSelector > div > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}

/* .zone > div > ul > li > div > div {
  padding: 0px 0px 0px 4px;
} */
.zone > div > .md-list {
  padding-left: 9px;
}

.zone > div > .md-list > .md-list-item {
  border-left: 2px rgba(0, 0, 0, 1);
  border-left-style: solid;
}

/* .md-list-item-text {
  margin-left: 10px;
} */
</style>
