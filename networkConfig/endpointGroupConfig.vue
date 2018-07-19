
<template>
  <md-content v-if="endpointGroup !=null"
              class="endpointGroupConfig">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button"
                 @click="showEndpointGroup = !showEndpointGroup">
        <md-icon v-if="showEndpointGroup">unfold_less</md-icon>
        <md-icon v-else>unfold_more</md-icon>
      </md-button>
      <span class="md-title"> {{endpointGroup.name.get()}}</span>
    </md-toolbar>

    <md-content v-show="showEndpointGroup">
      <md-field class="small-field">
        <label for="endpointGroupType">Group Type</label>
        <md-select v-if="endpointGroupType!=null"
                   v-model="endpointGroupType"
                   name="endpointGroupType"
                   id="endpointGroupType">
          <md-option class="small-menu"
                     v-for="(choice,index) in endpointGroupTypeChoices"
                     :value="choice"
                     :key="index">
            {{ choice }}
          </md-option>
        </md-select>
      </md-field>
    </md-content>
  </md-content>
</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
var EventBus;
export default {
  name: "endpointGroupConfig",
  data() {
    return {
      showEndpointGroup: false,
      endpointGroupTypeChoices: null,
      endpointGroupType: null
    };
  },
  props: ["endpointGroup"],
  components: {},
  watch: {
    endpointGroupType: function(newEndpointGroupType, oldEndpointGroupType) {
      this.endpointGroup.type.set(newEndpointGroupType);
    },
    endpointGroup: function(newEndpointGroup, oldEndpointGroup) {
      if (newEndpointGroup != null) {
        this.endpointGroupTypeChoices = newEndpointGroup.type.lst.get();
        this.endpointGroupType = newEndpointGroup.type.get();
      }
    }
  },
  methods: {
    getEvents: function() {}
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>


<style scoped>
.endpointGroupConfig {
  width: calc(100%);
}
</style>





