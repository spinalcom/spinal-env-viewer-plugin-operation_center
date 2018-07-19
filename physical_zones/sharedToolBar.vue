
<template>
  <div class="sharedToolBar">
    <div class="viewport">

      <md-dialog-prompt :md-active.sync="prompt"
                        v-model="name"
                        md-name="New Name"
                        md-input-maxlength="200"
                        md-confirm-text="Change"
                        @md-confirm="changeName()" />

      <md-list>
        <md-list-item>
          <div class="md-list-item-text">
            <span>{{getName()}}</span>
          </div>

          <md-button class="md-icon-button"
                     @click="onRemove()">
            <md-icon>clear</md-icon>
          </md-button>

          <md-button class="md-icon-button"
                     @click="onEditName()">
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
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
var spinalSystem;
var viewer;
export default {
  name: "sharedToolBar",
  data() {
    return {
      self: null,
      name: "select a zone",
      prompt: false,
      preSelected: null,
      disableSelection: false,
      icon: "visibility_off",
      BIMGroup: null
    };
  },
  components: {
    DialogPrompt: DialogPrompt
  },
  methods: {
    onRemove: function() {
      this.remove();
    },
    remove: async function() {
      EventBus.$emit("removeZone", this.self);
      if (this.self) {
        let items = await this.self.getItems();
        viewer.restoreColorMaterial(items);
        if (this.self.isRoot()) {
          this.removeRoot();
          this.self = null;
          this.name = "select a zone";
        } else {
          this.self.parent.load(p => {
            let parent = p;
            this.self.remove();
            parent.updateShowContent();
            this.self = null;
            this.name = "select a zone";
          });
        }
      }
    },
    removeRoot: function() {
      EventBus.$emit("removeRoot", this.self);
    },
    changeName: function() {
      if (this.self.element.name) this.self.element.name.set(this.name);
      prompt: false;
    },
    getEvents: function() {
      EventBus.$on("zoneContext", _self => {
        if (typeof _self.node == "undefined") {
          this.self = _self;
        } else {
          if (this.preSelected) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.node;
        }
        this.name = this.getName();
        if (typeof this.self.element["relZoneContains"] != "undefined")
          this.self.element["relZoneContains"].load(BIMGroupLst => {
            this.BIMGroup = BIMGroupLst[0];
            this.icon = this.BIMGroup.display.get()
              ? "visibility"
              : "visibility_off";
          });
      });
      EventBus.$on("equipementContext", _self => {
        if (typeof _self.node == "undefined") {
          this.self = _self;
        } else {
          if (this.preSelected) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.node;
        }
        this.name = this.getName();
        if (typeof this.self.element["relZoneContains"] != "undefined")
          this.self.element["relZoneContains"].load(BIMGroupLst => {
            this.BIMGroup = BIMGroupLst[0];
            this.icon = this.BIMGroup.display.get()
              ? "visibility"
              : "visibility_off";
          });
      });
    },
    getName: function() {
      return this.self ? this.self.element.name.get() : this.name;
    },
    onEditName: function() {
      if (this.self) this.prompt = true;
    },
    getSelected: function() {
      //TODO check if a leaf of the autodesk tree

      let selected = viewer.getSelection();
      for (let i = 0; i < selected.length; i++) {
        const itemId = selected[i];
        if (this.self != null) {
          this.self.addBIMObject(itemId);
          this.self.updateShowContent(true);
        }
      }
    },
    displayColor: async function() {
      if (this.self != null) {
        if (this.BIMGroup != null && this.BIMGroup.display.get()) {
          this.self.setAllDisplays(false); //the element included
          this.icon = "visibility_off";
          let items = await this.self.getItems();
          viewer.restoreColorMaterial(items);
        } else {
          this.self.setAllDisplays(true);
          this.icon = "visibility";
        }
      }
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
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





