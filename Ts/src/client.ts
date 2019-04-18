import {Server, SyncingRequest, SyncingResponse} from './'

export interface ClientDataItem {
    id: string
    value: string
}

export interface ClientDataStore {
    timestamp: number
    items: {
        [id: string]: ClientDataItem
    }
}

export class Client {
    store: ClientDataStore = {
        timestamp: 0,
        items: Object.create(null)
    }

    constructor(public server: Server) {
        
    }

    synchronize (): void {
        let clientItems = this.store.items
        let response = this.server.synchronize({timestamp: this.store.timestamp})
        for (let id of Object.keys(response.changes)) {
            clientItems[id] = {
                id,
                value: response.changes[id]
            }
        }
        this.store.timestamp = response.timestamp
    }

    update (data: string): void {
        this.store.data = data
        this.store.timestamp = Date.now()
    }
}
