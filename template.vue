
<template>
  <md-content class="supervisor">
  </md-content>
</template>

<script>
var EventBus;
export default {
  name: "supervisor",
  data() {
    return {};
  },
  components: {},
  methods: {
    getEvents: function() {}
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>






