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

    getUser = (identity: string): User | undefined => {
        if (!this._database) {
            console.error('Database not initialized')
            return undefined;
        }
        const userResult = this._database.get(identity)
        if (userResult.length === 0) {
            return undefined;
        }
        return userResult[0]
    }

    getCurrentUser = (): User | undefined => {
        if (!this._database) {
            console.error('Database not initialized')
            return undefined;
        }
        const userResponse = this._database.get(this.getIdentity()._id)
        if (userResponse.length === 0) {
            return undefined;
        }
        if (userResponse.length > 1) {
            console.error('More than one user...', userResponse)
        }
        console.log(userResponse[0])
        return userResponse[0]
    }
}

export type NewUser = Omit<User, '_id'>

export type User = {
    _id: string,
    username: string,
}

// Define And Export DB Instance
export const UserSatalite = new UserService()