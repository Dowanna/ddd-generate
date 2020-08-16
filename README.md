dddgen
======
Super simple DDD / onion architecture boilerplate generator for TypeScript.

<!-- toc -->
* [Setup](#setup)
* [Usage](#usage)
<!-- tocstop -->

# Setup
<!-- setup -->
```sh-session
$ npm install -g dddgen
```
<!-- setupstop -->

# Usage
<!-- usage -->
```sh-session
$ dddgen user
```

generates the following:

`src/domain/user/entity/user.ts`
```
export class User {
    public readonly id: string

    public constructor(params: { id: string }) {
      const {id} = params
      this.id = id
    }

    public isEqual(otherUser: User) {
      return otherUser.id === this.id
    }
}
```

`src/domain/user/repository/user-repository.ts`
```
import {User} from '../entity/user'

export interface UserRepository {
    index(): Promise<User[]>;
    find(id: string): Promise<User>;
    delete(id: string): Promise<void>;
    update(user: User): Promise<User>;
  }
```

`src/app/user/dto/user-dto.ts`
```
import {User} from '../../../domain/user/entity/user'

export class UserDTO {
    public readonly id: string

    public constructor(user: User) {
      this.id = user.id
    }
}
```

`src/app/user/usecase/index-user-usecase.ts`
```
import {User} from '../../../domain/user/entity/user'
import {UserRepository} from '../../../domain/user/repository/user-repository'
import {UserDTO} from '../dto/user-dto'

export class IndexUserUsecase {
    private readonly userRepo: UserRepository

    public constructor(userRepo: UserRepository) {
      this.userRepo = userRepo
    }

    public async do() {
      const userList = await this.userRepo.index()
      return userList.map((user: User) => {
        return new UserDTO(user)
      })
    }
}
```

`src/app/user/usecase/update-user-usecase.ts`
```
import {User} from '../../../domain/user/entity/user'
import {UserRepository} from '../../../domain/user/repository/user-repository'
import {UserDTO} from '../dto/user-dto'

export class UpdateUserUsecase {
    private readonly userRepo: UserRepository

    public constructor(userRepo: UserRepository) {
      this.userRepo = userRepo
    }

    public async do(id: string) {
      try {
        const user: User = await this.userRepo.find(id)
        if (!user) return undefined

        const updatedUser = new User({...user})
        const persistedUser = await this.userRepo.update(updatedUser)
        return new UserDTO(persistedUser)
      } catch (error) {
        // todo: error handling
        console.error(error)
      }
    }
}
```

`src/app/user/usecase/find-user-usecase.ts`
```
import {User} from '../../../domain/user/entity/user'
import {UserRepository} from '../../../domain/user/repository/user-repository'
import {UserDTO} from '../dto/user-dto'

export class FindUserUsecase {
    private readonly userRepo: UserRepository

    public constructor(userRepo: UserRepository) {
      this.userRepo = userRepo
    }

    public async do(id: string) {
      const user: User = await this.userRepo.find(id)
      if (!user) return undefined

      return new UserDTO(user)
    }
}
```

`src/app/user/usecase/delete-user-usecase.ts`
```
import {UserRepository} from '../../../domain/user/repository/user-repository'

export class DeleteUserUsecase {
    private readonly userRepo: UserRepository

    public constructor(userRepo: UserRepository) {
      this.userRepo = userRepo
    }

    public async do(id: string) {
      try {
        await this.userRepo.delete(id)
      } catch (error) {
        // todo: error handling
        console.error(error)
      }
    }
}
```

<!-- usagestop -->
