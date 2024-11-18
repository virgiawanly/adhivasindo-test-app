import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _storage: Storage) {
    this._storage.create();
  }

  async get(key: string) {
    return this._storage.get(key);
  }

  async set(key: string, value: any) {
    return this._storage.set(key, value);
  }

  async remove(key: string) {
    return this._storage.remove(key);
  }
}
