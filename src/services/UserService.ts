import { LocalOrbitDatabase } from './DatabaseService'

class UserService extends LocalOrbitDatabase {
    constructor() {
        super('users')
    }

    getAllUsers = async (): Promise<User[]> => {
        if (!this._database) {
            console.error('Database not initialized')
            return [];
        }
        const allMessages = this._database.all
        // I'll get some types in here later
        console.log(allMessages[0])
        return allMessages.map((message: any) => {
            return message.payload.value
        })
    }

    listenForNewUsers = (callback: (address: string, entry: any, heads: any) => void) => this._database.events.on('write', callback)

    registerUser = (username: string): Promise<string> => {
        if (!this._database) {
            console.error('Database not initialized')
            return Promise.reject('Database not initialized')
        }
        // Use the identity id as the key
        return this._database.put({
            username,
            _id: this.getIdentity()._id,
        })
    }

    getCurrentUser = (): User[] => {
        if (!this._database) {
            console.error('Database not initialized')
            return [];
        }
        return this._database.get(this.getIdentity()._id)
    }
}

export type NewUser = Omit<User, '_id'>

export type User = {
    _id: string,
    username: string,
}

// Define And Export DB Instance
export const UserSatalite = new UserService()