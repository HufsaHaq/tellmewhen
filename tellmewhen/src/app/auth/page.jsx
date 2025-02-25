'use client'
import { Login, Register } from '@/scripts/login';
import React, { useState } from 'react';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleLogin(){
        Login(email, businessName, password).then((res) => {
            if(res.status === 200)
            {
                window.location.href = '/dashboard';
                setErrorMessage("");
            }
            else if(res.status === 401){
                setErrorMessage("The username and/or password are incorrect.")
            }
            else if(res.status === 500){
                setErrorMessage("An error occurred while connecting to the server.")
            }
            else{
                setErrorMessage("An unknown error occurred.")
                console.log(res)
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        console.log("form submitted");
        if (activeTab === 'register' && password !== confirmPassword) {
            setErrorMessage("Passwords don't match!");
            return;
        }
    
        try {
            console.log("Attempting...");
            if (activeTab === 'login') {
                handleLogin();
            } else {
                Register(email, businessName, password).then((res) => { 
                    if(res.status === 200)
                    {
                        handleLogin();
                    }
                    else if(res.status === 401){
                        setErrorMessage(res.body)
                    }
                    else if(res.status === 500){
                        setErrorMessage("An error occurred while connecting to the server.")
                    }
                    else{
                        setErrorMessage("An unknown error occurred.")
                        console.log(res)
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.tabsContainer}>
                    <button
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === 'login' && styles.activeTab)
                        }}
                        onClick={() => {
                            setActiveTab('login');
                            setErrorMessage('');
                        }}
                    >
                        Login
                    </button>
                    <button
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === 'register' && styles.activeTab)
                        }}
                        onClick={() => {
                            setActiveTab('register');
                            setErrorMessage('');
                        }}
                    >
                        Register
                    </button>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div style={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}

                    {activeTab == 'login' && (
                        <input
                            type="text"
                            placeholder="Enter your business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            style={styles.input}
                            required
                        />
                    )}

                    {activeTab == 'register' && (
                        <input
                            type="text"
                            placeholder="Enter your business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            style={styles.input}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    

                    <input
                        type="password"
                        placeholder="Enter your password"
                        style={styles.input}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('');
                        }}
                        required
                    />

                    {activeTab === 'register' && (
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            style={styles.input}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorMessage('');
                            }}
                            required
                        />
                    )}

                    <button type="submit" style={styles.submitButton}>
                        {activeTab === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },


    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
    },

    tabsContainer: {
        display: 'flex',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #eee',
    },

    tabButton: {
        flex: 1,
        padding: '12px',
        border: 'none',
        background: 'none',
        fontSize: '1.1rem',
        cursor: 'pointer',
        color: '#666',
    },

    activeTab: {
        color: '#007bff',
        borderBottom: '2px solid #007bff',
        marginBottom: '-2px',
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },

    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
    },

    submitButton: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem',
        ':hover': {
            backgroundColor: '#0056b3',
        },
    },

    errorMessage: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        border: '1px solid #f5c6cb',
        fontSize: '0.9rem',
    },



};

export default AuthPage;