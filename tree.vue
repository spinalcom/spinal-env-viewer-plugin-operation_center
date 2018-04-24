
<template>
  <div class="tree">
    <md-button class="md-raised md-primary"
               @click="onAddChild( parent)">{{parent.title}}
      <md-tooltip md-direction="top">New Element</md-tooltip>
    </md-button>
    <md-list v-if="parent.children.length>0">
      <md-list-item v-for="child in parent.children"
                    :key="parent.children.indexOf(child)">
        <div>
          <tree :parent="child"></tree>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import tree from "./tree.vue";
import Node from "./configurationModel";
export default {
  name: "tree",
  data() {
    return {
      id: 1
    };
  },
  components: {
    tree: tree
  },
  props: {
    parent: {}
  },
  methods: {
    incrementId: function() {
      return this.id++;
    },
    onAddChild: function(parent) {
      var title = "element";
      if (this.parent.isRoot()) {
        title = "Room";
      }
      this.addChild(parent, title + " " + this.incrementId().toString());
    },
    addChild: function(parent, title) {
      var child = new Node();
      child.setTitle(title);
      parent.addChild(child);
    }
  }
};
</script>
