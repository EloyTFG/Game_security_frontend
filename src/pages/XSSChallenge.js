import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const XSSChallenge = () => {
    const [comment, setComment] = useState('');
    const [response, setResponse] = useState('');
    const responseRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/challenges/submit', { comment });
            setResponse(res.data);
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.innerHTML = response; // Inyecta HTML directamente
        }
    }, [response]);

    return (
        <div className="App">
            <h1>Ejemplo de Cross-Site Scripting</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="comment">Comentario:</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button type="submit">Enviar</button>
            </form>
            <div ref={responseRef}></div> {/* Elemento donde se inyecta el HTML */}
        </div>
    );
}
export default XSSChallenge;
