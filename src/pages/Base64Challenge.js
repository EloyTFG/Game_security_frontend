import React, { useState } from 'react';

const Base64Challenge = () => {
    // Cadena codificada proporcionada por la aplicación
    const encodedStr = "YWRtaW5pc3RyYWRvcjpjb250cmVzZW5hbXV5c2VndXJh"; // Esta es la cadena Base64 de "elmoodo:admin"
    const correctDecodedStr = "administrador:contresenamuysegura"; // Esta es la cadena original esperada

    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const validateDecodedString = () => {
        if (userInput === correctDecodedStr) {
            setMessage("¡Correcto! Has decodificado correctamente la cadena.");
        } else {
            setMessage("La decodificación es incorrecta. Intenta nuevamente.");
        }
    };

    return (
        <div className="base64-challenge-container">
            <h1>Desafío de Decodificación Base64</h1>
            <p>
                Decodifica la siguiente cadena codificada en Base64 y proporciona la
                cadena original.
            </p>
            <p className="encoded-string">Cadena codificada: {encodedStr}</p>
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ingresa la cadena decodificada"
                className="input-field"
            />
            <button onClick={validateDecodedString} className="validate-button">Validar</button>
            <div className="result">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Base64Challenge;
