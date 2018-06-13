
<template>

  <div class="BIMGroup">
    <md-list>
      <draggable class="dragArea"
                 :options="{group:'bimGroup'}"
                 v-model="arrayBIMGroup"
                 @start="drag=true"
                 @end="drag=false"
                 @change="onChange">
        <md-list-item class="adjust  "
                      v-bind:class="{ dragAreaB: nodeSelected } "
                      v-show="node.showContent.get()"
                      v-for="BIMObject in arrayBIMGroup"
                      :key="BIMObject.id.get()">
          <bim-object :item="BIMObject"
                      :group="node.BIMGroup"></bim-object>
        </md-list-item>
      </draggable>
    </md-list>
  </div>

  <!-- <div class="BIMGroup"
       v-show="node.showContent.get()">
    <md-list v-if=" node.BIMGroup.BIMObjects.length>0">
      <md-list-item class="adjust  "
                    v-for="index in node.BIMGroup.BIMObjects.length"
                    :key="node.BIMGroup.BIMObjects[index-1].id.get()">
        <bim-object :item="node.BIMGroup.BIMObjects[index-1]"
                    :group="node.BIMGroup"></bim-object>
      </md-list-item>
    </md-list>
  </div> -->

</template>

<script>
import draggable from "vuedraggable";
import BIMObject from "./BIMObject.vue";
export default {
  name: "BIMGroup",
  data() {
    return {
      arrayBIMGroup: [],
      self: null,
      isSelected: true
    };
  },
  props: ["node", "nodeSelected"],
  components: {
    bimObject: BIMObject,
    draggable
  },
  methods: {
    getArray: function() {
      this.arrayBIMGroup = [];
      for (let i = 0; i < this.node.BIMGroup.BIMObjects.length; i++) {
        this.arrayBIMGroup.push(this.node.BIMGroup.BIMObjects[i]);
      }
    },
    onChange: function(evt) {
      if (evt.added) {
        this.node.BIMGroup.addItems([evt.added.element], evt.added.newIndex);
        this.node.updateShowContent(true);
      }
      if (evt.removed) {
        this.node.BIMGroup.removeItemByIndex(evt.removed.oldIndex);
        this.node.updateShowContent();
      }
      if (evt.moved) {
      }
    },
    refresh: function() {
      this.getArray();
    }
  },
  mounted() {
    this.node.BIMGroup.bind(this.refresh);
  }
};
</script>


<style>
.dragArea {
  min-height: 15px;
}

.dragAreaB {
  min-height: 15px;
  background-color: rgba(196, 20, 58, 0.5);
}
</style>

