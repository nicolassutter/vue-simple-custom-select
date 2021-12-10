<template>
  <div
    v-click-outside="handleOutside"
    class="vue-simple-select-container"
    v-on:keyup.down="gotToNextOption"
    v-on:keyup.up="gotToPreviousOption"
    v-on:keyup="gotToOption">
    <slot name="button"
      v-bind="{ handleClick, showSelect, hideSelect }">
      <button
        class="vue-simple-select-button"
        :title="title"
        aria-haspopup="listbox"
        :aria-expanded="show"
        :aria-owns="`dropdown-${uid}`"
        :aria-labelledby="labelledby"
        :aria-activedescendant="activeDescendant"
        type="button"
        v-on:click="handleClick">
        <slot name="inner-button"></slot>

        <span
          v-if="placeholder && (!selectedOption || !Object.keys(selectedOption).length) && (!selectedOptions || !selectedOptions.length)"
          class="vue-simple-select-placeholder">
          {{ placeholder }}
        </span>

        <span
          v-if="selectedOptions && multiple && selectedOptions.length"
          class="vue-simple-select-selected">
          <span class="vue-simple-select-label">{{ selectedOptions.length }} </span>selected
        </span>

        <span
          v-else-if="selectedOption"
          class="vue-simple-select-selected-option">
          {{ selectedOption.label }}
        </span>

        <slot name="before-icon"></slot>

        <slot name="after-icon"></slot>
      </button>
    </slot>
    <Transition :name="transition">
      <slot
        v-if="show"
        name="dropdown"
        v-bind="{ selectValue, isSelected, show }">
        <div
          :id="`dropdown-${uid}`"
          class="vue-simple-select-dropdown">
          <slot
            name="dropdown-content"
            v-bind="{ selectValue, isSelected }">
            <ul
              ref="options-list"
              class="vue-simple-select-list"
              role="listbox">
              <li v-for="(option, index) in _options"
                :key="`option-${index}`"
                class="vue-simple-select-list-item">
                <slot
                  v-bind="{ option, index, selectValue, isSelected }"
                  name="single-option">
                  <button
                    :id="`vue-simple-select-option-${option.uid}`"
                    :ref="`vue-simple-select-option-${option.uid}`"
                    class="vue-simple-select-option"
                    :class="{ selected: isSelected(option) }"
                    role="option"
                    v-on:click="selectValue(option)">
                    {{ option.label }}
                  </button>
                </slot>
              </li>
            </ul>
          </slot>
        </div>
      </slot>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, toRefs, onMounted } from '@nuxtjs/composition-api'
import { isOption, _uid, isMultipleOptions } from '@/modules/components/custom-select'
import clickOutside from '@/modules/directives/click-outside'
import type { Option } from '@/types/components/custom-select'

export default defineComponent({
  name: 'VueSimpleSelect',

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

  setup(props, { refs, emit }) {
    const state = reactive({
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
    })

    /**
     * Maps unique IDS to each option
     */
    const _options = computed<Option[]>(() => {
      const options = props.options
      return options.map((option: Option) => ({ uid: _uid(), ...option }))
    })

    /**
     * Returns the active selected option, for accessibility purposes
     */
    const activeDescendant = computed(() => {
      const option = state.selectedOption

      if (!props.multiple && option && isOption(option)) {
        return `vue-simple-select-option-${option.uid}`
      }

      return null
    })

    onMounted(() => {
      if (props.value === undefined) {
        throw new Error('The value should not be undefined')
      } else if (props.multiple && props.value && isOption(props.value)) {
        throw new Error('You specified that the select should be multiple, but only gave a single Option as value.')
      } else if (props.value && isOption(props.value)) {
        /**
         * If we should initialise a single value
         */
        const value = props.value as Option

        state.selectedOption = { uid: _uid(), ...value }
      } else if (props.multiple && props.value && isMultipleOptions(props.value)) {
        /**
         * If we should initialise multiple values
         */
        const value = props.value as Option[]
        const options = value.map(option => ({ uid: _uid(), ...option })) as Option[]

        state.selectedOptions = options
      }

      /**
       * Opening the dropdown or not
       */
      state.show = props.opened
    })

    const methods = {
      /**
       * Returns an Array of every DOM elements corresponding to a select option
       */
      getDOMOptions() {
        const options = Object
          .entries(refs)
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
        const options = methods.getDOMOptions()

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
        const options = methods.getDOMOptions()
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
        const options = methods.getDOMOptions()
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
        if (!props.noClickOutside) {
          methods.hideSelect()
        }
      },

      /**
       * Shows the dropdown
       */
      showSelect() {
        state.show = true
        emit('show')
      },

      /**
       * Hides the dropdown
       */
      hideSelect() {
        state.show = false
        emit('hide')
      },

      /**
       * Handles seleting a value
       */
      selectValue(option: Option) {
        if (props.multiple) {
          if (methods.isSelected(option)) {
            state.selectedOptions = state.selectedOptions.filter(_option => _option.uid !== option.uid)
          } else {
            state.selectedOptions.push(option)
          }
          const options = state.selectedOptions.map(option => methods.parseOption(option))
          emit('change', options)
        } else {
          state.selectedOption = option
          emit('change', methods.parseOption(option))
          methods.hideSelect()
        }
      },

      /**
       * Handles toggling between showing and hiding the dropdown
       */
      handleClick() {
        state.show ? methods.hideSelect() : methods.showSelect()
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
        if (option && !props.multiple && state.selectedOption) {
          return state.selectedOption.uid === option.uid
        } else if (option && props.multiple && state.selectedOptions.length) {
          return !!state.selectedOptions.find(_option => _option.uid === option.uid)
        }

        return false
      }
    }

    return {
      ...toRefs(state),
      _options,
      activeDescendant,
      ...methods
    }
  }
})
</script>
