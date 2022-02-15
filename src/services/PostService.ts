import { LocalOrbitDatabase } from './DatabaseService'
import { v4 as uuidv4 } from 'uuid'
import { UserEntry } from './UserService'

class PostService extends LocalOrbitDatabase {
    constructor() {
        super('posts')
    }

    getAllPosts = (): Post[] => {
        if (!this._database) {
            console.error('Database not initialized')
            return [];
        }
        const allMessages = this._database.iterator({ limit: -1 })
            .collect()
            .map((e: any) => e.payload.value)
        // I'll get some types in here later
        console.log(allMessages[0])
        return allMessages
    }

    listenForNewPosts = (callback: (address: string, entry: any, heads: any) => void) => this._database?.events.on('write', callback)

    addMessage = (message: NewPost): Promise<string> => {
        if (!this._database) {
            console.error('Database not initialized')
            return Promise.reject('Database not initialized')
        }
        const key = uuidv4()
        const post = {
            ...message,
            _id: key,
        }
        return this._database.add(post)
    }
}

export type NewPost = Omit<Post, '_id'>

export type Post = {
    _id: string,
    body: string,
    user?: UserEntry, // Id of a user
    user_id: string,
}

export type RichPost = {
    _id: string,
    body: string,
    user: UserEntry | undefined,
    user_id: string,
}

// Define And Export DB Instance
export const PostSatalite = new PostService()