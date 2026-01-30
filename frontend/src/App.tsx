import './App.css'
import { useEffect,useState } from 'react';

//ΑPI โปรดอย่าแตะต้องถ้าไม่จำเป็น
export const Fetch = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
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
//แถบนำทางข้างบน
export const Nav = () => {
  return <nav className='navbar'>
    <div className='navbutton' onClick={()=>{ location.href='index.html'}}>
      <p>Home Page</p> 
    </div>
    <div className='navbutton' onClick={() => { location.href ='order.html'}}>
      <p>Order</p>
      </div>
    <div className='navbutton' onClick={() => { location.href ='https://www.instagram.com/eight_._ten'}}>
      <p>Contact</p>
    </div>
  </nav>
}
//หน้าหลักของเว็บ
export const Main = () => {
  return <div className='main'>
    <Log />
    <p>hello</p>
    <Fetch/>
    </div>
}
//ลองปุ่ม แก้ได้ตามชอบ
export const Log = () => {
    const [count, setCount] = useState(0)
  return (<div className='card'>
    <button onClick={()=>{setCount(count+1), console.log(count+1)}}>{count}</button>
  </div>);
};

//จำนวนorder อันนี้เป็นplaceholderมาเทสเฉยๆ
export const Order = () => {
  const [ordernum, ordercount] = useState(0)
  return (
    <div className='order'>
      <button onClick={()=>{ordercount(ordernum+1)}}>จำนวน:{ordernum}</button>
    </div>
  )
}
//หน้าorder
export const Order_main = ()=>{
  return <div className='main'>
    <Order/>
    <p>hello</p>
    <Fetch />
  </div>
}