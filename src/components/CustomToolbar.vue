<template>
  <v-ons-toolbar class="custom-toolbar">
    <div class="left">
      <slot name="left">
        <v-ons-back-button v-if="backLabel" @click="back">
          {{ backLabel }}
        </v-ons-back-button>
      </slot>
    </div>
    <div class="center" style="color: #ff7000;"><slot>{{ title }}</slot></div>
    <div class="right"><slot name="right"></slot></div>
  </v-ons-toolbar>
</template>

<script>
  export default {
    props: ['title', 'backLabel'],
    methods: {
        back () {
          let index = this.$store.state.intervalIndex.index
          if (index === 0) {
            this.$store.commit('intervalIndex/setRoomInterval')
          } else if (index === 1) {
            this.$store.commit('intervalIndex/setFavoriteInterval')
          } else if (index === 2) {
            this.$store.commit('intervalIndex/setOrderInterval')
          }
        }
    }
  }
</script>

<style scope>
  .custom-toolbar {
    color: #ff7000;
  }
</style>
