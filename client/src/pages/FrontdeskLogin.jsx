import "./FrontdeskLogin.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import FrontDesk from "./front-desk";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';








function FrontDeskLogin() {
   
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);
    const [isChecking, setChecking] = useState(false);

    const loginClick = (event) => {
        event.preventDefault();
        if (socket && !isChecking) {
            setChecking(true);
            socket.emit("checkPassword", password);
        }
        
    };
    
    
    useEffect(() => {
        if (!socket) return;

        socket.on("loginResult", (role) => {
            setChecking(false);
            if (role === "frontdesk") {
                navigate("/front-desk");
            } else {
                alert("Invalid password");
            }
        });

        return () => {
            socket.off("loginResult");
        };
            }, [socket]);

        
  

            return (
                <div className="container">
                  <form onSubmit={loginClick}>
                    <div className="login">
                      <input 
                        type="text" 
                        placeholder="password" 
                        id="loginInput" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                      />
                      <button type="submit" disabled={isChecking}>
                        {isChecking ? "Checking..." : "Login"}
                      </button>
                    </div>
                    <div>
                      <Link to="/" className="bbutton">Back to the main page</Link>
                    </div>
                  </form>
                </div>
              );
    
}

export default FrontDeskLogin;

