
<template>
  <div @click="select()"
       class="BIMObject"
       v-bind:class="{BIMObjectSelect : isSelected}">
    <md-list>
      <md-list-item>

        <md-button class="md-icon-button "
                   disabled>
          <md-icon> stop </md-icon>
        </md-button>

        <div class="md-list-item-text">
          <span>{{item.title.get()}}</span>
        </div>

        <div class="md-list-item-text">
          <span>{{item.id.get()}}</span>
        </div>

        <md-button class="md-icon-button"
                   @click="onDelete()">
          <md-icon>clear</md-icon>
          <md-tooltip md-direction="top">remove item from zone</md-tooltip>
        </md-button>

      </md-list-item>
    </md-list>
  </div>

</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
import EventBus from "./EventBus.vue";
export default {
  name: "BIMObject",
  data() {
    return {
      self: null,
      isSelected: false,
      ready: false,
      viewer: globalType.v
    };
  },
  props: ["item", "group"],
  components: {},
  methods: {
    select: function() {
      globalType.v.select(
        this.item.id.get(),
        Autodesk.Viewing.SelectionMode.MIXED
      );
      EventBus.$emit("BIMObjectContext", this);
      this.isSelected = true;
    },
    deselect: function() {
      this.isSelected = false;
    },
    onDelete: function() {
      this.group.removeItems([this.item]);
      this.viewer.clearThemingColors();
      if (
        this.group.parent.children.length == 0 &&
        this.group.items.length == 0
      )
        this.group.parent.display.set(false);
    }
  },
  mounted() {}
};
</script>


<style>
.BIMObject {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.BIMObjectSelect > ul > li > div > div {
  background-color: rgba(18, 27, 107, 0.5);
}

.BIMObject > ul {
  padding: 0;
}

.BIMObject > ul > li > div > div {
  padding: 0px 0px 0px 10px;
}
</style>

