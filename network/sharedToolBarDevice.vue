
<template>
  <div class="sharedToolBarDevice">

    <md-list>
      <md-list-item>
        <div class="md-list-item-text">
          <span>{{name}}</span>
        </div>

        <md-button class="md-icon-button"
                   @click="onRemove()">
          <md-icon>clear</md-icon>
        </md-button>

      </md-list-item>
    </md-list>

  </div>

</template>

<script>
import EventBus from "../assets/utilities/EventBus.vue";
var globalType;
var spinalSystem;
export default {
  name: "sharedToolBarDevice",
  data() {
    return {
      self: null,
      name: "select a device",
      preSelected: null,
      disableSelection: false,
      endpointSelector: null,
      networkPtr: null
    };
  },
  components: {},
  methods: {
    onRemove: function() {
      console.log(this.self);

      if (this.self.constructor.name === "DeviceNode") this.removeDevice();
      else if (this.self.constructor.name === "EndpointGroup")
        this.removeEndpointGroup();
      else if (this.self.constructor.name === "Endpoint") this.removeEndpoint();
      else if (this.self.constructor.name === "RelForestOptions")
        this.removeNetwork();
      this.name = "select a device";
    },
    removeNetwork: function() {
      this.self.options.load(options => {
        for (
          let index = 0;
          index < options.networkList._attribute_names.length;
          index++
        ) {
          const element =
            options.networkList[options.networkList._attribute_names[index]];
          if (
            element.constructor.name === "Ptr" &&
            element.data.value === this.networkPtr.data.value
          ) {
            options.networkList.rem_attr(
              options.networkList._attribute_names[index]
            );
          }
        }
      });
    },
    removeDevice: function() {
      EventBus.$emit("removeDevice", this.self);
      if (this.self != null) {
        this.self.parent.load(p => {
          p.removeTree(this.self);
          this.name = "select a device";
        });
      }
    },
    removeEndpointGroup: function() {
      this.self.inDevice.load(device => {
        for (let index = 0; index < device.endpointGroupsPtrs.length; index++) {
          const endpointGroupPtr = device.endpointGroupsPtrs[index];
          endpointGroupPtr.load(endpointGroup => {
            if (endpointGroup.id.get() === this.self.id.get()) {
              device.endpointGroupsPtrs.splice(index, 1);
            }
          });
        }
      });
    },
    removeEndpoint: function() {
      this.self.inGroup.load(endpointgroup => {
        for (let index = 0; index < endpointgroup.list.length; index++) {
          const endpoint = endpointgroup.list[index];
          if (endpoint.id.get() === this.self.id.get())
            endpointgroup.list.splice(index, 1);
        }
      });
    },
    removeDeviceRoot: function() {
      EventBus.$emit("removeDeviceRoot", this.self);
    },
    getEvents: function() {
      EventBus.$on("networkContext", _self => {
        if (typeof _self.networkPtr !== "undefined") {
          if (this.preSelected) this.preSelected.deselect();
          this.networkPtr = _self.networkPtr;
          _self.networkPtr.load(network => {
            this.preSelected = _self;
            this.self = network;
            network.options.load(options => {
              this.name = options.protocolType.get();
            });
          });
        }
      });

      EventBus.$on("deviceContext", _self => {
        if (typeof _self.deviceNode == "undefined") {
          this.self = _self;
        } else {
          if (this.preSelected) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.deviceNode;
        }
        this.name = this.getDeviceName();
      });

      EventBus.$on("EndpointGroupContext", _self => {
        if (typeof _self._data.endpointGroup != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self._data.endpointGroup;
        }
        this.name = this.self.name.get();
      });

      EventBus.$on("EndpointContext", _self => {
        if (typeof _self.endpoint != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.endpoint;
        }
        this.name = this.self.name.get();
      });
    },
    getDeviceName: function() {
      return this.self != null ? this.self.element.name.get() : this.name;
    }
  },
  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
    this.getEvents();
  }
};
</script>

<style scoped>
.sharedToolBarDevice {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

<style>
.sharedToolBarDevice ul {
  padding: 0px;
}
.sharedToolBarDevice > ul > li > div > div {
  background-color: rgba(54, 206, 8, 0.5);
}
.sharedToolBarDevice > div > ul > li > div > div {
  padding: 0px;
  padding-left: 8px;
}
</style>





