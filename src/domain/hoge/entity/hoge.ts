
      export class Hoge {
        private readonly id: string
        public constructor(params: { id: string }) {
          const { id } = params
          this.id = id
        }
        public isEqual(otherHoge: Hoge) {
          return otherHoge.id === this.id
        }
      }
    