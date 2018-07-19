
<template>
  <md-content class="draggableList">
    <md-list>
      <draggable class="dragArea"
                 :options="{group:group}"
                 v-model="array"
                 @start="drag=true"
                 @end="drag=false"
                 @change="onChange">
        <md-list-item @click="test"
                      v-for="(element,index) in array"
                      :key="element.data.value+'-'+index">
          <!-- && element.id.get()" -->
          <!-- <bim-object v-if="type=='BIMObject'"
                      :item="element"
                      :node="node"></bim-object> -->
          <endpoint v-if="type=='endpoint'"
                    :endpoint="element"></endpoint>
          <endpoint-group v-if="type=='endpointGroup'"
                          :endpointGroupPtr="element"></endpoint-group>
        </md-list-item>
      </draggable>
    </md-list>
  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;

import draggable from "vuedraggable";
import endpoint from "../../network/endpoint.vue";
import endpointGroup from "../../network/endpointGroup.vue";

export default {
  name: "draggableList",
  data() {
    return { array: [] };
  },

  props: ["list", "type", "group"],
  components: { draggable, endpoint, endpointGroup },
  methods: {
    getEvents: function() {},
    refresh: function() {
      this.array = [];
      for (let i = 0; i < this.list.length; i++) {
        this.array.push(this.list[i]);
      }
    },
    test: function() {},
    onChange: function() {},
    onModelChange: function() {
      this.refresh();
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.list.bind(this.onModelChange);
  }
};
</script>

<style scoped>
.dragArea {
  min-height: 1px;
}

.dragAreaB {
  min-height: 1px;
  background-color: rgba(196, 20, 58, 0.5);
}
</style>






