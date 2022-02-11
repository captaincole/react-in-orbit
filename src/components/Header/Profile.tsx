import React, { useState, useEffect } from 'react'
import './Profile.css'
import { UserSatalite, User } from '../../services/UserService'

export const Profile = () => {
    const [user, setUser] = useState(undefined as User | undefined)

    useEffect(() => {
        const currentUser = UserSatalite.getCurrentUser()
        setUser(currentUser)
    }, [])

    const releaseUsername = () => {
        // Do something to release the username from this device (delete record?)
    }

    const registerUsername = () => {
        // Probably a popup that asks you to input a username and see if it already exists
    }

    return <div> {user ?
        <div className='profile'>
            <strong>{user.username}</strong>
            <button onClick={releaseUsername}>Release Username</button>
        </div> : <div className='profile'>
            <strong>Anonymous</strong>
            <button onClick={registerUsername}>Register Username</button>
        </div>}
    </div>
}