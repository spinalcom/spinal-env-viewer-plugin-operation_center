
<template>
  <md-content v-if="endpoint !=null"
              class="endpointConfig">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button"
                 @click="showEndpoint = !showEndpoint">
        <md-icon v-if="showEndpoint">unfold_less</md-icon>
        <md-icon v-else>unfold_more</md-icon>
      </md-button>
      <span style="flex: 1"
            class="md-title"> {{endpoint.name.get()}}</span>
    </md-toolbar>

    <md-content v-show="showEndpoint">
      <md-field class="small-field">
        <label>Name</label>
        <md-input v-model="name"></md-input>
      </md-field>

      <md-field class="small-field">
        <label>Path</label>
        <md-input v-model="path"></md-input>
      </md-field>
    </md-content>

  </md-content>
</template>

<script>
import EventBus from "../assets/utilities/EventBus.vue";
var debounce = require("lodash.debounce");

export default {
  name: "endpointConfig",
  data() {
    return {
      showEndpoint: false,
      name: "",
      path: ""
    };
  },
  props: ["endpoint"],
  components: {},
  watch: {
    endpoint: function(newEndpoint, oldEndpoint) {
      if (newEndpoint != null) {
        this.name = newEndpoint.name.get();
        this.path = newEndpoint.path.get();
      }
    },
    name: function(newName, oldName) {
      this.endpoint.name.set(newName);
      // console.log("test");
      // this.debounceUpdate();
    },
    path: function(newPath, oldPath) {
      this.endpoint.path.set(newPath);
      // console.log("test");
      // this.debounceUpdate();
    }
  },
  methods: {
    getEvents: function() {},
    updateName: function() {
      this.endpoint.name.set(this.name);
    }
  },
  created() {
    this.debounceUpdate = debounce(this.updateName, 500);
  },
  mounted() {
    this.getEvents();
  }
};
</script>


<style scoped>
.endpointConfig {
  width: calc(100%);
}
</style>





