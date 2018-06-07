
<template>
  <div class="sharedToolBar">
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

          <md-button class="md-icon-button"
                     @click="getSelected()">
            <md-icon>add_to_photos</md-icon>
          </md-button>

          <md-button class="md-icon-button"
                     @click="displayColor()">
            <md-icon>{{icon}}</md-icon>
          </md-button>

          <!-- <md-button class="md-icon-button"
                     @click="showAll()">
            <md-icon>visibility</md-icon>
          </md-button> -->

        </md-list-item>
      </md-list>
    </div>
  </div>

</template>

<script>
import DialogPrompt from "../asset/utilities/dialogPrompt.vue";
import EventBus from "../asset/utilities/EventBus.vue";
import {
  SpinalBIMGroup as BIMGroup,
  SpinalBIMObject as BIMObject
} from "../models/ConfigurationModel.js";
let globalType = window ? window : global;
export default {
  name: "sharedToolBar",
  data() {
    return {
      self: null,
      title: "select a zone",
      prompt: false,
      preSelected: null,
      disableSelection: false,
      viewer: globalType.v,
      icon: "visibility_off"
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
      EventBus.$emit("removeZone", this.self);
      if (this.self) {
        this.viewer.restoreColorMaterial(this.self.getItems());
        if (this.self.isRoot()) this.removeRoot();
        else {
          let parent = this.self.parent;
          this.self.remove();
          if (parent.children.length == 0 && parent.BIMGroup.items.length == 0)
            parent.display.set(false);
        }
        this.self = null;
        this.title = "select a zone";
      }
    },
    removeRoot: function() {
      EventBus.$emit("removeRoot", this.self);
    },
    changeTitle: function() {
      if (this.self.title) this.self.title.set(this.title);
      prompt: false;
    },
    getEvents: function() {
      EventBus.$on("zoneTreeContext", _self => {
        if (this.preSelected) this.preSelected.deselect();
        this.preSelected = _self;
        this.self = _self.node;
        this.title = this.getTitle();
        this.icon = this.self.BIMGroup.display.get()
          ? "visibility"
          : "visibility_off";
      });
    },
    getTitle: function() {
      return this.self ? this.self.title.get() : this.title;
    },
    onEditTitle: function() {
      if (this.self) this.prompt = true;
    },
    getSelected: function() {
      //TODO check if a leaf of the autodesk tree
      let selected = this.viewer.getSelection();
      for (let i = 0; i < selected.length; i++) {
        const itemId = selected[i];
        if (this.self) {
          this.self.BIMGroup.addItem(itemId);
          this.self.display.set(true);
        }
      }
    },
    displayColor() {
      if (this.self) {
        if (this.self.BIMGroup.display.get()) {
          this.self.setAllDisplays(false); //the element included
          this.icon = "visibility_off";
          this.viewer.restoreColorMaterial(this.self.getItems());
        } else {
          this.self.setAllDisplays(true);
          this.icon = "visibility";
        }
      }
    }
  },
  mounted() {
    this.getEvents();
  }
};
</script>

<style scoped>
.viewport {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

<style>
.viewport ul {
  padding: 0px;
}
.viewport > ul > li > div > div {
  background-color: rgba(196, 20, 58, 0.5);
}
.sharedToolBar > div > ul > li > div > div {
  padding: 0px;
  padding-left: 8px;
}
</style>





