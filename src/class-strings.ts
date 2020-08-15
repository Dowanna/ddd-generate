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
