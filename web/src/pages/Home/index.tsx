import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import './styles.css';
import logo from '../../assets/logo.svg';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                <img src={logo} alt="eRecycle" />
                </header>

                <main>
                    <h1>Your marketplace can help in waste collection</h1>
                    <p>We help people to find the right place to dispose their recycles.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Register a collection point</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;
