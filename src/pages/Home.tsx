import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    Fname: string;
    Lname: string;
}

const HomePage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Fetch data from the Flask API
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <div>
            <h1 className="text-red-800">This is the home page</h1>
            <ul className='text-red-800'>
                {users.map(user => (
                    <li key={user.id}>
                        {user.Fname} {user.Lname}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;
