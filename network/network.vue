
<template>
  <!--  -->
  <md-content class="network"
              v-bind:class="{networkSelect : isSelected}">
    <!-- <md-toolbar class="md-dense"> -->
    <md-list @click="sendContext">
      <md-list-item>
        <md-button class="md-icon-button"
                   @click="show = !show">
          <md-icon v-if="show">unfold_less</md-icon>
          <md-icon v-else>unfold_more</md-icon>
        </md-button>
        <span style="flex: 1"
              v-if="networkName!=null"
              class="md-title">{{networkName}}</span>

        <md-menu md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>add</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item v-if=" networkName!=null &&networkName.includes('SNMP')"
                          @click="onAddDevice('SNMP')">
              SNMP Device
            </md-menu-item>

            <md-menu-item v-if=" networkName!=null && networkName.includes('BACnet')"
                          @click="onAddDevice('BACnet')">
              BACnet Device
            </md-menu-item>
          </md-menu-content>
        </md-menu>
        <!-- <md-button class="md-icon-button"
                 @click="onRemove()">
        <md-icon>clear</md-icon>
      </md-button> -->
      </md-list-item>
    </md-list>

    <!-- </md-toolbar> -->

    <device-forest v-show="show"
                   v-if="deviceForest!=null"
                   :deviceForest="deviceForest"></device-forest>

  </md-content>
</template>

<script>
import EventBus from "../assets/utilities/EventBus.vue";
import deviceForest from "./deviceForest.vue";
export default {
  name: "network",
  data() {
    return {
      deviceForest: null,
      networkName: null,
      show: false,
      isSelected: false
    };
  },
  props: ["networkPtr"],
  components: { deviceForest },
  // watch: {
  //   networkPtr: function(newNetworkPtr, oldNetworkPtr) {
  //     this.loadData(newNetworkPtr);
  //   }
  // },
  methods: {
    sendContext: function() {
      // if (this.deviceConfigPanel) this.deviceConfigPanel.setVisible(true);
      EventBus.$emit("networkContext", this);
      this.isSelected = true;
    },
    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {},
    promiseLoad(_ptr) {
      return new Promise(resolve => {
        _ptr.load(resolve);
      });
    },
    loadData: function(_networkPtr) {
      if (typeof _networkPtr !== "undefined" && _networkPtr instanceof Model) {
        this.promiseLoad(_networkPtr).then(relForestOptions => {
          this.promiseLoad(relForestOptions.deviceForest).then(deviceForest => {
            this.deviceForest = deviceForest;
          });
        });
        this.promiseLoad(_networkPtr).then(relForestOptions => {
          this.promiseLoad(relForestOptions.options).then(options => {
            this.networkName = options.protocolType.get();
          });
        });
        // this.networkPtr.unbind(this.onModelChange);
        // this.networkPtr.bind(this.onModelChange);
      }
    },
    onAddDevice: function(_protocole) {
      if (this.deviceForest != null) {
        this.deviceForest.addTree(_protocole);
      }
      this.show = true;
    }
  },
  mounted() {
    this.getEvents();
    let interval = setInterval(() => {
      if (typeof this.networkPtr !== "undefined") {
        this.loadData(this.networkPtr);
        clearInterval(interval);
      }
    }, 50);
  }
};
</script>

<style scoped>
.network {
  width: 100%;
}
.network  > ul
  /* > .md-list
  > .md-list-item
  > .md-list-item-container  .md-list-item-content  */
 {
  background-color: black;
}

.networkSelect > ul {
  background-color: rgba(54, 206, 8, 0.5);
}
</style>









