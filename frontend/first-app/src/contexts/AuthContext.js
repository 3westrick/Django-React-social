import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext()
export default AuthContext

export const AuthProvidor = ({children}) => {
    
    let [token, setToken] = useState(()=> localStorage.getItem('authtokens') ? JSON.parse(localStorage.getItem('authtokens')) : null)
    let [user, setUser] = useState(token ? jwt_decode(token.access) : null)
    let [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    async function updateToken(){
        console.log("update token called")
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': token?.refresh})
        })
        if (response.status == 200){
            let data = await response.json()
            setToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authtokens', JSON.stringify(data))
        }else{
            if (! loading){
                alert("something went wrong!")
                logout()
            }
        }
        if (loading){
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (loading)
            updateToken()

        let int_id = setInterval(()=>{
            if(token){
                updateToken()
            }
        },1000 * 60 * 4)
        return () => clearInterval(int_id)
    }, [token, loading])

    function logout(){
        setToken(null)
        setUser(null)
        localStorage.removeItem('authtokens')
        navigate('/');
    }

    async function login(e){
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        if (response.status == 200){
            let data = await response.json()
            setToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authtokens', JSON.stringify(data))
            navigate('/');
        }else{
            alert("something went wrong!")
        }
    }

    async function register(e){
        e.preventDefault()
        if (e.target.password1.value == e.target.password2.value){
            let response = await fetch('http://127.0.0.1:8000/api/user/login/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': e.target.username.value,'email': e.target.email.value
            , 'password1': e.target.password1.value, 'password2': e.target.password2.value})
        })
        if (response.status == 200){
            navigate('/login');
        }else{
            alert("something went wrong!")
        }
        }else{
            alert("Pass wrong!")
        }
        
    }

    let data = {
        login: login,
        user: user,
        logout: logout,
        token: token,
        register: register
    }
    return(
        <AuthContext.Provider value={data}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
