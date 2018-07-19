
<template>
  <md-content v-if="device!=null"
              class="deviceConfig">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button"
                 @click="showDevice = !showDevice">
        <md-icon v-if="showDevice">unfold_less</md-icon>
        <md-icon v-else>unfold_more</md-icon>
      </md-button>
      <span style="flex: 1"
            class="md-title"> {{device.name.get()}}</span>
    </md-toolbar>

    <md-content v-show="showDevice">
      <!-- <div class="div1"
           @drop="drop"
           @dragover="allowDrop">
        <span v-if='relatedEquipement!=null'
              style="flex: 1"
              class="md-title"> {{relatedEquipement.name.get()}}</span>
        <span v-else
              tyle="flex: 1"
              class="md-title"> Select an Equipement</span>
      </div> -->
      <!-- <md-list>
        <draggable class="dragArea "
                   :options="{group:'ZoneNode'}"
                   v-model="arrayTree"
                   @start="drag=true"
                   @end="drag=false"
                   @change="onChange">
          <md-list-item v-for="(child,index) in arrayTree"
                        :key="index">
            <span v-if="typeof child ==='string'"
                  style="flex: 1"
                  class="md-title"> {{child}}</span>

          </md-list-item>

        </draggable>
      </md-list> -->
      <md-content v-bind:class="{dragOverStyle : dragOverStyle}"
                  @drop="drop"
                  @dragover="allowDrop">
        <md-field class="small-field">
          <label>Related Equipement</label>

          <md-input v-model="relatedEquipementName"
                    readonly></md-input>

        </md-field>
      </md-content>

      <label style="color:rgba(255,255,255,0.7);"
             for="ip">IP-Address
      </label>
      <md-content>
        <!--  :port="port" -->
        <vue-ip style="flex: 1"
                :ip="ip"
                :on-change="change"
                theme="material"></vue-ip>
        <md-icon style="color: green;"
                 v-if="valid">check</md-icon>

      </md-content>

      <md-field class="small-field">
        <label for="deviceType">Device Type</label>
        <md-select v-if="deviceType!=null"
                   v-model="deviceType"
                   name="deviceType"
                   id="deviceType">
          <md-option class="small-menu"
                     v-for="(choice,index) in deviceTypeChoices"
                     :value="choice"
                     :key="choice+'-'+index">
            {{ choice }}
          </md-option>
        </md-select>
      </md-field>

      <md-field class="small-field">
        <label for="defaultMeasurement">Default Measurement</label>
        <md-select v-if="defaultMeasurement!=null"
                   v-model="defaultMeasurement"
                   name="defaultMeasurement"
                   id="defaultMeasurement">
          <md-option class="small-menu"
                     v-for="(choice,index) in defaultMeasurementChoices"
                     :value="choice"
                     :key="choice+'-'+index">
            {{ choice }}
          </md-option>
        </md-select>
      </md-field>

    </md-content>

  </md-content>
</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var EventBus;
import VueIp from "vue-ip";
import draggable from "vuedraggable";
import image from "./download.png";

export default {
  name: "deviceConfig",
  data() {
    return {
      type: null,
      ip: "127.0.0.1",
      port: "8888",
      valid: false,
      deviceType: null,
      deviceTypeChoices: null,
      defaultMeasurement: null,
      defaultMeasurementChoices: null,
      showDevice: false,
      relatedEquipement: null,
      relatedEquipementName: "select an Equipement",
      arrayTree: [],
      dragOverStyle: false
    };
  },
  props: ["device", "editingMode"],
  components: { VueIp, draggable },
  watch: {
    editingMode: function() {
      this.getEditingEvents();
    },
    deviceType: function(newDeviceType, oldDeviceType) {
      this.device.deviceType.set(newDeviceType);
    },
    defaultMeasurement: function(newDefaultMeasurement, oldDefaultMeasurement) {
      // if (typeof newDefaultMeasurement == "string") {
      this.device.defaultMeasurement.set(newDefaultMeasurement);
      // }
    },
    device: function(newDevice, oldDevice) {
      if (oldDevice != null) {
        oldDevice.defaultMeasurement.lst.unbind(this.updateArray);
        // oldDevice.defaultMeasurement.unbind(this.updateDefaultMeseaurement);
      }

      if (newDevice != null) {
        this.ip = newDevice.ipAddress.get();

        this.deviceTypeChoices = newDevice.deviceType.lst.get();

        this.deviceType = newDevice.deviceType.get();
        this.defaultMeasurement = newDevice.defaultMeasurement.get();
        console.log(this.defaultMeasurement);

        newDevice.relEquipementDevice.load(relEquipementDevice => {
          relEquipementDevice.equipement.load(relatedEquipement => {
            this.relatedEquipement = relatedEquipement;
          });
        });
        newDevice.defaultMeasurement.lst.bind(this.updateArray);
        // newDevice.defaultMeasurement.bind(this.updateDefaultMeseaurement);
      }
    },
    relatedEquipement: function(newRelatedEquipement, oldRelatedEquipement) {
      if (newRelatedEquipement != null) {
        this.device.relEquipementDevice.load(relEquipementDevice => {
          relEquipementDevice.equipement.set(this.relatedEquipement);
          this.relatedEquipement.mod_attr(
            "relEquipementDevice",
            this.device.relEquipementDevice
          );
        });

        this.device.relDeviceEquipement.load(relDeviceEquipement => {
          relDeviceEquipement.equipement.set(this.relatedEquipement);
        });

        this.relatedEquipementName = newRelatedEquipement.name.get();
      } else this.relatedEquipementName = "select an Equipement";
    }
  },
  methods: {
    change(ip, port, valid) {
      if (port > 0 && (port || 8888) < 65535 && valid) {
        this.valid = true;
        this.device.ipAddress.set(ip);
      } else this.valid = false;
    },
    getEditingEvents: function() {
      if (this.editingMode)
        EventBus.$on("equipementOnly", _equipement => {
          if (this.device != null) {
            this.relatedEquipement = _equipement;
          }
        });
    },
    getEvents: function() {},
    updateArray: function() {
      console.log("test");

      this.defaultMeasurementChoices = this.device.defaultMeasurement.lst.get();
    },
    // updateDefaultMeseaurement: function() {
    //   this.defaultMeasurement = this.device.defaultMeasurement.get();
    // },
    onChange: function(evt) {
      if (evt.added) {
        this.arrayTree = [];
        this.arrayTree.push(evt.added.element.element.name.get());
        this.relatedEquipement = evt.added.element.element;
        this.device.relatedEquipement.set(this.relatedEquipement);
      }
    },
    allowDrop: function(ev) {
      ev.preventDefault();
      this.dragOverStyle = true;
    },

    drop: function(ev) {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("equipement");
      if (data > 0) {
        let equipement = globalType.FileSystem._objects[data];
        if (
          typeof equipement !== "undefined" &&
          equipement instanceof Model &&
          equipement.constructor.name === "Zone" &&
          equipement.type.get() === "Equipement"
        )
          this.relatedEquipement = equipement;
      }
      this.dragOverStyle = false;
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    EventBus = globalType.spinal.eventBus;
    this.getEvents({});
  }
};
</script>





<style scoped>
.dragArea {
  min-height: 10px;
}
.dragOverStyle {
  background-color: rgba(25, 172, 172, 0.5);
  border: 5px dashed rgba(0, 0, 0, 0.5);
}
</style>

