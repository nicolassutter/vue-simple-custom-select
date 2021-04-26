export const isOption = (option: any) => {
  return typeof option === 'object' && !Array.isArray(option) && 'value' in option && 'label' in option
}

export const isMultipleOptions = (options: any) => {
  return Array.isArray(options) && options.every((option: any) => isOption(option))
}

export const _uid = () => {
  const generate = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }

  return `${generate()}-${generate()}-${generate()}-${generate()}`
}
