<template>
  <div 
    class="vue-simple-select-container"
    v-click-outside="handleOutside"
    @keyup.down="gotToNextOption"
    @keyup.up="gotToPreviousOption"
    @keyup="gotToOption"
  >
    <slot name="button" v-bind="{ handleClick, showSelect, hideSelect }">
      <button
        class="vue-simple-select-button"
        :title="title"
        @click="handleClick"
        aria-haspopup="listbox"
        :aria-expanded="show"
        :aria-owns="`dropdown-${uid}`"
        :aria-labelledby="labelledby"
        :aria-activedescendant="activeDescendant"
      >
        <slot name="inner-button"></slot>

        <span 
          v-if="placeholder && (!selectedOption || !Object.keys(selectedOption).length) && (!selectedOptions || !selectedOptions.length)"
          class="vue-simple-select-placeholder"
        >
          {{ placeholder }}
        </span>

        <span
          v-if="selectedOptions && multiple && selectedOptions.length"
          class="vue-simple-select-selected"
        >
          <span class="vue-simple-select-label">{{ selectedOptions.length }} </span>selected
        </span>

        <span 
          v-else-if="selectedOption"
          class="vue-simple-select-selected-option"
        >
          {{ selectedOption.label }}
        </span>

        <slot name="before-icon"></slot>

        <slot name="icon" v-bind="{ show }">
          <icon-chevron 
            class="vue-simple-select-icon" 
            :class="{ reverse: show }"
          />
        </slot>

        <slot name="after-icon"></slot>
      </button>
    </slot>
    <transition :name="transition">
      <slot
        name="dropdown"
        v-if="show"
        v-bind="{ selectValue, isSelected, show }"
      >
        <div
          class="vue-simple-select-dropdown"
          :id="`dropdown-${uid}`"
        >
          <slot
            name="dropdown-content"
            v-bind="{ selectValue, isSelected }"
          >
            <ul
              ref="options-list"
              class="vue-simple-select-list"
              role="listbox"
            >
              <li v-for="(option, index) in _options"
                :key="`option-${index}`"
                class="vue-simple-select-list-item"
              >
                <slot
                  v-bind="{ option, index, selectValue, isSelected }"
                  name="single-option"
                >
                  <button
                    @click="selectValue(option)"
                    class="vue-simple-select-option"
                    :class="{ selected: isSelected(option) }"
                    :id="`vue-simple-select-option-${option.uid}`"
                    :ref="`vue-simple-select-option-${option.uid}`"
                    role="option"
                  >
                    {{ option.label }}
                  </button>
                </slot>
              </li>
            </ul>
          </slot>
        </div>
      </slot>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import IconChevron from './components/icons/chevron.vue'
import { isOption, _uid, isMultipleOptions } from './utilities'
import { Option } from './interfaces/options'
import clickOutside from './directives/click-outside'

