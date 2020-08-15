export const createEntityClassString = (entityName: string) => {
  return `
  export class ${entityName} {
    private readonly id: string
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
  export interface ${entityClassName}Repository {
    index(): Promise<${entityClassName}[]>;
    find(id: string): Promise<${entityClassName}>;
    delete(id: string): Promise<void>;
    update(${entityVariableName}: ${entityClassName}): Promise<${entityClassName}>;
  }
  `
}
