import React, { useState, useEffect } from 'react'
import './Profile.css'
import { UserSatalite, UserEntry } from '../../services/UserService'

export const Profile = () => {
    const [user, setUser] = useState(undefined as UserEntry | undefined)

    useEffect(() => {
        const currentUser = UserSatalite.getCurrentUser()
        console.log('Current User', currentUser)
        setUser(currentUser)
    }, [])

    const registerUsername = () => {
        // Probably a popup that asks you to input a username and see if it already exists
        let username = prompt("Entery a username")
        if (username) {
            UserSatalite.registerUser(username).then((hash: string) => {
                alert('User Registered!')
            }).catch((error: any) => {
                alert('Error registering user ' + error)
            })
        }
    }

    return <div> {user ?
        <div className='profile'>
            <strong>{user.username}</strong>
        </div> : <div className='profile'>
            <strong>Anonymous</strong>
            <button onClick={registerUsername}>Register Username</button>
        </div>}
    </div>
}