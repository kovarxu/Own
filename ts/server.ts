export class Server {
  store: DataStore = {
    timestamp: 0,
    data: ''
  };

  synchronize (clientDataStore: DataStore): DataStore {
    if (clientDataStore.timestamp > this.store.timestamp) {
      this.store = clientDataStore;
      return undefined;
    } else if (clientDataStore.timestamp < this.store.timestamp) {
      return this.store;
    } else {
      return undefined;
    }
  }
}

export interface DataStore {
  timestamp: number;
  data: string;
}
