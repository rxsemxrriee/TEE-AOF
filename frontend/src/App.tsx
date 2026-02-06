import './App.css'
import { useEffect,useState } from 'react';
import Popup from 'reactjs-popup';
//golang connectionโปรดอย่าแตะต้องถ้าไม่จำเป็น
export const Fetch = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
  }, []);
  return (
    <div >
      <p>Backend Status: <strong>{message}</strong></p>

      <button onClick={() => console.log('hello')}>
        Check Console
      </button>
    </div>
  );
}
//แถบนำทางข้างบน
export const Topnavbar = () => {
  return <nav className='Navbar'>
    <div className='navleft'>
      <img src='teeaof1.png' className='logoimg' onClick={()=>{location.href='index.html'}}></img>
    </div>
    <div className='navright'>
    <div className='navbutton' onClick={() => { location.href ='order.html'}}>
      <p>Menu</p>
      </div>
    <div  className='navbutton' onClick={()=>{ location.href='index.html'}}>
      <p>About us</p> 
    </div>
    <div className='navbutton' onClick={() => { location.href ='https://www.instagram.com/eight_._ten'}}>
      <p>Contact</p>
    </div>
    <img src='cart100.png' onClick={()=>{location.href='checkout.html'}}></img>
    </div>
  </nav>
}
//หน้าหลักของเว็บ
//ลองปุ่ม แก้ได้ตามชอบ
export const Log = () => {
    const [count, setCount] = useState(0)
  return (<div>
    <button onClick={()=>{setCount(count+1), console.log(count+1)}}>{count}</button>
  </div>);
};

//จำนวนorder อันนี้เป็นplaceholderมาเทสเฉยๆ
export const Order = () => {
  const [ordernum, ordercount] = useState(0)
  return (
    <div >
      <button onClick={()=>{ordercount(ordernum+1)}}>จำนวน:{ordernum}</button>
    </div>
  )
}
//หน้าorder
export const Order_main = ()=>{
  return <div className='frontbody'>
    <h1>สั่งอาหาร</h1>
    <div className='foodcontainer'>
    <Menulist/>
    <Menulist/>
    <Menulist/>
    </div>
    <Fetch />
  </div>
}
//body หน้า index
export const Frontpagebodycontent =  () => {
  return <div className='frontbody'>
      <h1>TEE AOF</h1>
      <p>สุกี้ที่อร่อยที่สุดในอุบล</p>
      <div className='gotoorder' onClick={()=>{location.href='order.html'}}>ไปสั่งเลย</div>
  </div>
}

export const Menulist= () => {
  const [popupstate,setpopupstate] = useState(false)
  if (popupstate == true) {
    return <div className='popup'>
      <p>hello</p>
    </div>
  }
  return <div className='menuselect'>
    <img src='mhoo.png' onClick={()=>{setpopupstate(true)}}></img>
    <p>หมูสไลด์</p>
  </div>
}


