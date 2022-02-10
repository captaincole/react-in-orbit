import { LocalOrbitDatabase } from './DatabaseService'
import { v4 as uuidv4 } from 'uuid'
import { User } from './UserService'

class PostService extends LocalOrbitDatabase {
    constructor() {
        super('posts')
    }

    getAllPosts = (): Post[] => {
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

    listenForNewPosts = (callback: (address: string, entry: any, heads: any) => void) => this._database.events.on('write', callback)

    addMessage = (message: NewPost, user_id?: string): Promise<string> => {
        if (!this._database) {
            console.error('Database not initialized')
            return Promise.reject('Database not initialized')
        }
        const key = uuidv4()
        const post = {
            ...message,
            _id: key,
        }
        if (user_id) {
            post.user = user_id
        }
        return this._database.put(post)
    }

}

export type NewPost = Omit<Post, '_id'>

export type Post = {
    _id: string,
    body: string,
    user?: string, // Id of a user
}

export type RichPost = {
    _id: string,
    body: string,
    user: User | undefined,
}

// Define And Export DB Instance
export const PostSatalite = new PostService()