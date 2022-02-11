import React, { useEffect, useState } from 'react'
import { RichPost, PostSatalite, Post } from '../../services/PostService'
import { UserSatalite, User } from '../../services/UserService'
import { PostComp } from '../Posts/Post'

export const PostList = () => {
    const [posts, setPosts] = useState([] as RichPost[])
    const [currentUser, setCurrentUser] = useState(undefined as User | undefined)

    useEffect(() => {
        const posts = PostSatalite.getAllPosts()
        const richPosts = enrichPosts(posts)
        const currentUser = UserSatalite.getCurrentUser()
        setCurrentUser(currentUser)
        setPosts(richPosts.reverse());
        startListener()
    }, [])

    /**
     * Listen for new local writes to the database
     */
    const startListener = () => {
        PostSatalite.listenForNewPosts((address, entry, heads) => {
            setPosts(prev => [...enrichPosts([entry.payload.value]), ...prev])
        })
    }

    /** 
     * Performing a similar job to a database join,
     * where we take the user reference id and get the object associated with it
     */
    const enrichPosts = (posts: Post[]): RichPost[] => {
        return posts.map((post): RichPost => {
            const richPost: RichPost = { ...post, user: undefined }
            if (post.user) {
                const userResponse = UserSatalite.getUser(post.user)
                richPost.user = userResponse
            }
            return richPost
        })
    }

    return <div className='post-list'>
        {posts.map((post) => <PostComp key={post._id} post={post} currentUser={currentUser?._id} />)}
    </div>
}