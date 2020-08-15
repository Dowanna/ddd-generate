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

  static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Dddgen)
    const name = flags.name ?? 'world'
    if (!name) {
      this.error('必ずエンティティの名前を入力してください')
    }
    const entityName = capitalizeFirstChar(name)

    this.log(`create file with name: ${entityName}`)

    const domainFilePath = this.createDomainClassPath(entityName)
    const entityClassString = createEntityClassString(entityName)

    fs.writeFileSync(domainFilePath, entityClassString)
  }

  private createDomainClassPath(domainNameOriginal: string) {
    const domainName = kebabCase(domainNameOriginal)
    const srcDir = 'src'
    let domainFilePath = '.'
    const domain = 'domain'
    const entity = 'entity'

    if (fs.existsSync(srcDir)) {
      domainFilePath = path.join(domainFilePath, srcDir)
    }

    // fixme: 再帰関数でもうちょい綺麗に書く
    if (!fs.existsSync(path.join(domainFilePath, domain))) {
      fs.mkdirSync(path.join(domainFilePath, domain))
    }
    if (!fs.existsSync(path.join(domainFilePath, domain, domainName))) {
      fs.mkdirSync(path.join(domainFilePath, domain, domainName))
    }
    if (!fs.existsSync(path.join(domainFilePath, domain, domainName, entity))) {
      fs.mkdirSync(path.join(domainFilePath, domain, domainName, entity))
    }

    domainFilePath = path.join(domainFilePath, domain, domainName, entity, `./${domainName}.ts`)
    this.log(domainFilePath)
    return domainFilePath
  }
}

export = Dddgen
