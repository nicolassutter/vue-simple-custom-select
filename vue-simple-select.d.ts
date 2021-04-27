import Vue, { PluginFunction, VueConstructor } from 'vue';
import { Option } from './src/interfaces/options'

declare const VueSimpleSelect: VueConstructor<Vue> & { install: PluginFunction<any>; };
export declare const Option: Option
export default VueSimpleSelect;
