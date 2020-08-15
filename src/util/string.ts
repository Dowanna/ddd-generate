export const upperCaseFirstChar = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export const lowerCaseFirstChar = (text: string) => {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

export const kebabCase = (text: string) => {
  // fixme: ちゃんとケバブケースに変換する
  return text.toLowerCase()
}
