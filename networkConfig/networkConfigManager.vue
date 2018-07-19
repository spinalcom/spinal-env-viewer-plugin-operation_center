<template>

  <md-content class="networkConfigManager md-scrollbar">

    <device-config :device="device"
                   :editingMode="editingMode"></device-config>

    <endpoint-group-config :endpointGroup="endpointGroup"></endpoint-group-config>

    <endpoint-config :endpoint="endpoint"></endpoint-config>

  </md-content>

</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
var EventBus;
import deviceConfig from "./deviceConfig.vue";
import endpointGroupConfig from "./endpointGroupConfig.vue";
import endpointConfig from "./endpointConfig.vue";

export default {
  name: "networkConfigManager",
  data() {
    return {
      device: null,
      endpointGroup: null,
      endpoint: null,

      showEndpointGroup: false,
      showEndpoint: false,
      editingMode: false
    };
  },
  components: { deviceConfig, endpointGroupConfig, endpointConfig },
  watch: {
    editingMode: function() {
      this.getEditingEvents();
    }
  },
  methods: {
    getEditingEvents: function() {
      if (this.editingMode) {
        EventBus.$on("deviceContext", device => {
          this.device = device.deviceNode.element;
          this.endpointGroup = null;
          this.endpoint = null;
        });
        EventBus.$on("EndpointGroupContext", _self => {
          if (typeof _self._data.endpointGroup != null) {
            this.endpointGroup = _self._data.endpointGroup;
            this.endpointGroup.inDevice.load(device => {
              this.device = device;
            });
            this.endpoint = null;
          }
        });

        EventBus.$on("EndpointContext", _self => {
          if (typeof _self.endpoint != null) {
            this.endpoint = _self.endpoint;
            this.endpoint.inGroup.load(endpointGroup => {
              this.endpointGroup = endpointGroup;
              this.endpointGroup.inDevice.load(device => {
                this.device = device;
              });
            });
          }
        });
      }
    },
    getEvents: function() {
      EventBus = globalType.spinal.eventBus;
      EventBus.$on("networkConfigManagerPanelVisibility", visibility => {
        this.editingMode = visibility;
      });
    }
  },

  mounted() {
    this.getEvents();
  }
};
</script>

<style scoped>
.networkConfigManager .md-field {
  min-height: 32px;
}
.networkConfigManager {
  overflow-y: auto;
  height: calc(100% - 35px);
  width: calc(100% - 10px);
}
</style>

<style>
.networkConfigManager .md-toolbar {
  height: 20px;
  min-height: 20px;
  padding: 0px;
}

.networkConfigManager button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.networkConfigManager .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.networkConfigManager .md-title {
  font-size: 15px;
}

.networkConfigManager .md-list,
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

.networkConfigManager i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.networkConfigManager span {
  font-size: 14px;
}

.networkConfigManager .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu,
.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-field,
.small-field * {
  min-height: 0px;
  font-size: 14px !important;
  box-sizing: border-box;
  margin-bottom: 5px;
}
</style>






