import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App = () => {
    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar />
            <main className='flex-grow-1'>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;