
<template>
  <div class="forest">
    <!-- <b-container>
      <b-row class="text-center">
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip="'ToolTip!'"
                 variant="outline-success">Hover + Focus</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.hover="'ToolTip!'"
                 variant="outline-success">Hover</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.click="'ToolTip!'"
                 variant="outline-success">Click</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.focus="'ToolTip!'"
                 variant="outline-success">Focus</b-btn>
        </b-col>
      </b-row>
    </b-container> -->
    <!-- <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Preferences</md-dialog-title>
       <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="showDialog = false">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>
  </div> -->
    <!-- <DialogPrompt></DialogPrompt> -->
    <md-button class="md-icon-button"
               @click="onCreateTree">
      <md-icon>add</md-icon>
      <md-tooltip>Create Tree</md-tooltip>
    </md-button>

    <md-list v-if="forest.length>0">
      <md-list-item v-for="t in forest"
                    :key="forest.indexOf(t)">
        <div>
          <tree :parent="t"></tree>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import DialogPrompt from "./dialogPrompt.vue";
import tree from "./tree.vue";
import Node from "./configurationModel";
export default {
  name: "forest",
  data() {
    return {
      showDialog: false,
      forest: [],
      id: 1,
      title: "floor"
    };
  },
  components: {
    tree: tree,
    DialogPrompt: DialogPrompt
  },
  methods: {
    incrementId: function() {
      return this.id++;
    },
    onCreateTree: function() {
      this.addTree(this.title + " " + this.incrementId().toString());
    },
    addTree: function(title) {
      var tree = new Node();
      tree.setTitle(title);
      this.forest.push(tree);
    },
    onAddChild: function(parent) {
      this.addChild(parent, this.incrementId());
    },
    addChild: function(parent, title) {
      var child = new Node();
      child.setTitle(title);
      parent.addChild(child);
    }
  }
};
</script>

