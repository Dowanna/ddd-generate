import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import {createEntityClassString, createRepositoryInterfaceString} from './class-strings'
import {getDomainNamePatterns} from './util/path'
import {srcDir, repository, entity, domain} from './constants/path'

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
  }

  private createRepository(domainNameOriginal: string) {
    const {domainNameClass, domainNameVariable, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)
    const relativePathInterfaceToEntity = `../entity/${domainNameKebab}` // fixme: ベタがきじゃなくて、ちゃんと相対パスを取得するメソッドを用意する
    const filePath = this.createRepositoryDirectory(domainNameKebab)

    const repositoryInterface = createRepositoryInterfaceString({domainNameClass, domainNameVariable, relativePathInterfaceToEntity})
    fs.writeFileSync(path.join(filePath, `${domainNameKebab}-repository.ts`), repositoryInterface)
  }

  private createEntity(domainNameOriginal: string) {
    const {domainNameClass, domainNameKebab} = getDomainNamePatterns(domainNameOriginal)

    const filePath = this.createEntityDirectory(domainNameKebab)
    const entityClassString = createEntityClassString(domainNameClass)
    fs.writeFileSync(path.join(filePath, `${domainNameKebab}.ts`), entityClassString)
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

    fullPathArray.forEach((nextPath, i) => {
      currentPath = path.join(currentPath, nextPath)
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath)
      }
    })
  }
}

export = Dddgen
