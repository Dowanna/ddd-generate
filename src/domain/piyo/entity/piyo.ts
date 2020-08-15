
export class Piyo {
    private readonly id: string

    public constructor(params: { id: string }) {
      const {id} = params
      this.id = id
    }

    public isEqual(otherPiyo: Piyo) {
      return otherPiyo.id === this.id
    }
}

