
<template>
  <div class="zoneTree">

    <div @click="sendContext()"
         v-bind:class="{zoneTreeselect : isSelected}">

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

          <div v-if="node.BIMGroup.currentValue.get()!==0"
               class="md-list-item-text">
            <span>{{node.BIMGroup.currentValue.get()}}</span>
          </div>

          <md-button class="md-icon-button"
                     @click="onAddChild()">
            <md-icon>add</md-icon>
            <md-tooltip md-direction="top">New Zone</md-tooltip>
          </md-button>

          <md-button v-if="!node.special.get()"
                     class="md-icon-button"
                     @click="generateRandomValue()">
            <md-icon>{{grain}}</md-icon>
            <md-tooltip md-direction="top">Generate Values</md-tooltip>
          </md-button>

          <md-button disabled
                     v-if="node.special.get()"
                     class="md-icon-button">
            <md-icon>grain</md-icon>
            <md-tooltip md-direction="top">snmp</md-tooltip>
          </md-button>

          <!-- <md-button class="md-icon-button"
                     @click="onAddEquip()">
            <md-icon>add_to_queue</md-icon>
            <md-tooltip md-direction="top">New Equip</md-tooltip>
          </md-button> -->

        </md-list-item>
      </md-list>

    </div>

    <div v-show="this.node.display.get()">
      <md-list v-if="arrayTree.length>0">
        <md-list-item class="adjust  "
                      v-for="child in arrayTree"
                      :key="child.title.get()">
          <zoneTree :node="child"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

    <!-- <div v-show="node.display.get()">
      <md-list v-if="node.children.length>0">
        <md-list-item class="adjust  "
                      v-for="index in node.children.length"
                      :key="node.children[index-1].title.get()">
          <zoneTree :node="node.children[index-1]"></zoneTree>
        </md-list-item>
      </md-list>
    </div> -->
    <bim-group :node="node"></bim-group>

  </div>
</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
import DialogPrompt from "./dialogPrompt.vue";
import zoneTree from "./zoneTree.vue";
import EventBus from "./EventBus.vue";
import BIMGroup from "./BIMGroup.vue";
export default {
  name: "zoneTree",
  data() {
    return {
      arrayTree: [],
      hideShowIcon: "keyboard_arrow_right",
      isSelected: false,
      itemSelected: true,
      simulation: false,
      grain: "grain",
      refreshInterval: null
    };
  },
  components: {
    zoneTree: zoneTree,
    bimGroup: BIMGroup
  },
  props: ["node"],
  methods: {
    getArray: function() {
      this.arrayTree = [];
      for (let i = 0; i < this.node.children.length; i++) {
        this.arrayTree.push(this.node.children[i]);
      }
    },
    onAddChild: function() {
      this.node.createChild("zone");
      this.setShow();
    },
    onAddEquip: function() {
      this.node.createChild("equip");
      this.setShow();
    },
    sendContext: function() {
      EventBus.$emit("zoneTreeContext", this);
      this.isSelected = true;
      // console.log(this.node);
      // this.node.test();
      let ids = this.node.getItems();
      globalType.v.select(ids, Autodesk.Viewing.SelectionMode.MIXED);
    },
    generateRandomValue: function() {
      if (!this.simulation) {
        let intervalle = 5;
        this.refreshInterval = setInterval(() => {
          let max = 89;
          let min = 31;
          let newValue = Math.floor((max - min) * Math.random() + min);
          this.node.BIMGroup.currentValue.set(newValue);
          this.node.BIMGroup.populateTimeSeries();
        }, intervalle * 1000);
        this.grain = "stop";
        this.simulation = true;
      } else {
        clearInterval(this.refreshInterval);
        this.grain = "grain";
        this.simulation = false;
      }
    },
    refresh: function() {
      this.getArray();
      this.hideShowIcon = this.node.display.get()
        ? "keyboard_arrow_down"
        : "keyboard_arrow_right";
    },
    toggleShow: function() {
      if (this.node.display.get()) {
        this.node.display.set(false);
        // this.hideShowIcon = "keyboard_arrow_right";
      } else if (
        this.node.children.length > 0 ||
        this.node.BIMGroup.BIMObjects.length > 0
      ) {
        this.node.display.set(true);
        // this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    deselect: function() {
      this.isSelected = false;
    },
    setShow: function() {
      this.node.display.set(true);
      // this.hideShowIcon = "keyboard_arrow_down";
    }
  },
  mounted() {
    this.node.bind(this.refresh);
  }
};
</script>


<style scoped>
.zoneTree {
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

<style>
.zoneTreeselect > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}
.zoneTree > div > ul {
  padding: 0;
}
.zoneTree > div > ul > li > div > div {
  padding: 0px 0px 0px 10px;
}
</style>
