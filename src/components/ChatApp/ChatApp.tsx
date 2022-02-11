import React, { useEffect, useState } from 'react';
import './ChatApp.css'
import { PostSatalite, Post, RichPost } from '../../services/PostService';
import { User, UserSatalite } from '../../services/UserService';
import { AddPost } from '../Posts/AddPost';
import { PostComp } from '../Posts/Post';
import { RegisterUser } from '../RegisterUser'
import { Logo } from '../Header/Logo'
import { Profile } from '../Header/Profile'
import { PostList } from '../Posts/PostList'

export const ChatApp = () => {

    return <div>
        <header>
            <Logo />
            <Profile />
            {/* <RegisterUser /> */}
        </header>
        <section className='main-content'>
            <PostList />
        </section>
        <footer>
            <AddPost />
        </footer>
        {/* {posts.map(richPost => <PostComp post={richPost} />)} */}
    </div >
}