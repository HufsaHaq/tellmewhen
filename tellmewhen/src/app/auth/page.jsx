'use client'
import { ClearCookies, Login, Register } from '@/scripts/login';
import React, { useState } from 'react';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [username, setUsername] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [processingData, setProcessingData] = useState(false);
    if (typeof window !== "undefined"){
        if(activeTab == "login") document.title = "Log In | Tell Me When";
        else document.title = "Register | Tell Me When";
    }


    async function handleLogin(name = username){
        ClearCookies();
        await Login(name, businessName, password).then((res) => {
            console.log(res);
            if(res.status === 200 || res.data["message"] !== null || res.data["message"] !== undefined)
            {
                window.location.href = '/dashboard';
                setErrorMessage("");
            }
        }).catch((res) => {
            console.log(res)
            if(res.status === 401){
                setProcessingData(false);
                setErrorMessage("Your credentials are incorrect.")
            }
            else if(res.status === 500 || res.status === null || res === null){
                setProcessingData(false);
                setErrorMessage("An error occurred while connecting to the server.")
            }
            else{
                setProcessingData(false);
                setErrorMessage("An error occurred while connecting to the server.")
            }
        });

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
                Register(businessName, password).then((res) => {
                    setProcessingData(false);
                    if(res.status === 200 || res.status === 201)
                    {
                        setUsername("admin");
                        handleLogin("admin");
                    }
                    else if(res.status === 401 || res.status === 400){
                        setErrorMessage("A business with that name already exists")
                    }
                    else if(res.status === 500 || res === null || res.status === null){
                        setErrorMessage("An error occurred while connecting to the server.")
                    }
                    else{
                        setErrorMessage("An error occurred while connecting to the server.")
                    }
                }).catch((res)=>{
                    if(res.status === 401 || res.status === 400){
                        setErrorMessage("A business with that name already exists")
                    }
                    else{
                        setErrorMessage("An error occurred while connecting to the server.")
                    }
                    setProcessingData(false);
                });
            }
        } catch (err) {
            console.log(err);
            setProcessingData(false);
        }
    };
    

    return (
        <div className="w-[100vw] h-[100vh] fixed bg-[#F5F5F5] ">
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
                    {activeTab == "login" && 
                        <input
                            type="text"
                            placeholder="Enter your username"
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />}
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
                        <>
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
                            <h1 className="text-[12px] text-[#C41C1C]">* The default username will be "admin"</h1>
                        </>
                        
                    )}

                    <button type="submit" className={`${processingData?"animate-pulse":""} transition ease-in-out`} style={processingData ? styles.submitButtonDisabled:styles.submitButton} disabled={processingData}>
                        {activeTab === 'login' ? (!processingData ? 'Log In' : "Logging In...") : (!processingData ? 'Register' : "Registering...")}
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        position: "fixed",
        justifyContent: 'center',
        top: "50vh",
        left: "50vw",
        transform: "translate(-50%,-50%)",
        width: "100%",
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