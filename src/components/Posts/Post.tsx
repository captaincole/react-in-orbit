import React from 'react'
import './Post.css'
import { RichPost } from '../../services/PostService'

export const PostComp = (props: { post: RichPost }) => {
    const { post } = props

    return <div className={`post`}>
        <strong>{post.user?.username || 'Anonymous'}</strong> <p>{post.body}</p>
    </div>
}