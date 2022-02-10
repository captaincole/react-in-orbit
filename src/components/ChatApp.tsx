import React, { useEffect, useState } from 'react';
import { PostSatalite, Post } from '../services/PostService';
import { User, UserSatalite } from '../services/UserService';
import { AddPost } from './AddPost';
import { RegisterUser } from './RegisterUser'
export const ChatApp = () => {
    const [posts, setPosts] = useState([] as Post[]);
    const [user, setUser] = useState({} as User)
    useEffect(() => {
        const posts = PostSatalite.getAllPosts()
        setPosts(posts);
        startListener()
        const currentUser = UserSatalite.getCurrentUser()
        console.log('User', currentUser)
        setUser(currentUser[0])
    }, [])

    const startListener = () => {
        PostSatalite.listenForNewPosts((address, entry, heads) => {
            console.log("New post: ", address, entry, heads)
            setPosts(prev => [entry.payload.value, ...prev])
        })
    }

    return <div> Hello {user ? user.username : 'Anonymous'}
        {posts.map(post => <div key={post._id}>{JSON.stringify(post)}</div>)}
        <AddPost />
        <RegisterUser />
    </div>
}