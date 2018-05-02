
<template>
  <div class="zoneTree">

    <div class="block">
      <md-button>

        <md-button class="md-icon-button"
                   @click="toggleShow()">
          <md-icon>{{hideShowIcon}}
          </md-icon>
          <md-tooltip md-direction="top">hide-show</md-tooltip>
        </md-button>

        <md-button class="md-primary"
                   disabled>
          <small>{{parent.title.get()}}</small>
        </md-button>

        <md-button class="md-icon-button"
                   @click="onAddChild()">
          <md-icon>add</md-icon>
          <md-tooltip md-direction="top">New Zone</md-tooltip>
        </md-button>

        <md-button class="md-icon-button"
                   @click="onRemove()">
          <md-icon>clear</md-icon>
        </md-button>

      </md-button>
    </div>

    <div v-show="show">
      <md-list v-if="arrayTree.length>0">
        <md-list-item class="adjust"
                      v-for="child in arrayTree"
                      :key="child.title">
          <zoneTree :parent="child"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

  </div>
</template>

<script>
import zoneTree from "./zoneTree.vue";
import EventBus from "./EventBus.vue";
export default {
  name: "zoneTree",
  data() {
    return {
      arrayTree: [],
      show: false,
      hideShowIcon: "keyboard_arrow_right"
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

    onRemove: function() {
      this.remove();
    },
    remove: function() {
      if (this.parent.isRoot()) this.removeRoot();
      else this.parent.remove();
    },
    removeRoot: function() {
      EventBus.$emit("removeRoot", this.parent);
    },
    refresh: function() {
      this.getArray();
    },
    toggleShow: function() {
      if (this.show) {
        this.show = false;
        this.hideShowIcon = "keyboard_arrow_right";
      } else {
        this.show = true;
        this.hideShowIcon = "keyboard_arrow_down";
      }
    },
    setShow: function() {
      this.show = true;
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
/* .md-list {
  padding: 0px !important;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  max-width: 100%;
  max-height: 100%;
  vertical-align: top;
  border: 3px red dashed;
} */

/* .md-list {
  padding: 0px;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  max-width: 100%;
  max-height: 100%;
  vertical-align: top;
  border: 1px green;
} */

.block {
  display: inline;
}
</style>