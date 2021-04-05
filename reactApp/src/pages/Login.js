import React , {useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { CredentialsContext} from '../App';



export const handleErrors= async (response) => {
    if(!response.ok) {
        const {message}= await response.json();
        // console.log("message",message);
        throw Error(message);
    }else{
        alert('logged in  successfully')
    }
    return response.json();
};


export default function Login() {
    const [username,setUsername]= useState("");
    const [password,setPassword]= useState("");
    const [error,setError]= useState("");
    const [,setCredentials] = useContext(CredentialsContext);

    const login = (e)=> {
        e.preventDefault();
        e.target.reset();
        fetch('http://localhost:4000/login',{
            method: "POST",
            headers :{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }) ,
        })
        .then(handleErrors)
        .then(()=> {
            setCredentials({
                username,
                password,
            })
            history.push('/');
        })
        .catch((error) => {
            setError(error.message);
        });
    };
    const history= useHistory();
    return(
        <div>
             <h1>LOGIN HERE TO ADD TODOS</h1>
             {error && <span style={{ color: "red" }}>{error}</span>}
                     
            <form onSubmit={login}>
                
               
                <label>Username</label>
                <input onChange={(e)=>setUsername(e.target.value)}
                 placeholder="username"  type="text"/>
                <br/>
                <label>Password</label>
                <input onChange={(e)=>setPassword(e.target.value)}
                 placeholder="password" type="password" />
                <br/>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}