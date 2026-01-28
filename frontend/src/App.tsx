import './App.css'
import { useEffect,useState } from 'react';


export const Fetch = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Fetching from the Go backend
    fetch('http://localhost:8080/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
  }, []);

  return (
    <div className="App">
      <h1>TEE-AOF Project</h1>
      <p>Backend Status: <strong>{message}</strong></p>

      {/* This is the button you were working on earlier */}
      <button onClick={() => console.log('hello')}>
        Check Console
      </button>
    </div>
  );
}

export const Nav = () => {
  return <nav className='navbar'>
    <div className='navbutton' onClick={()=>{location.href='index.html'}}>
      <p>Home Page</p> 
    </div>
  </nav>
}
export const Main = () => {
  return <div className='main'>
    <Log />
    <p>hello</p>
    <Fetch/>
    </div>
}
export const Log = () => {
    const [count, setCount] = useState(0)
  return (<div className='card'>
    <button onClick={()=>{setCount(count+1), console.log(count+1)}}>{count}</button>
  </div>);
};
