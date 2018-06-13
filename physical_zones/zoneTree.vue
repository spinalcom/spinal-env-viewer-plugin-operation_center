
<template>
  <div class="zoneTree"
       v-bind:class="{zoneTreeselect : isSelected}">

    <div @click="sendContext()">

      <md-list>
        <md-list-item>

          <md-button class="md-icon-button "
                     @click="toggleShow()">
            <md-icon>{{hideShowIcon}}
            </md-icon>
            <md-tooltip md-direction="top">hide-show</md-tooltip>
          </md-button>

          <div class="md-list-item-text">
            <span>{{node.title.get()}}</span>
          </div>

          <div v-if="node.BIMGroup.active.get()==true"
               class="md-list-item-text">
            <span>{{node.BIMGroup.currentValue.get()}}</span>
          </div>

          <div v-if="node.BIMGroup.active.get()=== true"
               class="md-list-item-text">
            <span>{{node.BIMGroup.name.get()}}</span>
          </div>

          <md-menu md-direction="bottom-start">
            <md-button class="md-icon-button"
                       md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item>
                <md-button @click="onAddChild()">
                  New Zone
                </md-button>
              </md-menu-item>
              <md-menu-item>
                <md-button @click="onAddEquip()">
                  New Equipement
                </md-button>
              </md-menu-item>
            </md-menu-content>
          </md-menu>

          <md-button v-if="simulationMode"
                     class="md-icon-button"
                     @click="toggleActivation()">
            <md-icon>{{toggleSimulationIcon}}</md-icon>
            <md-tooltip md-direction="top">activation</md-tooltip>
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
                      :key="child.title.get()">
          <zoneTree :node="child"></zoneTree>
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
           :key="child.title.get()">
        <zoneTree :node="child"></zoneTree>
      </div>
    </draggable> -->

    <div>
      <md-list>
        <draggable class="dragArea"
                   v-bind:class="{ dragAreaB: isSelected } "
                   :options="{group:'ZoneNode'}"
                   v-model="arrayTree"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange">
          <md-list-item v-show="node.showContent.get()"
                        class="adjust  "
                        v-for="child in arrayTree"
                        :key="child.id.get()">
            <zoneTree :node="child"></zoneTree>
          </md-list-item>

        </draggable>
      </md-list>
    </div>
    <!-- <div v-show="node.showContent.get()">
      <md-list v-if="node.children.length>0">
        <md-list-item class="adjust  "
                      v-for="index in node.children.length"
                      :key="node.children[index-1].title.get()">
          <zoneTree :node="node.children[index-1]"></zoneTree>
        </md-list-item>
      </md-list>
    </div> -->
    <bim-group :node="node"
               :nodeSelected="isSelected"></bim-group>

  </div>
</template>

<script>
import draggable from "vuedraggable";
let globalType = typeof window === "undefined" ? global : window;
import DialogPrompt from "../assets/utilities/dialogPrompt.vue";
import zoneTree from "./zoneTree.vue";
import EventBus from "../assets/utilities/EventBus.vue";
import BIMGroup from "../bim/BIMGroup.vue";
export default {
  name: "zoneTree",
  data() {
    return {
      arrayTree: [],
      hideShowIcon: "keyboard_arrow_right",
      isSelected: false,
      toggleSimulationIcon: "check_box_outline_blank",
      simulationMode: false
    };
  },
  components: {
    zoneTree: zoneTree,
    bimGroup: BIMGroup,
    draggable
  },
  props: ["node"],
  methods: {
    getArray: function() {
      this.arrayTree = [];
      for (let i = 0; i < this.node.children.length; i++) {
        this.arrayTree.push(this.node.children[i]);
      }
    },
    updateLst: function() {
      this.node.children.clear();
      if (this.arrayTree)
        for (let i = 0; i < this.arrayTree.length; i++) {
          this.node.children.push(this.arrayTree[i]);
        }
    },
    onAddChild: function() {
      this.node.createChild("Zone");
      this.node.updateShowContent(true);
    },
    onAddEquip: function() {
      this.node.createChild("Equipement");
      this.node.updateShowContent(true);
    },
    sendContext: function() {
      EventBus.$emit("zoneTreeContext", this);
      this.isSelected = true;
      // console.log(this.node);
      // this.node.test();
      let ids = this.node.getItems();
      globalType.v.select(ids, Autodesk.Viewing.SelectionMode.MIXED);
    },
    refresh: function() {
      this.getArray();
      this.hideShowIcon = this.node.showContent.get()
        ? "keyboard_arrow_down"
        : "keyboard_arrow_right";
      this.toggleSimulationIcon = this.node.BIMGroup.active.get()
        ? "check_box"
        : "check_box_outline_blank";
    },
    onChange: function(evt) {
      if (evt.added) {
        //TODO
        if (evt.added.element.isRoot()) {
          evt.added.element.setParent(this.node);
          evt.added.element.rem_attr("relOptions");
        }
        this.node.children.insert(evt.added.newIndex, [evt.added.element]);
        this.node.updateShowContent(true);
      }
      if (evt.removed) {
        this.node.children.splice(evt.removed.oldIndex, 1);
        this.node.updateShowContent();
      }
      if (evt.moved) {
        this.node.children.splice(evt.moved.oldIndex, 1);
        this.node.children.insert(evt.moved.newIndex, [evt.moved.element]);
      }
    },
    toggleShow: function() {
      if (this.node.showContent.get()) {
        this.node.updateShowContent(false);
        // this.hideShowIcon = "keyboard_arrow_right";
      } else if (
        this.node.children.length > 0 ||
        (this.node.BIMGroup && this.node.BIMGroup.BIMObjects.length > 0)
      ) {
        this.node.updateShowContent(true);
        // this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    toggleActivation: function() {
      if (this.node.BIMGroup.active.get()) {
        // this.node.BIMGroup.active.set(false);
        this.node.setAllDatasActive(false);
        this.toggleSimulationIcon = "check_box_outline_blank";
      } else {
        this.node.setAllDatasActive(true);
        // this.node.BIMGroup.active.set(true);
        this.toggleSimulationIcon = "check_box";
      }
    },
    setActivationIcon: function() {
      this.toggleSimulationIcon = this.node.BIMGroup.active.get()
        ? "check_box"
        : "check_box_outline_blank";
    },
    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {
      let event1 = EventBus.$on("simulationMode", this.cbEventTest);
    },
    verifySimulationMode: async function() {
      try {
        // console.log(this.node);
        let root = await this.node.getRoot();
        // console.log(this.node.title.get(), root.title.get());
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
    setTimeout(() => {
      this.verifySimulationMode();
    }, 20);

    this.node.bind(this.refresh);
    this.getEvents();
  }
  // berforeDestroy() {
  //   console.log("dest");
  //   EventBus.$off("simulationMode", this.cbEventTest);
  // }
};
</script>


<style scoped>
.zoneTree {
  width: 100%;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-right-width: 0px;
  /* border-bottom-width: 0px; */
}
</style>

<style>
.zoneTreeselect > div > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}

.zoneTree > div > ul {
  padding: 0;
}
.zoneTree > div > ul > li > div > div {
  padding: 0px 0px 0px 10px;
}
.dragArea {
  min-height: 15px;
}
.dragAreaB {
  min-height: 15px;
  background-color: rgba(196, 20, 58, 0.5);
}

.dragArea > li > div > div {
  padding: 0px 0px 0px 10px;
}
.md-list-item-text {
  margin-left: 10px;
}
</style>
