
<template>
  <div class="zoneForest">
    <forest v-if="zoneForest!=null"
            :forest="zoneForest"
            :type="'zone'"
            :relAggregatesList="relZoneAggregatesList"
            :list="zoneList"
            group="'ZoneNode'"></forest>
  </div>
</template>

<script>
var globalType;
var spinalSystem;
var viewer;

import forest from "../assets/utilities/forest.vue";
var EventBus;

export default {
  name: "zoneForest",
  data() {
    return {
      zoneArray: []
    };
  },
  components: {
    forest
  },
  props: ["zoneForest", "relZoneAggregatesList", "zoneList"],
  watch: {
    zoneForest: function(newZoneForest, oldZoneForest) {
      if (
        typeof newZoneForest !== "undefined" &&
        newZoneForest != null &&
        newZoneForest instanceof Model &&
        newZoneForest.has_been_directly_modified()
      ) {
        if (oldZoneForest != null) oldZoneForest.unbind(this.onModelChange);
        newZoneForest.bind(this.onModelChange);
      }
    }
  },
  methods: {
    getArray: function() {
      this.zoneArray = [];
      if (this.zoneForest)
        for (let i = 0; i < this.zoneForest.list.length; i++) {
          this.zoneArray.push(this.zoneForest.list[i]);
        }
    },

    onModelChange: function() {
      this.getArray();
    },

    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        if (this.zoneForest.list.length) {
          let nextIndex = this.zoneForest.removeTree(root);
          // console.log("nextIndex", nextIndex);
          // if (this.zoneForest.list.length >= 0) {
          //   if (typeof this.zoneForest.list[nextIndex] != "undefined")
          //     EventBus.$emit(
          //       "zoneContext",
          //       this.zoneForest.list[nextIndex]
          //     );
          //   else if (typeof this.zoneForest.list[nextIndex + 1] != "undefined")
          //     EventBus.$emit(
          //       "zoneContext",
          //       this.zoneForest.list[nextIndex + 1]
          //     );
          //   else if (typeof this.zoneForest.list[nextIndex - 1] != "undefined")
          //     EventBus.$emit(
          //       "zoneContext",
          //       this.zoneForest.list[nextIndex - 1]
          //     );
          // }
          // } else {
          //   EventBus.$emit("zoneContext", null);
          // }
        }
      });
      // EventBus.$on("simulationMode", _toggleSimulation => {
      //   this.toggleSimulation = _toggleSimulation.get();
      //   console.log(this.toggleSimulation);
      // });
    }
  },

  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>

<style scoped>
.zoneForest {
  height: calc(100% - 40px);
  width: calc(100% - 10px);
}

.mainButtons {
  display: block;
}
.mainMenu {
  height: calc(100% - 80px);
}
/* .md-scrollbar {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow-y: scroll;
} */

.adjust {
  padding: 0;
  width: calc(100% - 5px);
}

/* .dragArea {
  min-height: 50px;
} */
</style>


<style>
/* .draggable,
.draggable *,
.md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
} */

/* .mainMenu > ul > li > div > div {
  padding: 0;
}

i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.md-ripple.md-list-item-content.md-disabled {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

span {
  font-size: 14px;
}

button.md-button.md-theme-default {
  width: 35px;
  height: 35px;
} */
</style>
