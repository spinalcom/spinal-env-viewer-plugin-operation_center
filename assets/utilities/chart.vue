
<template>
  <div class="chart aChart">
    <canvas id="chart1"
            width="500"
            height="400"></canvas>

    <center>
      <img :src="image" />
    </center>

  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
import image from "../images/spe.png";
import EventBus from "./EventBus.vue";
import Chart from "chart.js";
export default {
  name: "chart",
  data() {
    return {
      spinalSystem: window.spinalSystem,
      ctx: null,
      chart1: {},
      self: null,
      // refreshInterval: null
      image: image
    };
  },
  components: {},
  methods: {
    generateRandomValue: function() {
      let max = 80;
      let min = 40;
      return (max - min) * Math.random() + min;
    },
    addData: function(label, data) {
      this.chart1.data.labels.push(label);
      this.chart1.data.datasets.forEach(dataset => {
        dataset.data.push(data);
      });
      this.chart1.update();
    },
    removeData: function() {
      this.chart1.data.labels.pop();
      this.chart1.data.datasets.forEach(dataset => {
        dataset.data.shift();
      });
      this.chart1.update();
    },
    initialize: function() {
      let NumberOfValues = 30;
      let labels = [];
      for (let index = 0; index < NumberOfValues; index++) {
        (index + 1).toString();
        labels[index] = "";
      }
      let data = [];
      for (let index = 0; index < NumberOfValues; index++) {
        data[index] = this.generateRandomValue();
      }

      this.ctx = globalType.document.getElementById("chart1").getContext("2d");
      this.chart1 = new Chart(this.ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Select a Zone",
              data: data,
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
                  min: -10,
                  max: 90,
                  beginAtZero: false
                }
              }
            ]
          },
          animation: false
        }
      });
    },
    refresh: function() {
      // console.log("test");

      this.chart1.data.datasets[0].data = this.self.BIMGroup.timeSeries.get();
      this.chart1.update();
      // let intervalle = 2;
      // this.refreshInterval = setInterval(() => {
      //   if (this.self !== null) {
      //     // let newValue = this.generateRandomValue();
      //     // this.chart1.data.datasets[0].data[2] = newValue;
      //     // this.removeData();
      //     // this.addData("", this.self.BIMGroup.timeSeries[29].get());
      //     this.chart1.data.datasets[0].data = this.self.BIMGroup.timeSeries.get();
      //     this.chart1.update();
      //   }
      // }, intervalle * 1000);
    },
    getEvents: function() {
      EventBus.$on("zoneTreeContext", _self => {
        if (typeof _self.node == "undefined") {
          this.self = _self;
        } else {
          this.self = _self.node;
        }
        this.chart1.data.datasets[0].data = this.self.BIMGroup.timeSeries.get();
        this.chart1.data.datasets[0].label = this.self.title.get();
        this.chart1.update();
        this.self.BIMGroup.bind(this.refresh);
        // if (this.refreshInterval === null) this.refresh();
      });
      EventBus.$on("removeZone", _self => {
        // console.log(_self);
        if (this.self === _self) {
          // console.log("test");
          // if (this.refreshInterval !== null) {
          //   clearInterval(this.refreshInterval);
          //   this.refreshInterval = null;
          this.chart1.data.datasets[0].label = "Select a Zone";
          this.chart1.update();
        }
        // }
      });
    },
    linkToDB: function() {
      if (this.self != null) this.self.BIMGroup.bind(this.refresh);
    }
  },

  mounted() {
    this.linkToDB(), this.getEvents(), this.initialize();
  }
};
</script>

<style scoped>
.aChart {
  height: calc(100% - 45px);
  width: calc(100% - 10px);
}
</style>

<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>



