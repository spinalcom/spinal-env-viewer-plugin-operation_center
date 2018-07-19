
<template>
  <md-content class="forest  md-scrollbar ">

    <md-list>

      <draggable :options="{group: group}"
                 v-model="array"
                 @start="drag=true"
                 @end="drag=false"
                 @change="onChange">
        <transition-group name="flip-list">
          <md-list-item @click="test"
                        v-for="(t,index) in array"
                        :key="t.element.id.get()">
            <zone v-if="type=='zone'"
                  :node="t"
                  :relZoneAggregatesList="relAggregatesList"
                  :zoneList="list"
                  @up="onUp(index)"
                  @down="onDown(index)"></zone>
            <device v-if="type=='device'"
                    :deviceNode="t"
                    :deviceConfigPanel="deviceConfigPanel"></device>
          </md-list-item>
        </transition-group>
      </draggable>
    </md-list>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
import draggable from "vuedraggable";
import zone from "../../physical_zones/zone.vue";
import device from "../../network/device.vue";
export default {
  name: "forest",
  data() {
    return { array: [] };
  },
  props: ["forest", "type", "group", "relAggregatesList", "list"],
  components: { draggable, zone, device },
  methods: {
    onUp: function(_index) {
      if (_index > 0) {
        let ele = this.forest.list[_index];
        this.forest.list.splice(_index, 1);
        this.forest.list.insert(_index - 1, [ele]);
      }
    },
    onDown: function(_index) {
      if (_index < this.forest.list.length - 1) {
        let ele = this.forest.list[_index];
        this.forest.list.splice(_index, 1);
        this.forest.list.insert(_index + 1, [ele]);
      }
    },

    test: function() {},
    getEvents: function() {},
    refresh: function() {
      this.array = [];
      for (let i = 0; i < this.forest.list.length; i++) {
        this.array.push(this.forest.list[i]);
      }
    },
    onChange: function(evt) {
      if (evt.added) {
        evt.added.element.removeParent();
        evt.added.element.add_attr({ relOptions: this.forest.relOptions });
        this.forest.list.insert(evt.added.newIndex, [evt.added.element]);
      }
      if (evt.removed) {
        this.forest.list.splice(evt.removed.oldIndex, 1);
      }
      if (evt.moved) {
        this.forest.list.splice(evt.moved.oldIndex, 1);
        this.forest.list.insert(evt.moved.newIndex, [evt.moved.element]);
      }
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.forest.list.bind(this.refresh);
    this.getEvents();
  }
};
</script>


<style scoped>
.md-scrollbar {
  overflow-y: auto;
  height: 100%;
}
.forest {
  width: 100%;
}
.flip-list-move {
  transition: transform 0.2s;
}
.flip-list-enter-active,
.flip-list-leave-active {
  transition: opacity 0.2s;
}
.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
}
</style>







