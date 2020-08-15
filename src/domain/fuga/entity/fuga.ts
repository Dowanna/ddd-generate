
export class Fuga {
        private readonly id: string

        public constructor(params: { id: string }) {
          const {id} = params
          this.id = id
        }

        public isEqual(otherFuga: Fuga) {
          return otherFuga.id === this.id
        }
}

