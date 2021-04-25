<script lang="ts">
import Vue from 'vue';
import VueSimpleSelect from '@/vue-simple-select.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueSimpleSelect
  }
});
</script>

<template>
  <div id="app">
    <vue-simple-select />
  </div>
</template>
