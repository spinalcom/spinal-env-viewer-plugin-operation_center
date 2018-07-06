<template>
  <md-content class='networkList md-scrollbar'>
    <md-list>
      <md-list-item v-for="(networkPtr,index) in networkPtrArray"
                    :key="networkPtr.data.value+'-'+index">
        <network :networkPtr="networkPtr"></network>
        <md-divider></md-divider>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
var globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
import EventBus from "../assets/utilities/EventBus.vue";
import network from "./network.vue";
export default {
  name: "networkList",
  data() {
    return {
      networkPtrArray: [],
      deviceConfigPanel: null
    };
  },
  props: ["networkList"],
  components: {
    network
  },
  methods: {
    updateArray: function() {
      // let promiseArray = [];
      this.networkPtrArray = [];
      for (
        let index = 0;
        index < this.networkList._attribute_names.length;
        index++
      ) {
        const element = this.networkList[
          this.networkList._attribute_names[index]
        ];
        if (element.constructor.name === "Ptr") {
          // promiseArray.push(this.promiseLoad(element));
          this.networkPtrArray.push(element);
        }
      }
      // Promise.all(promiseArray).then(
      //   networkPtrArray => (this.networkPtrArray = networkPtrArray)
      // );
    },
    onModelChange() {
      this.updateArray();
    },
    getEvents: function() {},
    linkToDB: function() {
      // this.networkList;
      if (this.networkList == null)
        setTimeout(() => {
          this.linkToDB();
        }, 200);
      else this.networkList.bind(this.onModelChange);
    }
  },

  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    this.linkToDB();
    this.getEvents();
  }
};
</script>

<style scoped>
.networkList {
  overflow-y: auto;
  height: calc(100% - 40px);
  width: calc(100% - 10px);
}
</style>




