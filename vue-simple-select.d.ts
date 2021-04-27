import Vue, { PluginFunction, VueConstructor } from 'vue';
declare const VueSimpleSelect: VueConstructor<Vue> & { install: PluginFunction<any>; };

export {
  Option
} from './src/interfaces/options'

export default VueSimpleSelect;
