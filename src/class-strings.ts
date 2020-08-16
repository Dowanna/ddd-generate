const repository = 'Repository'
const dto = 'DTO'
const usecase = 'Usecase'
const index = 'index'
const Index = 'Index'
const find = 'find'
const Find = 'Find'

export const createEntityClassString = (entityName: string) => {
  return `
  export class ${entityName} {
    public readonly id: string
    public constructor(params: { id: string }) {
      const { id } = params
      this.id = id
    }
    public isEqual(other${entityName}: ${entityName}) {
      return other${entityName}.id === this.id
    }
  }
  `
}

export const createRepositoryInterfaceString = (params: {domainNameClass: string; domainNameVariable: string; relativePathInterfaceToEntity: string}): string => {
  const {domainNameClass: entityClassName, domainNameVariable: entityVariableName, relativePathInterfaceToEntity} = params
  return `
  import { ${entityClassName} } from '${relativePathInterfaceToEntity}'

  export interface ${entityClassName}${repository} {
    ${index}(): Promise<${entityClassName}[]>;
    ${find}(id: string): Promise<${entityClassName}>;
    delete(id: string): Promise<void>;
    update(${entityVariableName}: ${entityClassName}): Promise<${entityClassName}>;
  }
  `
}

export const createDTOClassString = (params: {domainNameClass: string; domainNameVariable: string; relativePathDTOToEntity: string}) => {
  const {domainNameClass, domainNameVariable, relativePathDTOToEntity} = params
  return `
  import {${domainNameClass}} from '${relativePathDTOToEntity}'
  export class ${domainNameClass}${dto} {
    public readonly id: string
    public constructor(${domainNameVariable}: ${domainNameClass}) {
      this.id = ${domainNameVariable}.id
    }
  }
  `
}

export const createIndexUsecaseString = (params: {domainNameClass: string; domainNameVariable: string; relativePathAppToRepo: string; relativePathAppToEntity: string; relativePathAppToDTO: string}): string => {
  const {domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO} = params
  return `
  import { ${domainNameClass} } from '${relativePathAppToEntity}'
  import { ${domainNameClass}${repository} } from '${relativePathAppToRepo}'
  import { ${domainNameClass}${dto} } from '${relativePathAppToDTO}'

  export class ${Index}${domainNameClass}${usecase} {
    private readonly ${domainNameVariable}Repo: ${domainNameClass}${repository}

    public constructor(${domainNameVariable}Repo: ${domainNameClass}${repository}) {
      this.${domainNameVariable}Repo = ${domainNameVariable}Repo
    }

    public async do() {
      const ${domainNameVariable}List = await this.${domainNameVariable}Repo.${index}()
      return ${domainNameVariable}List.map((${domainNameVariable}: ${domainNameClass}) => {
        return new ${domainNameClass}${dto}(${domainNameVariable})
      })
    }
  }
  `
}

export const createFindUsecaseString = (params: {domainNameClass: string; domainNameVariable: string; relativePathAppToRepo: string; relativePathAppToEntity: string; relativePathAppToDTO: string}): string => {
  const {domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO} = params
  return `
  import { ${domainNameClass} } from '${relativePathAppToEntity}'
  import { ${domainNameClass}${repository} } from '${relativePathAppToRepo}'
  import { ${domainNameClass}${dto} } from '${relativePathAppToDTO}'

  export class ${Find}${domainNameClass}${usecase} {
    private readonly ${domainNameVariable}Repo: ${domainNameClass}${repository}

    public constructor(${domainNameVariable}Repo: ${domainNameClass}${repository}) {
      this.${domainNameVariable}Repo = ${domainNameVariable}Repo
    }

    public async do(id: string) {
      const ${domainNameVariable}: ${domainNameClass} = await this.${domainNameVariable}Repo.${find}(id)
      if (!${domainNameVariable}) return undefined

      return new ${domainNameClass}${dto}(${domainNameVariable})
    }
  }
  `
}
