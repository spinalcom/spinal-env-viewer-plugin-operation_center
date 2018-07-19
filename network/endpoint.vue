<template>
  <md-content class="endpoint"
              v-if="endpoint!=null"
              @click.stop="sendContext">

    <md-list>
      <md-list-item v-bind:class="{endpointSelect : isSelected}">
        <md-button class="md-icon-button "
                   disabled>
          <md-icon>
            stop
          </md-icon>
        </md-button>
        <div class="md-list-item-text">
          <span> {{endpoint.name.get()}}</span>
        </div>

      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
export default {
  name: "endpoint",
  data() {
    return {
      isSelected: false
    };
  },
  components: {},
  props: ["endpoint"],
  methods: {
    sendContext: function() {
      EventBus.$emit("EndpointContext", this);
      this.isSelected = true;
    },

    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {}
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>

<style scoped>
.endpoint {
  width: calc(100% - 2px);
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  padding-left: 10px;
}

.endpointSelect {
  background-color: rgba(54, 206, 8, 0.5) !important;
}
</style>







