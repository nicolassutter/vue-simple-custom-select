# Vue Simple Custom Select

A simple Vue component that allows you to create a custom select without any efforts.

## <a id="get-started"></a> Get started

````sh
npm i vue-simple-custom-select
````

You can then use it by importing it in your chosen Vue project.

````vue
<template>
 <vue-simple-select 
   v-model="selected"
   :options="options" 
 />
</template>

<script>
import VueSimpleSelect from 'vue-simple-custom-select'

export default {
  name:  'Your component',
  components: {
    VueSimpleSelect 
  },
  data() {
    return {
      selected: {},
      options: [
        {
          label: 'Label',
          value: 'value'
        }
      ]
    }
  }
}
</script>
````

## Props

| Name | Default | Description | Required |
|--|--|--|--|
| `value` | `null` | The default selected value | `true` |
| `options` | `[]` | The options displaying inside the dropdown | `true` |
| `no-click-outside` | `false` | If the select should not be closed when clicking outside | `false` |
| `opened` | `false` | Ability to open the dropdown by default | `false` |
| `multiple` | `false` | If the select allows multiple items to be selected | `false` |
| `placeholder` | `''` | The value to be displayed when nothing is selected | `false` |
| `title` | `''` | Ability to place a title on the select button | `false` |
| `transition` | `'slide-fade'` | Used to change the transition when showing or hiding the dropdowm. | `false` |
| `labelledby` | `''` | Can be used to specify what element labels the button. | `false` |

## V-model

The component uses a custom model, it is binded to the `value` prop and to the `change` event.

**Therefore** you do not have to use the prop `value` or listen to `change`, simply bind a `v-model` like in [this example](#get-started).

## Slots

This custom select can be customised through slots.

| Name | Values | Description |
|------|--------|-------------|
| `button` | `{ handleClick, showSelect, hideSelect }` | Can be used to replace the button trigerring the dropdown |
| `inner-button` | `null` | Right inside the button, can be used to add content |
| `before-icon` | `null` | On the left of the icon, can be used to add content |
| `icon` | `{ show }` | Can be used to change the icon |
| `after-icon` | `null` | On the right of the icon, can be used to add content |
| `dropdown` | `{ selectValue, isSelected, show }` | Can be used to replace the default dropdown |
| `dropdown-content` | `{ selectValue, isSelected }` | Can be used to replace the content of the dropdown |
| `single-option` | `{ option, index, selectValue, isSelected }"` | Can be used to change a single option in the dropdown, **keep in mind, this slot is inside of a v-for** |

## Methods

This component's slots give acces to differents methods allowing you to customize its behavior.

| Name | Params | Returns | Emits | Description |
|------|--------|---------|-------|-------------|
| `showSelect` | `void` | `void` | `show` | Is used to show the dropdown |
| `hideSelect` | `void` | `void` | `hide` | Is used to hide the dropdown |
| `handleClick` | `void` | `void` | `show` | Is used to toggle between showing and hiding the dropdown
| `selectValue` | `option: Option` | `void` | `change` | Is used to select (or remove) an option, an option has to be passed in |
| `isSelected` | `option: Option` | `boolean` | `void` | Determines if the passed in option is selected |

## Styles

The components uses only a few styles that can be easily changed and adapted. You can even add your own classes using slots.

> Every class is nested inside `.vue-simple-select-container`.

> Every class is prefixed by `vue-simple-select-`.

| Name | Description |
|------|-------------|
| `button` | Refers to the button tiggering the dropdown |
| `dropdown` | Refers to the dropdown, containing the list of options |
| `option` | Refers to a single option in the the list of options |
| `option.selected` | Refers to a single **selected** option in the the list of options |
| `icon` | Refers to the arrow icon in the button |
| `icon.reverse` | Refers to the arrow icon in the button, has a `transform: rotate(180deg);` |
| `placeholder` | Refers to the placeholder showing when nothing is selected |
| `selected` | Refers to the content of the button if it contains a list of selected options (in multiple mode) |
| `selected-option` | Refers to the content of the button (in single mode) |
| `label` | Refers to the amount of selected option (in multiple mode) |

### Side notes

The component is originally made for my personnal use and therefore may contain bugs (that can be reported on the [GitHub repo](https://github.com/nicolassutter/vue-simple-custom-select)).

> Finding documentation on how to use a preprocessor and install TailwindCSS with Vue-Rollup wasn't an easy task. So I decided to use laravel-mix to build a simple css file that is then used in the component. 
> I am definetly open for suggestions on how to improve this process or any other aspect of the component.
