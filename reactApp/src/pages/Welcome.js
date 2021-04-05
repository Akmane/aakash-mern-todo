import React , {useContext} from 'react';
import {Link} from 'react-router-dom';
import { CredentialsContext} from '../App';
import Todos from '../components/Todos';


export default function Welcome() {
    const [credentials,setCredentials] = useContext(CredentialsContext);
    const logout= ()=> {
        setCredentials(null);
    };
    return (
        <div>
              {credentials && <button onClick={logout}>Logout</button>}
            <h1>Welcome {credentials && credentials.username} to TO-DO LIST</h1>
            {!credentials && <Link to="/register"> Register</Link>}
            <br/>
            {!credentials && <Link to="/login"> Login</Link>}
            {credentials && <Todos />}
        </div>
    );
}
