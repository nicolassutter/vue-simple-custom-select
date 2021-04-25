import Vue, { PluginFunction, VueConstructor } from 'vue';

declare const VueSimpleSelect: VueConstructor<Vue> & { install: PluginFunction<any>; };
export default VueSimpleSelect;
