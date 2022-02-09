import React from 'react'
import { PostSatalite, NewPost } from '../services/DatabaseService';

export const AddPost = () => {
    const [message, setMessage] = React.useState('');
    const [user, setUser] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const post: NewPost = {
            body: message,
            user: user,
        }
        PostSatalite.addMessage(post)
        setMessage('');
        setUser('');
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={message} onChange={handleChange} />
            <input type="text" value={user} onChange={handleUserChange} />
            <button type="submit">Send</button>
            {loading && <div>Sending...</div>}
            {error && <div>{error}</div>}
        </form>
    )
}