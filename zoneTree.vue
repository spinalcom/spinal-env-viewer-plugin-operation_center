
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

          <md-button class="md-icon-button"
                     @click="onAddChild()">
            <md-icon>add</md-icon>
            <md-tooltip md-direction="top">New Zone</md-tooltip>
          </md-button>

          <md-button class="md-icon-button"
                     @click="onAddEquip()">
            <md-icon>add_to_queue</md-icon>
            <md-tooltip md-direction="top">New Equip</md-tooltip>
          </md-button>

        </md-list-item>
      </md-list>

    </div>

    <div v-show="this.node.display.get()">
      <md-list v-if="arrayTree.length>0">
        <md-list-item class="adjust  "
                      v-for="child in arrayTree"
                      :key="child.title">
          <zoneTree :node="child"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

    <bim-group :node="node"></bim-group>

  </div>
</template>

<script>
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
      itemSelected: true
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
      EventBus.$emit("sendContext", this);
      this.isSelected = true;
    },

    select: function() {
      this.itemSelected = true;
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
        this.node.BIMGroup.items.length > 0
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
</style>
