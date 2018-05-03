
<template>
  <div class="networkForest aForest">

    <div class='mainButtons'>
      <md-button class="md-icon-button"
                 @click="onPrintForest">
        <md-icon>print</md-icon>
        <md-tooltip>print networkForest</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onAddSupervisor">
        <md-icon>add</md-icon>
        <md-tooltip>addSupervisor</md-tooltip>
      </md-button>
    </div>

    <div class='mainMenu'>
      <md-list class=" md-scrollbar ">
        <md-list-item class="adjust"
                      v-for="t in equipArray"
                      :key="t.title">
          <networkTree :parent="t"></networkTree>
        </md-list-item>
      </md-list>
    </div>

  </div>
</template>

<script>
import networkTree from "./networkTree.vue";
import EventBus from "./EventBus.vue";
import { Forest as networkForest } from "./configurationModel";
export default {
  name: "networkForest",
  data() {
    return {
      zoneForest: null,
      equipForest: null,
      title: "equip",
      equipArray: [],
      spinalSystem: window.spinalSystem
    };
  },
  components: {
    networkTree: networkTree
  },
  methods: {
    getArray: function() {
      this.equipArray = [];
      if (this.zoneForest)
        for (let i = 0; i < this.zoneForest.list.length; i++) {
          this.equipArray = this.zoneForest.getEquipements();
        }
    },
    onModelChange: function() {
      this.getArray();
    },
    onPrintForest: function() {
      //   console.log(this.zoneForest.getEquipements());
      if (this.equipArray) console.log(this.equipArray);
    },
    onAddSupervisor: function() {
      if (this.equipForest) this.equipForest.addTree(this.title);
    },
    getEvents: function() {},
    linkToDB: function() {
      this.spinalSystem.getModel().then(forgefile => {
        if (forgefile) {
          if (forgefile.configurationModel) {
            forgefile.configurationModel.load(model => {
              this.zoneForest = model.zoneForest;
              this.networkForest = model.networkForest;
              this.zoneForest.bind(this.onModelChange);
              this.networkForest.bind(this.onModelChange);
            });
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
  overflow: Auto;
}
.md-content {
  max-width: 400px;
  max-height: 200px;
  overflow: auto;
}
.networkTree {
  width: calc(50% - 10px);
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>


<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>



