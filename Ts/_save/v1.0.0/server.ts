import {SyncingRequest, SyncingResponse} from './'

export interface ServerDataItem {
    id: string
    timestamp: number
    value: string
}

export interface ServerDataStore {
    items: {
        [id: string]: ServerDataItem
    }
}

export interface ServerChangeMap {
    [id: string]: string
}

export class Server {
    store: ServerDataStore

    synchronize (request: SyncingRequest): SyncingResponse {
        let lastTimeStamp = request.timestamp
        let now = Date.now()
        let serverChanges: ServerChangeMap = Object.create(null)
        
        // form data to be send
        let items = this.store.items
        for (let id of Object.keys(items)) {
            let item = items[id]
            if (item.timestamp > lastTimeStamp) {
                serverChanges[id] = item.value
            }
        }

        return {
            timestamp: now,
            changes: serverChanges
        }
    }
}
