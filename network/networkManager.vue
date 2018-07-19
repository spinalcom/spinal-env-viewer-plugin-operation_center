
<template>
  <md-content class="networkManager">

    <md-content class='mainButtons'>
      <md-menu md-direction="bottom-start">
        <md-button class="md-icon-button"
                   md-menu-trigger>
          <md-icon>add</md-icon>
        </md-button>

        <md-menu-content class="small-menu">
          <md-menu-item @click="onCreateTree('SNMP')">
            SNMP Network
          </md-menu-item>
          <md-menu-item @click="onCreateTree('BACnet')">
            BACnet Network
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <linker></linker>
    </md-content>

    <shared-tool-bar-device></shared-tool-bar-device>
    <!-- @click="sendDevice(deviceNode.element)" -->
    <network-list :networkList="networkList"></network-list>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
import linker from "../network/linker.vue";
import networkList from "./networkList.vue";
import sharedToolBarDevice from "./sharedToolBarDevice.vue";
export default {
  name: "networkManager",
  data() {
    return {
      networkList: null
    };
  },
  components: { networkList, sharedToolBarDevice, linker },
  methods: {
    onCreateTree: function(_protocole) {
      if (this.networkList) {
        this.networkList.addNetwork(_protocole);
      }
    },
    getEvents: function() {},
    linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.operationCenter) {
              forgefile.operationCenter.load(model => {
                model.networkList.load(networkList => {
                  this.networkList = networkList;
                });
                globalType.operationCenter = {
                  options: model.options
                };
              });
            } else {
              setTimeout(() => {
                this.linkToDB();
              }, 200);
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.networkManager {
  height: calc(100% - 35px);
}
</style>

<style  >
.networkManager button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.networkManager .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.networkManager .md-title {
  font-size: 15px;
}

.networkManager .md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.networkManager i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.networkManager span {
  font-size: 14px;
}

.networkManager .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>





