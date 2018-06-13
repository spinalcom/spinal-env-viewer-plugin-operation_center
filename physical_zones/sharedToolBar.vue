
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
import DialogPrompt from "../assets/utilities/dialogPrompt.vue";
import EventBus from "../assets/utilities/EventBus.vue";
var globalType;
var spinalSystem;
var viewer;
export default {
  name: "sharedToolBar",
  data() {
    return {
      self: null,
      title: "select a zone",
      prompt: false,
      preSelected: null,
      disableSelection: false,
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
        viewer.restoreColorMaterial(this.self.getItems());
        if (this.self.isRoot()) {
          this.removeRoot();
          this.self = null;
          this.title = "select a zone";
        } else {
          this.self.parent.load(p => {
            let parent = p;
            this.self.remove();
            parent.updateShowContent();
            this.self = null;
            this.title = "select a zone";
          });
        }
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
        if (typeof _self.node == "undefined") {
          this.self = _self;
        } else {
          if (this.preSelected) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.node;
        }
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
      let selected = viewer.getSelection();
      for (let i = 0; i < selected.length; i++) {
        const itemId = selected[i];
        if (this.self != null) {
          this.self.BIMGroup.addItem(itemId);
          this.self.updateShowContent(true);
        }
      }
    },
    displayColor() {
      if (this.self) {
        if (this.self.BIMGroup.display.get()) {
          this.self.setAllDisplays(false); //the element included
          this.icon = "visibility_off";
          viewer.restoreColorMaterial(this.self.getItems());
        } else {
          this.self.setAllDisplays(true);
          this.icon = "visibility";
        }
      }
    }
  },
  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
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





