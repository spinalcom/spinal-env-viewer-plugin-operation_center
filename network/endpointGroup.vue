<template>
  <md-content class="endpointGroup"
              v-if="endpointGroup!=null"
              @click.stop="sendContext">
    <md-list>
      <md-list-item v-bind:class="{endpointGroupSelect : isSelected}">

        <md-button class="md-icon-button "
                   @click="toggleShow">
          <md-icon>{{hideShowIcon}}
          </md-icon>
        </md-button>

        <div class="md-list-item-text">
          <span> {{this.endpointGroup.name.get()}}</span>
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

          </md-menu-content>
        </md-menu>

      </md-list-item>
    </md-list>
    <draggablelist v-if="show"
                   :list="endpointGroup.list"
                   :type="'endpoint'"
                   :group="'endpoints'"></draggablelist>

  </md-content>
</template>

<script>
import EventBus from "../assets/utilities/EventBus.vue";
import draggablelist from "../assets/utilities/draggableListb.vue";
// let draggablelist = require("../assets/utilities/draggableList.vue");

export default {
  name: "endpointGroup",
  data() {
    return {
      endpointGroup: null,
      show: false,
      hideShowIcon: "arrow_drop_down",
      isSelected: false
    };
  },
  props: ["endpointGroupPtr"],
  components: { draggablelist },
  methods: {
    test: function() {},
    getEvents: function() {},
    onAddEndpoint: function() {
      if (this.endpointGroup != null) this.endpointGroup.createEndpoint();
      this.show = true;
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
    sendContext: function() {
      // if (this.deviceConfigPanel) this.deviceConfigPanel.setVisible(true);
      EventBus.$emit("EndpointGroupContext", this);
      this.isSelected = true;
    },
    deselect: function() {
      this.isSelected = false;
    }
  },
  watch: {
    endpointGroupPtr: function(newEndpointGroupPtr, oldEndpointGroupPtr) {
      if (
        typeof newEndpointGroupPtr !== "undefined" &&
        newEndpointGroupPtr instanceof Model &&
        newEndpointGroupPtr.has_been_directly_modified()
      ) {
        this.newEndpointGroupPtr.load(endpointGroup => {
          this.endpointGroup = endpointGroup;
        });
      }
    }
  },
  mounted() {
    this.getEvents();
    let interval = setInterval(() => {
      if (typeof this.endpointGroupPtr !== "undefined") {
        this.endpointGroupPtr.load(endpointGroup => {
          this.endpointGroup = endpointGroup;
        });
        clearInterval(interval);
      }
    }, 50);
  }
};
</script>

<style scoped>
.endpointGroup {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  padding-left: 10px;
  /* background-color: darkorange; */
}
.endpointGroupSelect {
  background-color: rgba(54, 206, 8, 0.5) !important;
}
</style>







