import React, { useState, useEffect } from 'react';
import axios from 'axios';

const XxeChallenge = () => {
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/challenges/comments');
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/challenges/submit-comment', { comment }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
            fetchComments(); // Actualizar la lista de comentarios
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>XXE Challenge</h1>
            <div style={{ margin: '20px' }}>
                <textarea
                    rows="10"
                    cols="50"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your XML comment here"
                    style={{ margin: '10px' }}
                />
                <br />
                <button onClick={handleSubmit} style={{ padding: '10px 20px', margin: '10px' }}>Submit Comment</button>
            </div>
            {message && <p>{message}</p>}
            <div>
                <h2>Comments</h2>
                {comments.map((c) => (
                    <div key={c.id} style={{ borderBottom: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>
                        <p><strong>{c.username}</strong></p>
                        <p>{c.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default XxeChallenge;
