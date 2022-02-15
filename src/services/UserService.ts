import { LocalOrbitDatabase } from './DatabaseService'

class UserService extends LocalOrbitDatabase {
    constructor() {
        super('public_users')
    }

    getAllUsers = async (): Promise<UserEntry[]> => {
        if (!this._database) {
            console.error('User Database not initialized')
            return [];
        }
        const allUsers = this._database.iterator({
            limit: -1,
        })
            .collect()
            .map((e: any) => e.payload.value)
        return allUsers
    }

    listenForNewUsers = (callback: (address: string, entry: any, heads: any) => void) => this._database?.events.on('write', callback)

    registerUser = (username: string): Promise<string> => {
        if (!this._database) {
            console.error('Database not initialized')
            return Promise.reject('Database not initialized')
        }
        // Check if the user already exists
        const userExists = this.getUserByUsername(username)
        console.log('User Exists', userExists)
        if (userExists) {
            return Promise.reject('User already exists')
        }
        // Use the identity id as the key
        return this._database.add({
            username,
            user_id: this.getIdentity()._id,
        })
    }

    getUser = (identity: string): UserEntry | undefined => {
        if (!this._database) {
            console.error('Database not initialized')
            return undefined;
        }
        console.log('Get User Identity', identity)
        return this._database.iterator({ limit: -1 })
            .collect()
            .map((e: any) => e.payload.value)
            .find((e: UserEntry) => e.user_id === identity)
    }

    getUserByUsername = (username: string): UserEntry | undefined => {
        if (!this._database) {
            console.error('Database not initialized')
            return undefined;
        }
        return this._database.iterator({ limit: -1 })
            .collect()
            .map((e: any) => e.payload.value)
            .find((e: UserEntry) => e.username === username)
    }

    getCurrentUser = (): UserEntry | undefined => {
        if (!this._database) {
            console.error('Database not initialized')
            return undefined;
        }
        return this._database.iterator({ limit: -1 })
            .collect()
            .map((e: any) => e.payload.value)
            .find((e: UserEntry) => e.user_id === this._database?.identity?._id)
    }
}

export type NewUser = Omit<UserEntry, '_id'>

export type UserEntry = {
    _id: string,
    user_id: string,
    username: string,
}

// Define And Export DB Instance
export const UserSatalite = new UserService()