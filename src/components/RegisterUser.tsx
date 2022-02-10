import React from 'react'
import { UserSatalite } from '../services/UserService';
import { PostSatalite } from '../services/PostService';

export const RegisterUser = () => {
    const [user, setUser] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        UserSatalite.registerUser(user).then((id: string) => {
            console.log("User registered: ", id)
            setUser('');
            setLoading(false);
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Register Your Username</label>
            <input type="text" value={user} onChange={handleChange} />
            <button type="submit">Send</button>
            {loading && <div>Sending...</div>}
            {error && <div>{error}</div>}
        </form>
    )
}