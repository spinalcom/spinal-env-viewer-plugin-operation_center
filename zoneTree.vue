
<template>
  <div class="zoneTree">

    <div @click="sendContext()"
         class="viewport1"
         v-bind:class="{selected : isSelected}">

      <md-list>
        <md-list-item>

          <md-button class="md-icon-button "
                     @click="toggleShow()">
            <md-icon>{{hideShowIcon}}
            </md-icon>
            <md-tooltip md-direction="top">hide-show</md-tooltip>
          </md-button>

          <div class="md-list-item-text">
            <span>{{parent.title.get()}}</span>
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

    <div v-show="this.parent.display.get()">
      <md-list v-if="arrayTree.length>0">
        <md-list-item class="adjust  "
                      v-for="child in arrayTree"
                      :key="child.title">
          <zoneTree :parent="child"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

  </div>
</template>

<script>
import DialogPrompt from "./dialogPrompt.vue";
import zoneTree from "./zoneTree.vue";
import EventBus from "./EventBus.vue";
export default {
  name: "zoneTree",
  data() {
    return {
      arrayTree: [],
      hideShowIcon: "keyboard_arrow_right",
      isSelected: false
    };
  },
  components: {
    zoneTree: zoneTree
  },
  props: ["parent"],
  methods: {
    getArray: function() {
      this.arrayTree = [];
      for (let i = 0; i < this.parent.children.length; i++) {
        this.arrayTree.push(this.parent.children[i]);
      }
    },
    onAddChild: function() {
      this.parent.createChild("zone");
      this.setShow();
    },
    onAddEquip: function() {
      this.parent.createChild("equip");
      this.setShow();
    },
    sendContext: function() {
      EventBus.$emit("sendContext", this);
      this.isSelected = true;
    },

    refresh: function() {
      this.getArray();
      this.hideShowIcon = this.parent.display.get()
        ? "keyboard_arrow_down"
        : "keyboard_arrow_right";
    },
    toggleShow: function() {
      if (this.parent.display.get()) {
        this.parent.display.set(false);
        // this.hideShowIcon = "keyboard_arrow_right";
      } else if (this.parent.children.length > 0) {
        this.parent.display.set(true);
        // this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    deselect: function() {
      this.isSelected = false;
    },
    setShow: function() {
      this.parent.display.set(true);
      // this.hideShowIcon = "keyboard_arrow_down";
    }
  },
  mounted() {
    this.parent.bind(this.refresh);
  }
};
</script>


<style scoped>
/* .adjust {
  width: calc(100% - 5px);
  border: 1px yellow dashed;
} */
.block {
  display: inline;
}
.zone {
  margin: 0px;
}
.md-layout-item:after {
  width: 100%;
  height: 100%;
  display: block;
  background: #a5d6a7;
  content: " ";
}
.text {
  color: white;
}
</style>

<style>
.adjust .md-list-item-content {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  padding-left: 8px;
}
.zoneTree {
  width: calc(100% - 10px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.viewport1 {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
/* .viewport1 /deep/ ul {
  padding: 0px;
  background-color: rgba(196, 20, 58, 0.5);
} */

.md-list {
  padding: 0px;
}
</style>

<style>
.selected > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}
</style>
