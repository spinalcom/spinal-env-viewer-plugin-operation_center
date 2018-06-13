
<template>

  <div class="Linker">
    <md-list>
      <draggable class="dragArea"
                 :options="{group:'bimGroup'}"
                 v-model="arrayTree"
                 @start="drag=true"
                 @end="drag=false"
                 @change="onChange">
        <md-list-item class="adjust  "
                      v-show="node.showContent.get()"
                      v-for="index in node.Linker.BIMObjects.length"
                      :key="node.Linker.BIMObjects[index-1].id.get()">

        </md-list-item>

      </draggable>
    </md-list>
  </div>

</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "Linker",
  data() {
    return {};
  },
  props: [],
  components: {
    draggable
  },
  methods: {
    onChange: function(evt) {}
  },
  mounted() {}
};
</script>


<style>
.dragArea {
  min-height: 15px;
}
</style>

