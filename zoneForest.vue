
<template>
  <div class="zoneForest aForest">

    <div class='mainButtons'>
      <md-button class="md-icon-button"
                 @click="onCreateTree">
        <md-icon>add</md-icon>
        <md-tooltip>Create Tree</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onPrintForest">
        <md-icon>print</md-icon>
        <md-tooltip>print zoneForest</md-tooltip>
      </md-button>
    </div>

    <shared-tool-bar></shared-tool-bar>

    <div class='mainMenu'>
      <md-list class="scroll">
        <md-list-item class="adjust"
                      v-for="t in arrayForest"
                      :key="t.title">
          <zoneTree :parent="t"></zoneTree>
        </md-list-item>
      </md-list>
    </div>

  </div>
</template>

<script>
import zoneTree from "./zoneTree.vue";
import EventBus from "./EventBus.vue";
import sharedToolBar from "./sharedToolBar.vue";
import {
  ConfigurationNode as Node,
  ConfigurationRoot as Root,
  Forest as ZoneForest
} from "./configurationModel";
export default {
  name: "zoneForest",
  data() {
    return {
      zoneForest: {},
      title: "Zone",
      arrayForest: [],
      spinalSystem: window.spinalSystem
    };
  },
  components: {
    zoneTree: zoneTree,
    sharedToolBar: sharedToolBar
  },
  methods: {
    getArray: function() {
      this.arrayForest = [];
      for (let i = 0; i < this.zoneForest.list.length; i++) {
        this.arrayForest.push(this.zoneForest.list[i]);
      }
    },
    onCreateTree: function() {
      this.zoneForest.addTree(this.title);
    },
    onModelChange: function() {
      this.getArray();
    },
    onPrintForest: function() {
      console.log(this.zoneForest.list);
    },
    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        this.zoneForest.removeTree(root);
      });
    },
    linkToDB: function() {
      this.spinalSystem.getModel().then(forgefile => {
        if (forgefile) {
          if (forgefile.configurationModel) {
            forgefile.configurationModel.load(model => {
              this.zoneForest = model;
              this.zoneForest.bind(this.onModelChange);
            });
          } else {
            this.zoneForest = new ZoneForest();
            forgefile.add_attr({
              configurationModel: new Ptr(this.zoneForest)
            });
            this.zoneForest.bind(this.onModelChange);
          }
        }
      });
    }
  },

  mounted() {
    this.linkToDB(), this.getEvents();
  }
};
</script>

<style scoped>
.aForest {
  height: calc(100% - 45px);
  width: calc(100% - 10px);
  border: 3px purple dashed;
}
.adjust {
  padding: 0;
  width: calc(100% - 5px);
  border: 1px red dashed;
}
.mainButtons {
  border: 1px green dashed;
  display: block;
}
.mainMenu {
  height: calc(100% - 52px);
  border: 1px yellow dashed;
}
.scroll {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow: Auto;
}
.md-content {
  max-width: 400px;
  max-height: 200px;
  overflow: auto;
}
</style>


<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>



