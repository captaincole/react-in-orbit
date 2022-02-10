import React, { useEffect, useState } from 'react';
import { PostSatalite, Post, RichPost } from '../services/PostService';
import { User, UserSatalite } from '../services/UserService';
import { AddPost } from './AddPost';
import { PostComp } from './Post';
import { RegisterUser } from './RegisterUser'
export const ChatApp = () => {
    const [posts, setPosts] = useState([] as RichPost[]);
    const [user, setUser] = useState({} as User | undefined)

    useEffect(() => {
        const posts = PostSatalite.getAllPosts()
        const richPosts = enrichPosts(posts)
        setPosts(richPosts);
        startListener()
        const currentUser = UserSatalite.getCurrentUser()
        console.log('User', currentUser)
        setUser(currentUser)
    }, [])

    const enrichPosts = (posts: Post[]): RichPost[] => {
        return posts.map((post): RichPost => {
            const richPost: RichPost = { ...post, user: undefined }
            if (post.user) {
                console.log('Post has user', post.user)
                const userResponse = UserSatalite.getUser(post.user)
                richPost.user = userResponse
            }
            return richPost
        })
    }

    const startListener = () => {
        PostSatalite.listenForNewPosts((address, entry, heads) => {
            console.log("New post: ", address, entry, heads)
            setPosts(prev => [...enrichPosts([entry.payload.value]), ...prev])
        })
    }

    return <div> Hello {user ? user.username : 'Anonymous'}
        {posts.map(richPost => <PostComp post={richPost} />)}
        <AddPost />
        <RegisterUser />
    </div>
}