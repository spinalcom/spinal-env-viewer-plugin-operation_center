<script>
import Vue from "vue";
const EventBus = new Vue();
let globalType = typeof window === "undefined" ? global : window;
globalType.spinal.eventBus = EventBus;
export default EventBus;
</script>