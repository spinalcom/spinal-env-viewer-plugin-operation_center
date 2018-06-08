
<template>
  <div class="BIMObjectManager">
  </div>
</template>

<script>
import EventBus from "../assets/utilities/EventBus.vue";
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
    this.getEvents();
  }
};
</script>






