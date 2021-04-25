<template>
  <div class="vue-simple-select-container">
    <slot name="button" v-bind="{ handleClick }">
      <button 
        class="vue-simple-select-button"
        @click="handleClick"
      >
        {{ label }}
      </button>
    </slot>
    <slot name="dropdown" v-if="show">
      <div class="vue-simple-select-dropdown">
        <slot name="dropdown-content">
          Hello World
        </slot>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import "tailwindcss/tailwind.css"
import { Option } from './interfaces/options'

export default /*#__PURE__*/Vue.extend({
  name: 'VueSimpleSelect',

  data() {
    return {
      show: true
    }
  },

  props: {
    label: {
      type: String,
      default: 'Click me'
    },

    options: {
      type: Array as PropType<Option[]>,
      default: () => [
        {
          value: '',
          label: ''
        }
      ]
    }
  },

  methods: {
    handleClick() {
      this.show = !this.show
    }
  }
})
</script>

<style lang="scss">
@import 'assets/styles.scss';

#app {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>