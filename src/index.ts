import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import {createEntityClassString} from './class-strings'
import {capitalizeFirstChar, kebabCase} from './util/string'

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
    const entityName = capitalizeFirstChar(name)

    this.createEntity(entityName)
  }

  private createEntity(domainNameOriginal: string) {
    const domainNameKebab = kebabCase(domainNameOriginal)
    const filePath = this.createEntityDirectory(domainNameKebab)
    const entityClassString = createEntityClassString(domainNameOriginal)
    fs.writeFileSync(path.join(filePath, `${domainNameKebab}.ts`), entityClassString)
  }

  private createEntityDirectory(domainName: string) {
    const srcDir = 'src'
    const domain = 'domain'
    const entity = 'entity'

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
