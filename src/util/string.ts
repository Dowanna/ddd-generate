export const upperCaseFirstChar = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export const lowerCaseFirstChar = (text: string) => {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

export const kebabCase = (text: string) => {
  const _text = text
  return _text
  .replace(/([a-z])([A-Z])/g, '$1-$2')    // get all lowercase letters that are near to uppercase ones
  .replace(/[\s_]+/g, '-')                // replace all spaces and low dash
  .toLowerCase()                          // convert to lower case
}
