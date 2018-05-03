
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
      <md-list class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="t in zoneArray"
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
import { ConfigurationModel } from "./configurationModel";
export default {
  name: "zoneForest",
  data() {
    return {
      zoneForest: null,
      title: "Zone",
      zoneArray: [],
      spinalSystem: window.spinalSystem
    };
  },
  components: {
    zoneTree: zoneTree,
    sharedToolBar: sharedToolBar
  },
  methods: {
    getArray: function() {
      this.zoneArray = [];
      if (this.zoneForest)
        for (let i = 0; i < this.zoneForest.list.length; i++) {
          this.zoneArray.push(this.zoneForest.list[i]);
        }
    },
    onCreateTree: function() {
      if (this.zoneForest) this.zoneForest.addTree(this.title);
    },
    onModelChange: function() {
      this.getArray();
    },
    onPrintForest: function() {
      if (this.zoneForest) console.log(this.zoneForest.list);
    },
    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        if (this.zoneForest) this.zoneForest.removeTree(root);
      });
    },
    linkToDB: function() {
      this.spinalSystem.getModel().then(forgefile => {
        if (forgefile) {
          if (forgefile.configurationModel) {
            forgefile.configurationModel.load(model => {
              this.zoneForest = model.zoneForest;
              this.zoneForest.bind(this.onModelChange);
            });
          } else {
            let configurationModel = new ConfigurationModel();
            this.zoneForest = configurationModel.zoneForest;
            console.log("forest", this.zoneForest);
            forgefile.add_attr({
              configurationModel: new Ptr(configurationModel)
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
  /* border: 3px purple dashed; */
}
.adjust {
  padding: 0;
  width: calc(100% - 5px);
  /* border: 1px red dashed; */
}
.mainButtons {
  /* border: 1px green dashed; */
  display: block;
}
.mainMenu {
  height: calc(100% - 80px);
  /* border: 1px yellow dashed; */
}
.md-scrollbar {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow-y: scroll;
}
</style>


<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>



