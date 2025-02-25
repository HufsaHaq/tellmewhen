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
    const [processingData, setProcessingData] = useState(false);
    if (typeof window !== "undefined"){
        if(activeTab == "login") document.title = "Log In | Tell Me When";
        else document.title = "Register | Tell Me When";
    }


    function handleLogin(){
        Login(email, businessName, password).then((res) => {
            if(res.status === 200)
            {
                window.location.href = '/dashboard';
                setErrorMessage("");
            }
            else if(res.status === 401){
                setProcessingData(false);
                setErrorMessage("The username and/or password are incorrect.")
            }
            else if(res.status === 500 || res.status === null || res === null){
                setProcessingData(false);
                setErrorMessage("An error occurred while connecting to the server.")
            }
            else{
                setProcessingData(false);
                setErrorMessage("An unknown error occurred.")
            }
        }).catch((err)=>{
            setErrorMessage("An error occurred while connecting to the server.")
            setProcessingData(false);
        })
    }
    const handleSubmit = async (e) => {
        setProcessingData(true);
        e.preventDefault();
        setErrorMessage('');
        if (activeTab === 'register' && password !== confirmPassword) {
            setErrorMessage("Passwords don't match!");
            setProcessingData(false);
            return;
        }
    
        try {
            if (activeTab === 'login') {
                handleLogin();
            }
            else {
                Register(email, businessName, password).then((res) => {
                    setProcessingData(false);
                    if(res.status === 200)
                    {
                        handleLogin();
                    }
                    else if(res.status === 401){
                        setErrorMessage("Business with that name already exists")
                    }
                    else if(res.status === 500 || res === null || res.status === null){
                        setErrorMessage("An error occurred while connecting to the server.")
                    }
                    else{
                        setErrorMessage("An unknown error occurred.")
                    }
                }).catch((err)=>{
                    setErrorMessage("An error occurred while connecting to the server.");
                    setProcessingData(false);
                });
            }
        } catch (err) {
            console.log(err);
            setProcessingData(false);
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
                            if(processingData) return;
                            setActiveTab('login');
                            setErrorMessage('');
                        }}
                    >
                        Log In
                    </button>
                    <button
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === 'register' && styles.activeTab)
                        }}
                        onClick={() => {
                            if(processingData) return;
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

                    <button type="submit" className={`${processingData?"animate-pulse":""} transition ease-in-out`} style={processingData ? styles.submitButtonDisabled:styles.submitButton} disabled={processingData}>
                        {activeTab === 'login' ? (!processingData ? 'Log In' : "Logging In...") : (!processingData ? 'Register' : "Registering...")}
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
    },
    submitButtonDisabled: {
        padding: '12px',
        backgroundColor: 'rgb(195, 195, 195)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        marginTop: '1rem',
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