import './App.css'
import { useEffect, useState } from 'react';

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
      <img src='img/teeaof1.png' className='logoimg' onClick={() => { location.href = 'index.html' }}></img>
    </div>
    <div className='navright'>
      <div className='navbutton' onClick={() => { location.href = 'order.html' }}>
        <p>Menu</p>
      </div>
      <div className='navbutton' onClick={() => { location.href = 'index.html' }}>
        <p>About us</p>
      </div>
      <div className='navbutton' onClick={() => { location.href = 'https://www.instagram.com/eight_._ten' }}>
        <p>Contact</p>
      </div>
      <img src='img/cart100.png' onClick={() => { location.href = 'checkout.html' }}></img>
    </div>
  </nav>
}
//หน้าหลักของเว็บ
//ลองปุ่ม แก้ได้ตามชอบ
export const Log = () => {
  const [count, setCount] = useState(0)
  return (<div>
    <button onClick={() => { setCount(count + 1), console.log(count + 1) }}>{count}</button>
  </div>);
};

//จำนวนorder อันนี้เป็นplaceholderมาเทสเฉยๆ
export const Order = () => {
  const [ordernum, ordercount] = useState(0)
  return (
    <div >
      <button onClick={() => { ordercount(ordernum + 1) }}>จำนวน:{ordernum}</button>
    </div>
  )
}
//หน้าorder
export const Order_main = () => {
  const food: string[] = ['Sliced pork', 'Minched pork', 'Marinated pork', 'Sliced beef', 'Marinated beef', 'Mala chicken', 'French Fries', 'Nuggets']
  const foodimg: string[] = ['mhoo.png', 'mhoobod.png', 'mhoomuk.png', 'beefslice.png', 'beefmarinate.png', 'malachicken.png', 'frenchfries.png', 'nuggets.png']

  const [cartUpdate, setCartUpdate] = useState(0);
  const updateCart = () => setCartUpdate(prev => prev + 1);

  return <div className='frontbody'>
    <h1>สั่งอาหาร</h1>
    <div className='foodcontainer'>
      {food.map((item, index) => (
        <Menulist key={index} name={item} img={foodimg[index]} onUpdate={updateCart} />
      ))}
    </div>
    {Confirmed_order.size > 0 && (
      <div className='floating-btn' onClick={() => { location.href = 'checkout.html' }}>
        <img src='img/cart100.png' style={{ width: '30px', height: '30px', marginRight: '10px' }} />
        <p style={{ margin: 0 }}>Checkout ({Confirmed_order.size})</p>
      </div>
    )}
  </div>
}
//body หน้า index
export const Frontpagebodycontent = () => {
  return <div className='frontbody'>
    <h1>TEE AOF</h1>
    <p>สุกี้ที่อร่อยที่สุดในอุบล</p>
    <div className='gotoorder' onClick={() => { location.href = 'order.html' }}>ไปสั่งเลย</div>
  </div>
}
export const Menulist = ({ name, img, onUpdate }: { name: string; img?: string; onUpdate?: () => void }) => {
  const [popupstate, setpopupstate] = useState(false)
  const [itemamount, setitemamount] = useState(0)

  const handleAddToCart = () => {
    if (itemamount <= 0) {
      alert("Please change the amount")
    }
    else {
      Confirmed_order.set(name, itemamount);
      localStorage.setItem('cart', JSON.stringify(Array.from(Confirmed_order.entries())));
      setpopupstate(false)
      setitemamount(0)
      console.log(Confirmed_order)
      if (onUpdate) onUpdate();
    }
  }

  return (
    <>
      <div className='menuselect' onClick={() => { setpopupstate(true) }}>
        <img src={img ? `img/${img}` : 'img/mhoo.png'} alt="menu"></img>
        <p>{name}</p>
      </div>

      {popupstate && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>{name}</h2>
            <img src={img ? `img/${img}` : 'img/mhoo.png'} style={{ width: '100px', borderRadius: '10px' }} />
            <p>{name}</p>
            <button className='amountbutton' onClick={() => { setitemamount(itemamount + 1) }}>+</button>
            <button className='amountbutton' onClick={() => { setitemamount(itemamount - 1) }}>-</button>
            <p>{itemamount}</p>
            <button className='addtocartbutton' onClick={handleAddToCart}>เพิ่มลงตะกร้า</button>
          </div>
        </div>
      )}
    </>
  )
}

export const Footer = () => {
  return <footer className='footer'>
    <p>hello</p>
  </footer>
}

const savedCart = localStorage.getItem('cart');
let Confirmed_order = new Map<string, number>(savedCart ? JSON.parse(savedCart) : []);
export const Checkout_order = ({ name, amount }: { name: string; amount: number }) => {
  return (
    <div className='menuselect'>
      <img src='img/mhoo.png' alt="menu" />
      <p>{name}</p>
      <p>Amount: {amount}</p>
    </div>
  );
};

export const Checkout_main = () => {
  const handleConfirmOrder = () => {
    localStorage.removeItem('cart');
    Confirmed_order.clear();
    alert('Order Confirmed!');
    location.href = 'order.html';
  };

  return (
    <div className='frontbody'>
      <h1>ยืนยันorder</h1>
      <div className='foodcontainer'>
        <ul>
          {Array.from(Confirmed_order).map(([food, amount], index) => (
            <li key={index}>
              <Checkout_order name={food} amount={amount} />
            </li>
          ))}
        </ul>
        {Confirmed_order.size > 0 && (
          <button className='addtocartbutton' onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
};