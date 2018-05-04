
<template>
  <div @click="select()"
       class="BIMObject"
       v-bind:class="{selected2 : isSelected}">
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

      </md-list-item>
    </md-list>
  </div>

</template>

<script>
export default {
  name: "BIMObject",
  data() {
    return {
      self: null,
      isSelected: true
    };
  },
  props: ["item"],
  components: {},
  methods: {
    select: function() {
      console.log(this.item);
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

.md-list {
  padding: 0px;
}

.selected2 > ul > li > div > div {
  background-color: rgba(18, 27, 107, 0.5);
}
</style>

