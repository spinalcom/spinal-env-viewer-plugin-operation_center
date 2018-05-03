<template>
  <div>
    <md-dialog-prompt :md-active.sync="active"
                      v-model="value"
                      :md-title="oldTitle"
                      md-input-maxlength="30"
                      md-confirm-text="Change"
                      @md-confirm="sendEvent()"
                      @md-cancel="cancelEvent()" />
  </div>
</template>

<script>
import EventBus from "./EventBus.vue";
export default {
  name: "DialogPrompt",
  data() {
    return {
      value: ""
    };
  },
  props: ["active", "oldTitle : string"],
  methods: {
    sendEvent: function() {
      var toSend = this.value;
      this.value = "";
      EventBus.$emit("promptValue", toSend);
      console.log("test", this.oldTitle);
    },
    cancelEvent: function() {
      this.value = "";
      EventBus.$emit("disablePrompt");
    }
  }
};
</script>