export default /*#__PURE__*/Vue.extend({
  name: 'VueSimpleSelect',

  components: {
    IconChevron
  },

  data() {
    return {
      /**
       * Unique component ID
       */
      uid: _uid(),
      /**
       * If the dropdown is shown or not
       */
      show: false,
      /**
       * The currently selected option, if not in multiple mode
       */
      selectedOption: {} as Option,
      /**
       * The currently selected options, if in multiple mode
       */
      selectedOptions: [] as Option[]
    }
  },

  directives: {
    /**
     * Allows to close the dropdown when clicking outside
     */
    'click-outside': { ...clickOutside }
  },

  model: {
    /**
     * We bind the v-model to the prop "value" and to the "change" event
     */
    prop: 'value',
    event: 'change'
  },

  props: {
    /**
     * The value to be displayed when nothing is selected
     */
    placeholder: {
      type: String,
      default: ''
    },

    /**
     * The name of the transition to use when showing or hiding the dropdowm.
     */
    transition: {
      type: String,
      default: 'slide-fade'
    },

    /**
     * If the select should not be closed when clicking outside
     */
    noClickOutside: {
      type: Boolean,
      default: false
    },

    /**
     * Ability to place a title on the select button
     */
    title: {
      type: String,
      default: ''
    },

    /**
     * Ability to open the dropdown by default
     */
    opened: {
      type: Boolean,
      default: false
    },

    /**
     * The default value selected
     */
    value: {
      type: [Array, Object] as PropType<Option | Option[] | null>,
      default: null,
      required: true
    },

    /**
     * If the select allows multiple items to be selected
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * Can be used to specify what element labels the button
     */
    labelledby: {
      type: String,
      default: ''
    },

    /**
     * The options displaying inside the dropdown
     */
    options: {
      type: Array as PropType<Option[]>,
      required: true,
      default: () => [],
      validator: (value: Option[]) => value.every(option => isOption(option))
    }
  },

  mounted() {
    if (this.value === undefined) {
      console.warn('The value should not be undefined')
    }
    else if (this.multiple && this.value && isOption(this.value)) {
      console.warn('You specified that the select should be multiple, but only gave a single Option as value.')
    }
    /**
     * If we should initialise a single value
     */
    else if (this.value && isOption(this.value)) {
      const value = this.value as Option

      this.selectedOption = {
        uid: _uid(),
        ...value
      }
    }
    /**
     * If we should initialise multiple values
     */
    else if (this.multiple && this.value && isMultipleOptions(this.value)) {
      const value = this.value as Option[]
      const options = value.map(option => ({
        uid: _uid(),
        ...option
      })) as Option[]

      this.selectedOptions = options
    }

    /**
     * Opening the dropdown or not
     */
    this.show = this.opened
  },

  computed: {
    /**
     * Maps unique IDS to each option
     */
    _options(): Option[] {
      const options = this.options as Option[]
      return options.map((option: Option) => ({
        uid: _uid(),
        ...option
      }))
    },

    /**
     * Returns the active selected option, for accessibility purposes
     */
    activeDescendant() {
      const option = this.selectedOption as Option
      if (!this.multiple && option && isOption(option)) {
        return `vue-simple-select-option-${option.uid}`
      }
      return null
    }
  },

  methods: {
    /**
     * Returns an Array of every DOM elements corresponding to an select option
     */
    getDOMOptions() {
      const options = Object
        .entries(this.$refs)
        .map(([key, value]) => {
          return key.includes('vue-simple-select-option') ? value : null
        })
        .filter(value => value)
        .flat() as HTMLElement[]
      return options
    },

    /**
     * Handles navigating with Home and End keys
     */
    gotToOption(event: KeyboardEvent) {
      const options = this.getDOMOptions()
      if (options && options.length) {
        const lastIndex = options.length - 1
        if (event.code === 'End') {
          options && options.length && options[lastIndex] && options[lastIndex].focus()
        } else if (event.code === 'Home') {
          options && options.length && options[0].focus()
        }
      }
    },

    /**
     * Handles navigating Arrow Down
     */
    gotToNextOption(_: KeyboardEvent) {
      /**
       * Every Options
       */
      const options = this.getDOMOptions()
      if (options && options.length) {
        /**
         * Currently focused element
         */
        const currentElement = document.activeElement
        const isCurrentElementOption = currentElement && currentElement.id.includes('vue-simple-select-option')
        /**
         * If it is an option
         */
        if (isCurrentElementOption) {
          /**
           * Find the next one and focus it
           */
          const elementIndex = options.findIndex(element => element.id === (currentElement && currentElement.id))
          if (elementIndex > -1) {
            const nextElementIndex = elementIndex + 1
            const nextElement = options[nextElementIndex]
            if (nextElement) {
              nextElement.focus()
            }
          }
        } else {
          /**
           * Focus the first one
           */
          options && options[0] && options[0].focus()
        }
      }
    },

    /**
     * Handles navigating Arrow Up
     */
    gotToPreviousOption(_: KeyboardEvent) {
      /**
       * Currently focused element
       */
      const options = this.getDOMOptions()
      if (options && options.length) {
        /**
         * Currently focused element
         */
        const currentElement = document.activeElement
        const isCurrentElementOption = currentElement && currentElement.id.includes('vue-simple-select-option')
        /**
         * If it is an option
         */
        if (isCurrentElementOption) {
          /**
           * Find the previous one and focus it
           */
          const elementIndex = options.findIndex(element => element.id === (currentElement && currentElement.id))
          if (elementIndex > -1) {
            const previousElementIndex = elementIndex - 1
            const previousElement = options[previousElementIndex]
            if (previousElement) {
              previousElement.focus()
            }
          }
        }
      }
    },

    /**
     * Handles the clicking outside
     */
    handleOutside() {
      if ( !this.noClickOutside ) {
        this.hideSelect()
      }
    },

    /**
     * Shows the dropdown
     */
    showSelect() {
      this.show = true
      this.$emit('show')
    },

    /**
     * Hides the dropdown
     */
    hideSelect() {
      this.show = false
      this.$emit('hide')
    },

    /**
     * Handles seleting a value
     */
    selectValue(option: Option) {
      if (this.multiple) {
        if (this.isSelected(option)) {
          this.selectedOptions = this.selectedOptions.filter(_option => _option.uid !== option.uid)
        } else {
          this.selectedOptions.push(option)
        }
        const options = this.selectedOptions.map(option => this.parseOption(option))
        this.$emit('change', options)
      } else {
        this.selectedOption = option
        this.$emit('change', this.parseOption(option))
        this.hideSelect()
      }
    },

    /**
     * Handles toggling between showing and hiding the dropdown
     */
    handleClick() {
      this.show ? this.hideSelect() : this.showSelect()
    },

    /**
     * Deletes the uid from the option if it exists
     */
    parseOption(option: Option) {
      if (option) {
        if (option.uid) { 
          const duplicate = { ...option }
          delete duplicate.uid
          return duplicate
        }
        return option
      }
    },

    /**
     * If the given option is Selected
     */
    isSelected(option: Option) {
      if (option && !this.multiple && this.selectedOption) {
        return this.selectedOption.uid === option.uid
      } else if (option && this.multiple && this.selectedOptions.length) {
        return !!this.selectedOptions.find(_option => _option.uid === option.uid)
      }

      return false
    }
  }
})
</script>

<style src="./assets/styles/dist/styles.css"></style>