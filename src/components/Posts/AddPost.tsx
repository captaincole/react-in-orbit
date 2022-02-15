import React from 'react'
import './AddPost.css'
import { PostSatalite, NewPost } from '../../services/PostService';
import { UserSatalite } from '../../services/UserService';

export const AddPost = () => {
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const post: NewPost = {
            body: message,
            user_id: UserSatalite.getIdentity()._id,
        }
        PostSatalite.addMessage(post)
        setMessage('');
        setLoading(false);
    }

    return (
        <form className='add-post' onSubmit={handleSubmit}>
            <textarea value={message} onChange={handleChange} />
            <button type="submit">Send</button>
            {loading && <div>Sending...</div>}
            {error && <div>{error}</div>}
        </form>
    )
}