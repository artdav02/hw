import React, { useState } from 'react';
import './App.css'

function CipherTool() {

    function applyVigenere(text, key, encrypt = true) {
        let result = '';
        for (let i = 0, j = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (encrypt) {
                result += String.fromCharCode((c + key.charCodeAt(j)) % 256);
            } else {
                result += String.fromCharCode((256 + c - key.charCodeAt(j)) % 256);
            }
            j = (j + 1) % key.length;
        }
        return result;
    }


    function applyCaesar(text, shift, encrypt = true) {
        return text.split('').map(char => {
            let shiftedCharCode = char.charCodeAt(0);
            if (encrypt) {
                shiftedCharCode = (shiftedCharCode + shift) % 256;
            } else {
                shiftedCharCode = (256 + shiftedCharCode - shift) % 256;
            }
            return String.fromCharCode(shiftedCharCode);
        }).join('');
    }


    const [text, setText] = useState('');
    const [key, setKey] = useState('');
    const [shift, setShift] = useState(0);
    const [result, setResult] = useState('');
    const [cipherType, setCipherType] = useState('vigenere');
    const [action, setAction] = useState('encrypt');

    const handleTextChange = (e) => setText(e.target.value);
    const handleKeyChange = (e) => setKey(e.target.value);
    const handleShiftChange = (e) => setShift(parseInt(e.target.value, 10));
    const handleCipherTypeChange = (e) => setCipherType(e.target.value);
    const handleActionChange = (e) => setAction(e.target.value);

    const processText = () => {
        if (cipherType === 'vigenere') {
            setResult(applyVigenere(text, key, action === 'encrypt'));
        } else if (cipherType === 'caesar') {
            setResult(applyCaesar(text, shift, action === 'encrypt'));
        }
    };

    return (
        <div className='cipherContainer'>
            <div className='cipherLogo'>Cipher Tool</div>
            <div className="centredContent">
            <div className="labelText">Text:</div>
            <div className='inputCypher'>
                <label>
                    <input type="text" className='inputCypherValue' value={text} onChange={handleTextChange} />
                </label>
            </div>
            <div className="labelText">Cipher Type:</div>
            <div className='inputCypher'>
                <label>
                    <select value={cipherType}  className='inputCypherValue' onChange={handleCipherTypeChange}>
                        <option value="vigenere">Vigenere</option>
                        <option value="caesar">Caesar</option>
                    </select>
                </label>
            </div>
            {cipherType === 'vigenere' && (
                <div>
                <div className="labelText">Key:</div>
                <div className='inputCypher'>
                    <label>

                        <input type="text" className='inputCypherValue' value={key} onChange={handleKeyChange} />
                    </label>
                </div>
                </div>
            )}
            {cipherType === 'caesar' && (
                <div>
                    <div className="labelText">   Shift:</div>
                <div className='inputCypher'>
                    <label>

                        <input type="number" className='inputCypherValue' value={shift} onChange={handleShiftChange} />
                    </label>
                </div>
                </div>
            )}
            <div className="labelText"> Action:</div>
            <div className='inputCypher'>
                <label>

                    <select value={action} className='inputCypherValue' onChange={handleActionChange}>
                        <option value="encrypt">Encrypt</option>
                        <option value="decrypt">Decrypt</option>
                    </select>
                </label>
            </div>
            <div>
                <button onClick={processText} className='processButton'>Process</button>
            </div>
            <div className="labelTextResult">  Result:</div>
            <div className='inputCypher'>
                <label>
                    <textarea value={result}  className='inputCypherValue' readOnly />
                </label>
            </div>
            </div>
        </div>
    );
}

export default CipherTool;
