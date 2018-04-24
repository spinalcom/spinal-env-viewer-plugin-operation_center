<template>
  <div>
    hey {{coucou}} - {{count}}
    <md-button @click="getSelection">
      TEST3 GET SELECTION
    </md-button>
    <md-button @click="logForgeFile">
      TEST GET ForgeFile
    </md-button>
  </div>
</template>

<script>
function loop(func) {
  func();
  setTimeout(() => {
    loop(func);
  }, 1000);
}
export default {
  name: "testExtention",
  data() {
    return {
      spinalSystem: window.spinalSystem,
      viewer: window.v,
      coucou: "TEST",
      count: 0
    };
  },
  methods: {
    getSelection: function() {
      let test = this.viewer.getSelection();
      console.log(test);
    },
    logForgeFile: function() {
      this.spinalSystem.getModel().then(forgefile => {
        console.log(forgefile);
      });
    }
  },
  mounted() {
    let vm = this;
    loop(() => {
      vm.count += 1;
    });
  }
};
</script>