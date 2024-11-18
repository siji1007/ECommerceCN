import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    Fname: string;
    Lname: string;
}

const HomePage: React.FC = () => {

    return (
        <div>
            <h1 className="flex text-red-800 justify-center items-center">This is the home page</h1>
        </div>
    );
}

export default HomePage;
