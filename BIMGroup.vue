
import { BIMObject } from './endpointModel';
<template>
  <div class="BIMGroup"
       v-show="node.display.get()">
    <md-list v-if="node.BIMGroup.items.length>0">
      <md-list-item class="adjust  "
                    v-for="index in node.BIMGroup.items.length"
                    :key="node.BIMGroup.items[index-1].id.get()">
        <bim-object :item="node.BIMGroup.items[index-1]"></bim-object>
      </md-list-item>
    </md-list>
  </div>

</template>

<script>
import BIMObject from "./BIMObject.vue";
export default {
  name: "BIMGroup",
  data() {
    return {
      self: null,
      isSelected: true
    };
  },
  props: ["node"],
  components: { bimObject: BIMObject },
  methods: {},
  mounted() {}
};
</script>


<style>
.viewport2 {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.md-list {
  padding: 0px;
}

.selected2 > ul > li > div > div {
  background-color: rgba(18, 27, 107, 0.5);
}
</style>

