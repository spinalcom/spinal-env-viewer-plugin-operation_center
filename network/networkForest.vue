
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
    <!-- <md-list class=" md-scrollbar ">
      <md-list-item v-for="t in equipArray"
                    :key="t.title">
        <networkTree :parent="t"></networkTree>
      </md-list-item>
    </md-list> -->

    <canvas id="myChart"
            width="400"
            height="400"></canvas>

  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;

import networkTree from "./networkTree.vue";
import EventBus from "../assets/utilities/EventBus.vue";
import { Forest as networkForest } from "../models/configurationModel";
export default {
  name: "networkForest",
  data() {
    return {
      zoneForest: null,
      networkForest: null,
      title: "equip",
      equipArray: [],
      networkArray: [],
      spinalSystem: window.spinalSystem,
      ctx: null,
      myChart: {}
    };
  },
  components: {
    networkTree: networkTree
  },
  methods: {
    getArray: function() {
      // this.equipArray = [];
      // if (this.zoneForest)
      //   for (let i = 0; i < this.zoneForest.list.length; i++) {
      //     this.equipArray = this.zoneForest.getEquipements();
      //   }
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
    getEvents: function() {
      EventBus.$on("zoneTreeContext", _self => {
        if (this.preSelected) this.preSelected.deselect();
        this.preSelected = _self;
        this.self = _self.node;
        this.title = this.getTitle();
      });
    },
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

    // window.Chart = require("Chart");

    // Vue.use(Chart);
    var d = 3;

    this.ctx = globalType.document.getElementById("myChart").getContext("2d");
    this.myChart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: ["0", "1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Zone 9",
            data: [70, 40, d, 50, 65, 55],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 30,
                max: 90,
                beginAtZero: false
              }
            }
          ]
        }
      }
    });
    setInterval(() => {
      var max = 80;
      var min = 40;
      var newValue = (max - min) * Math.random() + min;
      console.log(newValue);
      this.myChart.data.datasets[0].data[2] = newValue;
      this.myChart.update();
    }, 3000);
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



