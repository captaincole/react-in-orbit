import React, { useEffect, useState } from 'react';
import { PostSatalite, Post } from '../services/DatabaseService';
import { AddPost } from './AddPost';
export const ChatApp = () => {
    const [posts, setPosts] = useState([] as Post[]);

    useEffect(() => {
        PostSatalite.getAllPosts().then((posts: Post[]) => {
            setPosts(posts);
        })
    }, [])

    return <div> Hello Data
        {posts.map(post => <div key={post._id}>{JSON.stringify(post)}</div>)}
        <AddPost />
    </div>
}