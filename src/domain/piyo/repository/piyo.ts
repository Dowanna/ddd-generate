
import {Piyo} from '../entity/piyo'
export interface PiyoRepository {
    index(): Promise<Piyo>;
    find(id: string): Promise<Piyo>;
    delete(id: string): Promise<void>;
    update(piyo: Piyo): Promise<Piyo>;
  }

