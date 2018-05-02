
<template>
  <div class="forest aForest">
    <!-- <b-container>
      <b-row class="text-center">
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip="'ToolTip!'"
                 variant="outline-success">Hover + Focus</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.hover="'ToolTip!'"
                 variant="outline-success">Hover</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.click="'ToolTip!'"
                 variant="outline-success">Click</b-btn>
        </b-col>
        <b-col md="3"
               class="py-3">
          <b-btn v-b-tooltip.focus="'ToolTip!'"
                 variant="outline-success">Focus</b-btn>
        </b-col>
      </b-row>
    </b-container> -->
    <!-- <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Preferences</md-dialog-title>
       <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="showDialog = false">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>
  </div> -->
    <!-- <DialogPrompt></DialogPrompt> -->
    <div class='mainButtons'>
      <md-button class="md-icon-button"
                 @click="onCreateTree">
        <md-icon>add</md-icon>
        <md-tooltip>Create Tree</md-tooltip>
      </md-button>

      <md-button class="md-icon-button"
                 @click="onPrintForest">
        <md-icon>print</md-icon>
        <md-tooltip>print forest</md-tooltip>
      </md-button>
    </div>

    <div class='mainMenu'>
      <!-- v-if="forest.length>0" -->
      <md-list class="scroll">

        <md-list-item class="adjust"
                      v-for="t in arrayForest"
                      :key="t.title">

          <tree :parent="t"></tree>

        </md-list-item>

      </md-list>

      <!-- <md-list>
      <md-list-item v-for="index in forest.length"
                    :key="forest[index-1].title.get()">
        <div>
          <tree :parent="forest[index-1]"></tree>
        </div>
      </md-list-item>

    </md-list> -->

      <!-- <md-list>
      <md-list-item class="adjust"
                    v-for="(t,index) in forest.vueArray"
                    :key="index">
        {{forest.vueArray.title}}
        <div class="adjust">
          <tree :parent="t"></tree>
        </div>
      </md-list-item>

    </md-list> -->
    </div>
  </div>
</template>

<script>
import DialogPrompt from "./dialogPrompt.vue";
import tree from "./tree.vue";
import EventBus from "./EventBus.vue";
import {
  ConfigurationNode as Node,
  ConfigurationRoot as Root,
  forest
} from "./configurationModel";
export default {
  name: "forest",
  data() {
    return {
      showDialog: false,
      forest: {},
      title: "Zone",
      arrayForest: [],
      spinalSystem: window.spinalSystem
    };
  },
  components: {
    tree: tree,
    DialogPrompt: DialogPrompt
  },
  methods: {
    incrementId: function() {
      this.forest.id.set(this.forest.id.get() + 1);
      return this.forest.id.get();
    },
    getArray: function() {
      this.arrayForest = [];
      for (let i = 0; i < this.forest.list.length; i++) {
        this.arrayForest.push(this.forest.list[i]);
      }
    },
    onCreateTree: function() {
      this.forest.addTree(this.title + " " + this.incrementId().toString());
    },
    // addTree: function(title) {
    //   var tree = new Root();
    //   tree.setTitle(title);
    //   this.forest.list.push(tree);
    // },
    linkToDB: function() {
      this.spinalSystem.getModel().then(forgefile => {
        // console.log("spinal model dictionary");
        if (forgefile) {
          // console.log(forgefile);
          if (forgefile.configurationModel) {
            forgefile.configurationModel.load(model => {
              this.forest = model;
              this.forest.bind(this.onModelChange);
            });
          } else {
            this.forest = new Forest();
            forgefile.add_attr({
              configurationModel: new Ptr(this.forest)
            });
            this.forest.bind(this.onModelChange);
          }
        }
      });
    },
    updateVueArray: function() {
      this.forest.vueArray = [];
      let forestLength = this.forest.list.length;
      // let vueArrayLength = this.forest.vueArray.length;
      // if (forestLength > vueArrayLength) {
      //   for (let i = vueArrayLength - 1; i < forestLength - 1; i++) {
      //     this.forest.vueArray.push(this.forest[i]);
      //   }
      // }
      for (let i = 0; i < forestLength; i++) {
        this.forest.vueArray[i] = this.forest.list[i];
      }
    },
    onModelChange: function() {
      this.getArray();
      // this.updateVueArray();
    },
    onPrintForest: function() {
      console.log(this.forest.list);
    },
    removeRoot: function(root) {
      this.forest.list.remove(root);
      delete FileSystem._objects[root._server_id];
    },
    getEvents: function() {
      EventBus.$on("removeRoot", root => {
        this.removeRoot(root);
        // console.log(root);
      });
    }
  },

  mounted() {
    this.linkToDB(), this.getEvents();
  }
};
</script>

<style scoped>
.aForest {
  height: calc(100% - 45px);
  width: calc(100% - 10px);
  border: 3px purple dashed;
}
.adjust {
  padding: 0;
  width: calc(100% - 5px);
  border: 1px red dashed;
}
.mainButtons {
  border: 1px green dashed;
  display: block;
}
.mainMenu {
  height: calc(100% - 52px);
  border: 1px yellow dashed;
}
.scroll {
  height: calc(100% - 20px);
  width: calc(100% - 5px);
  overflow: Auto;
}
.md-content {
  max-width: 400px;
  max-height: 200px;
  overflow: auto;
}
</style>


<style>
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>



