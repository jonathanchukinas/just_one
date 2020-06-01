import {
  userIdGetter,
  Uuid,
} from './types';
import { v4 as generateUuid } from 'uuid';


export class User implements userIdGetter {

  private _id?: number
  readonly uuid: Uuid

  constructor() {
    this.uuid = generateUuid();
  }

  get id() {
    if (typeof this._id === 'undefined') { throw new Error('user id not yet defined!') }
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

}
