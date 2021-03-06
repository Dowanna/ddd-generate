import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import {createEntityClassString, createRepositoryInterfaceString, createIndexUsecaseString, createDTOClassString, createFindUsecaseString, createUpdateUsecaseString, createDeleteUsecaseString} from './class-strings'
import {getDomainNamePatterns} from './util/path'
import {srcDir, usecase, repository, entity, domain, dto, app, fileExtention} from './constants/path'

class Dddgen extends Command {
  static description = 'App/domain layer boilerplate generator for DDD / onion architecture'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'entity'}]

  async run() {
    const {args} = this.parse(Dddgen)
    const name = args.entity || 'testEntity'
    this.createEntity(name)
    this.createRepository(name)
    this.createUsecase(name)
  }

  private createEntity(domainNameOriginal: string) {
    const {domainNameClass, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)

    const filePath = this.createEntityDirectory(domainNameKebab)
    const entityClassString = createEntityClassString(domainNameClass)
    fs.writeFileSync(path.join(filePath, this.entityFileNameWithExtension(domainNameKebab)), entityClassString)
  }

  private createRepository(domainNameOriginal: string) {
    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathInterfaceToEntity = `../${entity}/${domainNameKebab}` // fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する

    const filePath = this.createRepositoryDirectory(domainNameKebab)
    const repositoryInterface = createRepositoryInterfaceString({domainNameClass, domainNameVariable, relativePathInterfaceToEntity})
    fs.writeFileSync(path.join(filePath, `${this.repositoryFileNameWithExtension(domainNameKebab)}`), repositoryInterface)
  }

  private createUsecase(domainNameOriginal: string) {
    this.createAppDTO(domainNameOriginal)

    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathAppToRepo = `../../../${domain}/${domainNameKebab}/${repository}/${this.repositoryFileName(domainNameKebab)}`// fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する
    const relativePathAppToEntity = `../../../${domain}/${domainNameKebab}/${entity}/${domainNameKebab}`// fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する
    const relativePathAppToDTO = `../${dto}/${this.dtoFileName(domainNameKebab)}` // fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する

    // index
    const indexUsecaseFilePath = this.createUsecaseDirectory(domainNameKebab)
    const indexUsecaseClassString = createIndexUsecaseString({domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO})
    fs.writeFileSync(path.join(indexUsecaseFilePath, `index-${domainNameKebab}-usecase.ts`), indexUsecaseClassString)

    // find
    const findUsecaseFilePath = indexUsecaseFilePath
    const findUsecaseClassString = createFindUsecaseString({domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO})
    fs.writeFileSync(path.join(findUsecaseFilePath, `find-${domainNameKebab}-usecase.ts`), findUsecaseClassString)

    // update
    const updateUsecaseFilePath = indexUsecaseFilePath
    const updateUsecaseClassString = createUpdateUsecaseString({domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO})
    fs.writeFileSync(path.join(updateUsecaseFilePath, `update-${domainNameKebab}-usecase.ts`), updateUsecaseClassString)

    // delete
    const deleteUsecaseFilePath = indexUsecaseFilePath
    const deleteUsecaseClassString = createDeleteUsecaseString({domainNameClass, domainNameVariable, relativePathAppToRepo, relativePathAppToEntity, relativePathAppToDTO})
    fs.writeFileSync(path.join(deleteUsecaseFilePath, `delete-${domainNameKebab}-usecase.ts`), deleteUsecaseClassString)
  }

  private createAppDTO(domainNameOriginal: string) {
    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathAppToEntity = `../../../${domain}/${domainNameKebab}/${entity}/${domainNameKebab}`// fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する
    const dtoFilePath = this.createAppDTODirectory(domainNameKebab)
    const dtoClassString = createDTOClassString({domainNameClass, domainNameVariable, relativePathDTOToEntity: relativePathAppToEntity})
    fs.writeFileSync(path.join(dtoFilePath, `${this.dtoFileNameWithExtension(domainNameKebab)}`), dtoClassString)
  }

  private createUsecaseDirectory(domainName: string) {
    let filePath = fs.existsSync(srcDir) ? srcDir : ''
    filePath = path.join(filePath, `${app}/${domainName}/${usecase}`)
    this.createDirectoryIfNotExists(filePath)
    return filePath
  }

  private createAppDTODirectory(domainName: string) {
    let filePath = fs.existsSync(srcDir) ? srcDir : ''
    filePath = path.join(filePath, `${app}/${domainName}/${dto}`)
    this.createDirectoryIfNotExists(filePath)
    return filePath
  }

  private createRepositoryDirectory(domainName: string) {
    let filePath = fs.existsSync(srcDir) ? srcDir : ''
    filePath = path.join(filePath, `${domain}/${domainName}/${repository}`)

    this.createDirectoryIfNotExists(filePath)

    return filePath
  }

  private createEntityDirectory(domainName: string) {
    let filePath = fs.existsSync(srcDir) ? srcDir : ''
    filePath = path.join(filePath, `${domain}/${domainName}/${entity}`)

    this.createDirectoryIfNotExists(filePath)

    return filePath
  }

  private createDirectoryIfNotExists(fullPath: string) {
    const fullPathArray = fullPath.split('/')
    let currentPath = ''

    fullPathArray.forEach(nextPath => {
      currentPath = path.join(currentPath, nextPath)
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath)
      }
    })
  }

  private repositoryFileName = (domainNameKebab: string) => {
    return `${domainNameKebab}-repository`
  }

  private dtoFileName = (domainNameKebab: string) => {
    return `${domainNameKebab}-dto`
  }

  private entityFileNameWithExtension = (domainNameKebab: string) => {
    return `${domainNameKebab}${fileExtention}`
  }

  private dtoFileNameWithExtension = (domainNameKebab: string) => {
    return `${this.dtoFileName(domainNameKebab)}${fileExtention}`
  }

  private repositoryFileNameWithExtension = (domainNameKebab: string) => {
    return `${this.repositoryFileName(domainNameKebab)}${fileExtention}`
  }
}

export = Dddgen
