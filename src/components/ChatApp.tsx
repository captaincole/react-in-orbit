import React, { useEffect, useState } from 'react';
import { PostSatalite, Post } from '../services/DatabaseService';
import { AddPost } from './AddPost';
export const ChatApp = () => {
    const [posts, setPosts] = useState([] as Post[]);

    useEffect(() => {
        PostSatalite.getAllPosts().then((posts: Post[]) => {
            console.log('Getting All Posts')
            setPosts(posts);
            startListener()
        })
    }, [])

    const startListener = () => {
        PostSatalite.listenForNewPosts((address, entry, heads) => {
            console.log("New post: ", address, entry, heads)
            setPosts(prev => [entry.payload.value, ...prev])
        })
    }

    return <div> Hello Everyone
        {posts.map(post => <div key={post._id}>{JSON.stringify(post)}</div>)}
        <AddPost />
    </div>
}