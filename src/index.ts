import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import {createEntityClassString, createRepositoryInterfaceString, createIndexUsecaseString, createDTOClassString, createFindUsecaseString, createUpdateUsecaseString} from './class-strings'
import {getDomainNamePatterns} from './util/path'
import {srcDir, usecase, repository, entity, domain, dto, app, fileExtention} from './constants/path'

class Dddgen extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'entity'}]

  async run() {
    const {args, flags} = this.parse(Dddgen)
    const name = flags.name || args.entity || 'blank'
    this.createEntity(name)
    this.createRepository(name)
    this.createUsecase(name)
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
  }

  private createAppDTO(domainNameOriginal: string) {
    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathAppToEntity = `../../../${domain}/${domainNameKebab}/${entity}/${domainNameKebab}`// fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する
    const dtoFilePath = this.createAppDTODirectory(domainNameKebab)
    const dtoClassString = createDTOClassString({domainNameClass, domainNameVariable, relativePathDTOToEntity: relativePathAppToEntity})
    fs.writeFileSync(path.join(dtoFilePath, `${this.dtoFileNameWithExtension(domainNameKebab)}`), dtoClassString)
  }

  private createRepository(domainNameOriginal: string) {
    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathInterfaceToEntity = `../${entity}/${domainNameKebab}` // fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する

    const filePath = this.createRepositoryDirectory(domainNameKebab)
    const repositoryInterface = createRepositoryInterfaceString({domainNameClass, domainNameVariable, relativePathInterfaceToEntity})
    fs.writeFileSync(path.join(filePath, `${this.repositoryFileNameWithExtension(domainNameKebab)}`), repositoryInterface)
  }

  private createEntity(domainNameOriginal: string) {
    const {domainNameClass, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)

    const filePath = this.createEntityDirectory(domainNameKebab)
    const entityClassString = createEntityClassString(domainNameClass)
    fs.writeFileSync(path.join(filePath, this.entityFileNameWithExtension(domainNameKebab)), entityClassString)
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
}

export = Dddgen
