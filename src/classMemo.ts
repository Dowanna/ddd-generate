class xxxDTO {
  private readonly id: string

  public constructor(xxx: xxx) {
    this.id = xxx.id
  }
}

export class xxxAppService {
  private readonly xxxRepo: xxxRepo

  public constructor(xxxRepo: xxxRepo) {
    this.xxxRepo = xxxRepo
  }

  public async do() {
    const xxxList = this.xxxRepo.index()
    return xxxList.map(xxx => {
      return new xxxDTO(xxx)
    })
  }
}
