
<template>
  <div class="BIMObjectManager">
  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
export default {
  name: "BIMObjectManager",
  data() {
    return {
      currentlySelected: null
    };
  },
  components: {},
  methods: {
    getEvents: function() {
      EventBus.$on("BIMObjectContext", _self => {
        if (this.currentlySelected) this.currentlySelected.deselect();
        this.currentlySelected = _self;
      });
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>






