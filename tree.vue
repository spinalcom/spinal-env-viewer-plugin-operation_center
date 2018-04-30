
<template>
  <div class="tree">

    <div>

      <md-button class="md-primary"
                 disabled>
        <small>{{parent.title.get()}}</small>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onAddChild( parent)">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="top">New Zone</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onRemove( parent)">
        <md-icon>clear</md-icon>
      </md-button>

    </div>

    <md-list v-if="arrayTree.length>0">
      <md-list-item class="adjust"
                    v-for="child in arrayTree"
                    :key="child.title">
        <tree :parent="child"></tree>
      </md-list-item>
    </md-list>

    <!-- <md-list class=" adjust">
      <md-list-item v-for="index in parent.children.length"
                    :key="parent.children[index-1].title.get()">
        <div class="adjust">
          <tree :parent="parent.children[index-1]"></tree>
        </div>
      </md-list-item>
    </md-list> -->
  </div>
</template>

<script>
import tree from "./tree.vue";
import { ConfigurationNode as Node } from "./configurationModel";
import EventBus from "./EventBus.vue";
export default {
  name: "tree",
  data() {
    return {
      id: 1,
      arrayTree: []
      // title: ""
    };
  },
  components: {
    tree: tree
  },
  props: ["parent"],
  methods: {
    theif: function() {
      // console.log(this.parent);
      return this.parent.children.length > 0;
    },
    incrementId: function() {
      return this.id++;
    },
    getArray: function() {
      this.arrayTree = [];
      for (let i = 0; i < this.parent.children.length; i++) {
        this.arrayTree.push(this.parent.children[i]);
      }
    },
    onAddChild: function(parent) {
      var parentTitle = parent.title.get();
      this.addChild(parent, parentTitle + "-" + this.incrementId().toString());
    },
    addChild: function(parent, title) {
      var child = new Node(parent);
      child.setTitle(title);
      parent.addChild(child);
    },
    onRemove: function(parent) {
      this.remove(parent);
    },
    remove: function(parent) {
      if (parent.isRoot()) this.removeRoot(parent);
      else parent.remove();
    },
    removeRoot: function(parent) {
      EventBus.$emit("removeRoot", parent);
    },
    refresh: function() {
      this.getArray();
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
</style>