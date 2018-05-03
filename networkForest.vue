
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

    <!-- <md-list style="display: inline-block">
      <md-list-item>
        <div class='mainMenuLeft'>
          <md-list class=" md-scrollbar ">
            <md-list-item class="adjust"
                          v-for="t in equipArray"
                          :key="t.title">
              <networkTree :parent="t"></networkTree>
            </md-list-item>
          </md-list>
        </div>
      </md-list-item>

      <md-list-item>
        <div class='mainMenuRight'>
          <md-list class=" md-scrollbar ">
            <md-list-item v-for="t in equipArray"
                          :key="t.title">
              <networkTree :parent="t"></networkTree>
            </md-list-item>
          </md-list>
        </div>
      </md-list-item>
    </md-list> -->
    <md-list class=" md-scrollbar ">
      <md-list-item v-for="t in equipArray"
                    :key="t.title">
        <networkTree :parent="t"></networkTree>
      </md-list-item>
    </md-list>

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
      networkForest: null,
      title: "equip",
      equipArray: [],
      networkArray: [],
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
      if (this.networkForest) this.networkForest.addTree(this.title);
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

.mainButtons {
  /* border: 1px green dashed; */

  display: block;
}

.mainMenu {
  width: calc(100% - 10px);
  display: inline-block;
  /* border: 1px yellow dashed; */
}
.mainMenuLeft {
  width: calc(40% - 10px);
  height: calc(100% - 80px);
  /* border: 1px yellow dashed; */
}

.mainMenuRight {
  width: calc(40% - 10px);
  height: calc(100% - 80px);
  /* border: 1px yellow dashed; */
}
.md-scrollbar {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow: auto;
}
.networkTree {
  width: calc(100% - 10px);
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



