
<template>

  <div class="BIMGroup">
    <md-list>
      <draggable class="dragArea"
                 :options="{group:'bimGroup'}"
                 v-model="arrayBIMGroup"
                 @start="drag=true"
                 @end="drag=false"
                 @change="onChange"
                 v-bind:class="{ dragAreaB: nodeSelected } ">
        <md-list-item @click="test"
                      class="adjust  "
                      v-show="node.showContent.get()"
                      v-for="BIMObject in arrayBIMGroup"
                      :key="BIMObject.id.get()">
          <bim-object :item="BIMObject"
                      :node="node"></bim-object>
        </md-list-item>
      </draggable>
    </md-list>
  </div>

  <!-- <div class="BIMGroup"
       v-show="node.showContent.get()">
    <md-list v-if=" node.element.BIMGroup.BIMObjects.length>0">
      <md-list-item class="adjust  "
                    v-for="index in node.element.BIMGroup.BIMObjects.length"
                    :key="node.element.BIMGroup.BIMObjects[index-1].id.get()">
        <bim-object :item="node.element.BIMGroup.BIMObjects[index-1]"
                    :group="node.element.BIMGroup"></bim-object>
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
      isSelected: true,
      BIMGroup: null
    };
  },
  props: ["node", "nodeSelected"],
  components: {
    bimObject: BIMObject,
    draggable
  },
  methods: {
    test: function() {},
    getArray: function() {
      this.arrayBIMGroup = [];
      if (this.BIMGroup != null) {
        for (let i = 0; i < this.BIMGroup.BIMObjects.length; i++) {
          this.arrayBIMGroup.push(this.BIMGroup.BIMObjects[i]);
        }
      }
    },
    onChange: function(evt) {
      if (evt.added) {
        if (this.BIMGroup != null)
          this.BIMGroup.addItems([evt.added.element], evt.added.newIndex);
        this.node.updateShowContent(true);
      }
      if (evt.removed) {
        if (this.BIMGroup != null)
          this.BIMGroup.removeItemByIndex(evt.removed.oldIndex);
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
    this.node.element["relZoneContains"].load(BIMGroupLst => {
      this.BIMGroup = BIMGroupLst[0];
      this.BIMGroup.bind(this.refresh);
    });
    // this.node.element.BIMGroup.bind(this.refresh);
  }
};
</script>


<style scoped>
.BIMGroup .md-list-item {
  padding-left: 9px;
  border-left: 2px rgba(0, 0, 0, 1);
  border-left-style: solid;
}

/* .BIMGroup > ul > div > li {
  padding-left: 10px;
  border-left: 2px rgba(0, 0, 0, 1);
  border-left-style: solid;
  background-color: brown;
} */
.dragArea {
  min-height: 1px;
}

.dragAreaB {
  min-height: 1px;
  background-color: rgba(196, 20, 58, 0.5);
}
</style>


