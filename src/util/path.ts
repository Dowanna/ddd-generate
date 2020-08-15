import {upperCaseFirstChar, lowerCaseFirstChar, kebabCase} from './string'

export const getDomainNamePatterns = (domainNameOriginal: string) => {
  const domainNameClass = upperCaseFirstChar(domainNameOriginal)
  const domainNameVariable = lowerCaseFirstChar(domainNameOriginal)
  const domainNameKebab = kebabCase(domainNameOriginal)
  return {domainNameClass, domainNameVariable, domainNameKebab}
}
