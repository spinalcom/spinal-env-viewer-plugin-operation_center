
<template>

  <div class="viewport">

    <md-dialog-prompt :md-active.sync="prompt"
                      v-model="title"
                      md-title="New Title"
                      md-input-maxlength="200"
                      md-confirm-text="Change"
                      @md-confirm="changeTitle()" />
    <md-list>
      <md-list-item>
        <div class="md-list-item-text">
          <span>{{getTitle()}}</span>
        </div>

        <md-button class="md-icon-button"
                   @click="onRemove()">
          <md-icon>clear</md-icon>
        </md-button>

        <md-button class="md-icon-button"
                   @click="onEditTitle()">
          <md-icon>edit</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
  </div>

</template>

<script>
import DialogPrompt from "./dialogPrompt.vue";
import EventBus from "./EventBus.vue";
export default {
  name: "sharedToolBar",
  data() {
    return {
      self: {},
      title: "select a zone",
      prompt: false,
      preSelected: {}
    };
  },
  components: {
    DialogPrompt: DialogPrompt
  },
  methods: {
    onRemove: function() {
      this.remove();
    },
    remove: function() {
      if (this.self.isRoot()) this.removeRoot();
      else this.self.remove();
      this.self = {};
      this.title = "select a zone";
    },
    removeRoot: function() {
      EventBus.$emit("removeRoot", this.self);
    },
    changeTitle: function() {
      if (this.self.title) this.self.title.set(this.title);
      prompt: false;
    },
    getEvents: function() {
      EventBus.$on("sendContext", _self => {
        if (this.preSelected.deselect) this.preSelected.deselect();
        this.preSelected = _self;
        this.self = _self.parent;
        this.title = this.getTitle();
      });
    },
    getTitle: function() {
      return this.self.title ? this.self.title.get() : this.title;
    },
    onEditTitle: function() {
      if (this.self.title) this.prompt = true;
    }
  },
  mounted() {
    this.getEvents();
  }
};
</script>

<style scoped>
.mainMenu {
  height: calc(100% - 52px);
  border: 1px yellow dashed;
}
.viewport {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.viewport /deep/ ul {
  padding: 0px;
}
</style>

<style>
.viewport > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}
</style>





