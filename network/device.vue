
<template>
  <div class="device"
       v-bind:class="{deviceselect : isSelected}">

    <div @click="sendContext()">

      <md-list>
        <md-list-item>
          <md-button class="md-icon-button "
                     @click="toggleShow()">
            <md-icon>{{hideShowIcon}}
            </md-icon>
          </md-button>

          <div class="md-list-item-text">
            <span>{{deviceNode.element.name.get()}}</span>
          </div>

          <md-menu md-direction="bottom-start">
            <md-button class="md-icon-button"
                       md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>

            <md-menu-content class="small-menu">
              <md-menu-item @click="onAddEndpoint()">
                Endpoint
              </md-menu-item>

              <md-menu-item @click="onAddEndpointGroup()">
                Endpoint Group
              </md-menu-item>
              <!-- <md-menu-item v-if="deviceNode.element.protocolType.get()==='SNMP'"
                            @click="onAddNode('SNMP')">
                SNMP Device
              </md-menu-item>
              <md-menu-item v-if="deviceNode.element.protocolType.get()==='BACnet'"
                            @click="onAddNode('BACnet')">
                BACnet Device
              </md-menu-item> -->

            </md-menu-content>
          </md-menu>

        </md-list-item>
      </md-list>

    </div>

    <!-- <div v-if="deviceNode.element.protocolType.get()==='BACnet'">
      <md-list>
        <draggable class="dragArea"
                   v-bind:class="{ dragAreaB: isSelected } "
                   :options="{group:'BACnetdeviceNode'}"
                   v-model="deviceNodeArray"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange">
          <md-list-item @click="test"
                        v-show="deviceNode.showContent.get()"
                        class="adjust"
                        v-for="child in deviceNodeArray"
                        :key="child.element.id.get()">
            <device :deviceNode="child"></device>
          </md-list-item>

        </draggable>
      </md-list>
    </div>

    <div v-if="deviceNode.element.protocolType.get()==='SNMP'">
      <md-list>
        <draggable class="dragArea"
                   v-bind:class="{ dragAreaB: isSelected } "
                   :options="{group:'SNMPdeviceNode'}"
                   v-model="deviceNodeArray"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange">
          <md-list-item @click="test"
                        v-show="deviceNode.showContent.get()"
                        class="adjust"
                        v-for="child in deviceNodeArray"
                        :key="child.element.id.get()">
            <device :deviceNode="child"></device>
          </md-list-item>

        </draggable>
      </md-list>
    </div> -->

    <draggable-list v-if="show"
                    :list="deviceNode.element.endpointGroupsPtrs"
                    :type="'endpointGroup'"
                    :group="'endpointGroup'"></draggable-list>
    <!-- <endpoint-group :endpointGroupPtr="deviceNode.element.endpointGroupsPtrs[0]"></endpoint-group> -->
  </div>
</template>

<script>
import draggable from "vuedraggable";
let globalType = typeof window === "undefined" ? global : window;
var EventBus;
import device from "./device.vue";
import draggableList from "../assets/utilities/draggableList.vue";
// import endpointGroup from "./endpointGroup.vue";
export default {
  name: "device",
  data() {
    return {
      deviceNodeArray: [],
      hideShowIcon: "arrow_drop_down",
      isSelected: false,
      show: false
    };
  },
  components: {
    device,
    draggable,
    // endpointGroup
    draggableList
  },
  props: ["deviceNode", "deviceConfigPanel"],
  watch: {
    deviceNode: function(newDeviceNode) {}
  },
  methods: {
    test: function() {},
    updateDeviceNodeArray: function() {
      this.deviceNodeArray = [];
      for (let i = 0; i < this.deviceNode.children.length; i++) {
        this.deviceNodeArray.push(this.deviceNode.children[i]);
      }
    },
    onAddNode: function(_protocole) {
      this.deviceNode.createChild(_protocole);
      this.deviceNode.updateShowContent(true);
    },
    onAddEndpoint: function() {
      this.deviceNode.element.createEndpoint();
      this.show = true;
    },
    onAddEndpointGroup: function() {
      this.deviceNode.element.createEndpointGroup();
      this.show = true;
    },
    sendContext: function() {
      // if (this.deviceConfigPanel) this.deviceConfigPanel.setVisible(true);
      EventBus.$emit("deviceContext", this);
      this.isSelected = true;
    },
    refresh: function() {
      this.updateDeviceNodeArray();
    },
    onChange: function(evt) {
      if (evt.added) {
        //TODO
        if (evt.added.element.isRoot()) {
          evt.added.element.setParent(this.deviceNode);
          evt.added.element.rem_attr("relOptions");
        }
        this.deviceNode.children.insert(evt.added.newIndex, [
          evt.added.element
        ]);
        this.deviceNode.updateShowContent(true);
      }
      if (evt.removed) {
        this.deviceNode.children.splice(evt.removed.oldIndex, 1);
        this.deviceNode.updateShowContent();
      }
      if (evt.moved) {
        this.deviceNode.children.splice(evt.moved.oldIndex, 1);
        this.deviceNode.children.insert(evt.moved.newIndex, [
          evt.moved.element
        ]);
      }
    },
    toggleShow: function() {
      if (this.show) {
        this.show = false;
        this.hideShowIcon = "arrow_drop_down";
      } else {
        this.show = true;
        this.hideShowIcon = "arrow_drop_up";
      }
    },
    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {}
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.deviceNode.bind(this.refresh);
    this.getEvents();
  }
};
</script>


<style scoped>
.device {
  width: 100%;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-right-width: 0px;
  /* border-bottom-width: 0px; */
}

.dragArea {
  min-height: 1px;
}
.dragAreaB {
  min-height: 1px;
  background-color: rgba(54, 206, 8, 0.5);
}
</style>

<style>
.deviceselect > div > ul > li > div > div {
  background-color: rgba(54, 206, 8, 0.5);
}

.device > div > ul {
  padding: 0;
}
.device > div > ul > li > div > div {
  padding: 0px 0px 0px 4px;
}

.dragArea > li > div > div {
  padding: 0px 0px 0px 4px;
}
/* .md-list-item-text {
  margin-left: 10px;
} */
</style>
