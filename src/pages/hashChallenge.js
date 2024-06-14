import React, { useState } from 'react';

const HashChallenge = () => {
    // Contraseñas correctas para los hashes proporcionados
    const correctPassword1 = "secret";
    const correctPassword2 = "password";

    const [userInput1, setUserInput1] = useState('');
    const [userInput2, setUserInput2] = useState('');
    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');

    const handleInputChange1 = (event) => {
        setUserInput1(event.target.value);
    };

    const handleInputChange2 = (event) => {
        setUserInput2(event.target.value);
    };

    // Validar la primera contraseña
    const validatePassword1 = () => {
        if (userInput1 === correctPassword1) {
            setMessage1("¡Correcto! La contraseña ingresada coincide con el hash.");
        } else {
            setMessage1("La contraseña no coincide con el hash. Intenta nuevamente.");
        }
    };

    // Validar la segunda contraseña
    const validatePassword2 = () => {
        if (userInput2 === correctPassword2) {
            setMessage2("¡Correcto! La contraseña ingresada coincide con el hash.");
        } else {
            setMessage2("La contraseña no coincide con el hash. Intenta nuevamente.");
        }
    };

    return (
        <div className="hash-challenge-container">
            <h1>Desafío de Verificación de Hashes</h1>
            <p>Ingresa las contraseñas que coincidan con los siguientes hashes.</p>

            <div className="challenge-section">
                <p>Hash (SHA-1): 5EBE2294ECD0E0F08EAB7690D2A6EE69</p>
                <input
                    type="text"
                    value={userInput1}
                    onChange={handleInputChange1}
                    placeholder="Ingresa la contraseña para el hash 1"
                    className="input-field"
                />
                <button onClick={validatePassword1} className="validate-button">Validar</button>
                <p>{message1}</p>
            </div>

            <div className="challenge-section">
                <p>Hash (SHA-256): 8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92</p>
                <input
                    type="text"
                    value={userInput2}
                    onChange={handleInputChange2}
                    placeholder="Ingresa la contraseña para el hash 2"
                    className="input-field"
                />
                <button onClick={validatePassword2} className="validate-button">Validar</button>
                <p>{message2}</p>
            </div>
        </div>
    );
};

export default HashChallenge;
