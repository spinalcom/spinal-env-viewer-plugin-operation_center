
<template>
  <div class="zoneTree">

    <div style=" width:100% ">
      <md-button class="md-icon-button "
                 @click="toggleShow()">
        <md-icon>{{hideShowIcon}}
        </md-icon>
        <md-tooltip md-direction="top">hide-show</md-tooltip>
      </md-button>

      <md-button @click="sendContext()"
                 v-bind:class="{selected : isSelected}">

        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-button class=" md-primary"
                       disabled>
              <small class="text">{{parent.title.get()}}</small>
            </md-button>
          </div>

          <div class="md-layout-item">
            <md-button class="md-icon-button"
                       @click="onAddChild()">
              <md-icon>add</md-icon>
              <md-tooltip md-direction="top">New Zone</md-tooltip>
            </md-button>
          </div>
        </div>

      </md-button>

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
      this.parent.createChild();
      this.setShow();
    },
    sendContext: function() {
      EventBus.$emit("sendContext", this);
      this.isSelected = true;
    },

    refresh: function() {
      this.getArray();
    },
    toggleShow: function() {
      if (this.parent.display.get()) {
        this.parent.display.set(false);
        this.hideShowIcon = "keyboard_arrow_right";
      } else if (this.parent.children.length > 0) {
        this.parent.display.set(true);
        this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    deselect: function() {
      this.isSelected = false;
    },
    setShow: function() {
      this.parent.display.set(true);
      this.hideShowIcon = "keyboard_arrow_down";
    }
  },
  mounted() {
    this.parent.bind(this.refresh);
  }
};
</script>


<style scoped>
.adjust {
  width: calc(100% - 5px);
  border: 1px yellow dashed;
}
.block {
  display: inline;
}
.zone {
  margin: 0px;
}
.selected {
  background-color: rgba(196, 20, 58, 0.5);
  color: white;
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
</style>