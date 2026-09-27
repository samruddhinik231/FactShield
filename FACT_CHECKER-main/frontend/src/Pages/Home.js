import React from 'react';
import './Home.css'; // Updated CSS file name
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <header className="homepage-header">
                {/* <h1>Welcome to Fact Check</h1> */}
            </header>

            <div className="homepage-options">
                <div className='containerCard'>
                <div className="homepage-option">
                    <h2>Check Fact Text</h2>
                    <p> Text for fact verification.</p>
                    <Link to="/validation">
                        <button className="homepage-btn">Start</button>
                    </Link>
                </div>

                <div className="homepage-option">
                    <h2>URL Based Fact Check</h2>
                    <p>Check the facts from a given URL.</p>
                    <Link to="/urlContentValidation">
                        <button className="homepage-btn">Start</button>
                    </Link>
                </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
