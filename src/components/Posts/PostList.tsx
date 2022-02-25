import React, { useEffect, useState } from 'react'
import { RichPost, PostSatalite, Post } from '../../services/PostService'
import { UserSatalite } from '../../services/UserService'
import { PostComp } from '../Posts/Post'

export const PostList = () => {
    const [posts, setPosts] = useState([] as RichPost[])

    useEffect(() => {
        const startListener = () => {
            PostSatalite.listenForNewPosts((address, entry, heads) => {
                console.log('New Post')
                setPosts(prev => [...prev, ...enrichPosts([entry.payload.value])])
            })
            PostSatalite.listenForReplication((address) => {
                console.log('Replication received')
                const posts = PostSatalite.getAllPosts()
                setPosts(enrichPosts(posts))
            })
        }
        const posts = PostSatalite.getAllPosts()
        const richPosts = enrichPosts(posts)
        setPosts(richPosts)
        startListener()
    }, [])

    /** 
     * Performing a similar job to a database join,
     * where we take the user reference id and get the object associated with it
     */
    const enrichPosts = (posts: Post[]): RichPost[] => {
        return posts.map((post): RichPost => {
            const richPost: RichPost = { ...post, user: undefined }
            if (post.user_id) {
                const userResponse = UserSatalite.getUser(post.user_id)
                richPost.user = userResponse
            }
            return richPost
        })
    }

    return <div className='post-list'>
        {posts.map((post) => <PostComp key={post._id} post={post} />)}
    </div>
}