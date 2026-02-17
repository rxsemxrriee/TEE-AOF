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
// Helper to get session ID from URL or LocalStorage
const getSessionId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('session') || localStorage.getItem('currentSessionId');
};

// Helper to navigate with session ID
const navigateTo = (path: string) => {
  const sessionId = getSessionId();
  if (sessionId) {
    if (path.includes('?')) {
      location.href = `${path}&session=${sessionId}`;
    } else {
      location.href = `${path}?session=${sessionId}`;
    }
  } else {
    location.href = path;
  }
};

// Helper to check if session is valid
const checkSessionValidity = async (sessionId: string) => {
  try {
    const response = await fetch(`http://localhost:8080/api/sessions/${sessionId}`);
    return response.ok;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};

//แถบนำทางข้างบน
export const Topnavbar = () => {
  return <nav className='Navbar'>
    <div className='navleft'>
      <img src='img/teeaof1.png' className='logoimg' onClick={() => navigateTo('index.html')}></img>
    </div>
    <div className='navright'>
      <div className='navbutton' onClick={() => navigateTo('order.html')}>
        <p>Menu</p>
      </div>
      <div className='navbutton' onClick={() => navigateTo('index.html')}>
        <p>About us</p>
      </div>
      <div className='navbutton' onClick={() => { location.href = 'https://www.instagram.com/eight_._ten' }}>
        <p>Contact</p>
      </div>
      <img src='img/cart100.png' onClick={() => navigateTo('checkout.html')}></img>
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
  const pork: string[] = ['Sliced pork', 'Minched pork', 'Marinated pork']
  const beef: string[] = ['Sliced beef', 'Marinated beef']
  const chicken: string[] = ['Mala chicken']
  const appetizer: string[] = ['French Fries', 'Nuggets']
  const foodimg: string[] = ['mhoo.png', 'mhoobod.png', 'mhoomuk.png', 'beefslice.png', 'beefmarinate.png', 'malachicken.png', 'frenchfries.png', 'nuggets.png']

  const [cartUpdate, setCartUpdate] = useState(0);
  const updateCart = () => setCartUpdate(prev => prev + 1);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      alert("No active session found. Returning to Home.");
      location.href = 'index.html';
      return;
    }

    const checkStatus = async () => {
      const isValid = await checkSessionValidity(sessionId);
      if (!isValid) {
        alert("This session has been ended by the moderator.");
        localStorage.removeItem('currentSessionId'); // Clear invalid session
        localStorage.removeItem('cart'); // Optional: Clear cart
        location.href = 'index.html';
      }
    };

    checkStatus(); // Check immediately
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return <div className='frontbody'>
    <h1>สั่งอาหาร</h1>
    <hr />
    <h2>Pork</h2>
    <div className='foodcontainer'>
      {pork.map((item, index) => (
        <Menulist key={`pork-${index}`} name={item} img={foodimg[index]} onUpdate={updateCart} />
      ))}
    </div>
    <hr />
    <h2>Beef</h2>
    <div className='foodcontainer'>
      {beef.map((item, index) => (
        <Menulist key={`beef-${index}`} name={item} img={foodimg[index + 3]} onUpdate={updateCart} />
      ))}
    </div>
    <hr />

    <h2>Chicken</h2>
    <div className='foodcontainer'>
      {chicken.map((item, index) => (
        <Menulist key={`chicken-${index}`} name={item} img={foodimg[index + 5]} onUpdate={updateCart} />
      ))}
    </div>
    <hr />
    <h2>Appetizer</h2>
    <div className='foodcontainer'>
      {appetizer.map((item, index) => (
        <Menulist key={`appetizer-${index}`} name={item} img={foodimg[index + 6]} onUpdate={updateCart} />
      ))}
    </div>
    {
      Confirmed_order.size > 0 && (
        <div className='floating-btn' onClick={() => navigateTo('checkout.html')}>
          <img src='img/cart100.png' style={{ width: '30px', height: '30px', marginRight: '10px' }} />
          <p style={{ margin: 0 }}>Checkout ({Confirmed_order.size})</p>
        </div>
      )
    }
  </div >
}
//body หน้า index
export const Frontpagebodycontent = () => {
  const [sessionId, setSessionId] = useState('');

  const handleJoin = async () => {
    if (!sessionId) {
      alert('Please enter a session ID');
      return;
    }
    try {
      // For now we just check if it exists or use the join endpoint with a dummy username
      // In a real app we'd ask for username
      const username = `User_${Math.floor(Math.random() * 1000)}`;
      const response = await fetch(`http://localhost:8080/api/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Session not found or failed to join');
      }

      alert(`Joined session ${sessionId} as ${username}`);
      localStorage.setItem('currentSessionId', sessionId);
      // Redirect with session ID param
      location.href = `order.html?session=${sessionId}`;
    } catch (error) {
      alert('Failed to join session. Please check the ID.');
      console.error(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');
    if (sessionParam) {
      setSessionId(sessionParam);
    }
  }, []);

  return <div className='frontbody'>
    <h1>TEE AOF</h1>
    <p>สุกี้ที่อร่อยที่สุดในอุบล</p>
    <div className='gotoorder' onClick={() => navigateTo('order.html')}>ไปสั่งเลย</div>

    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
      <h3>Join a Session</h3>
      <input
        type="text"
        placeholder="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: 'none', marginRight: '10px' }}
      />
      <button
        onClick={handleJoin}
        style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer' }}
      >
        Join
      </button>
    </div>
  </div>
}

// ... existing code ...

export const Moderator_main = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableNo, setTableNo] = useState('');

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions');
      const data = await response.json();
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const [createdLink, setCreatedLink] = useState('');

  const createSession = async () => {
    console.log("createSession called");
    if (!tableNo) {
      alert("Please enter a table number");
      return;
    }
    setLoading(true);
    setCreatedLink(''); // Reset previous link
    try {
      console.log("Fetching POST /api/sessions...");
      const response = await fetch('http://localhost:8080/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNo }),
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Session created:", data);

      const link = `${window.location.origin}/index.html?session=${data.id}`;
      setCreatedLink(link);
      alert(`Session created for Table ${data.tableNo}! ID: ${data.id}`);

      setTableNo(''); // Reset input
      fetchSessions(); // Refresh list immediately
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`Failed to create session: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await fetch(`http://localhost:8080/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
  };

  return (
    <div className='frontbody'>
      <h1>Moderator Dashboard</h1>
      <div className='foodcontainer' style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <input
          type="text"
          placeholder="Enter Table Number"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button className='addtocartbutton' onClick={createSession} disabled={loading}>
          {loading ? 'Creating...' : 'Create New Session'}
        </button>
        {createdLink && (
          <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', borderRadius: '5px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#285e61' }}>Share this link:</p>
            <a href={createdLink} target="_blank" rel="noopener noreferrer" style={{ color: '#319795', wordBreak: 'break-all' }}>{createdLink}</a>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h2>Active Sessions ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <p>No active sessions.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sessions.map((session) => (
                <li key={session.id} style={{
                  backgroundColor: 'white',
                  color: 'black',
                  margin: '10px 0',
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ fontSize: '1.2em' }}>ID: {session.id}</strong>
                    {session.tableNo && <span style={{ marginLeft: '10px', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>Table {session.tableNo}</span>}
                    <br />
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      Created: {new Date(session.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Users: {session.users ? session.users.length : 0}</strong>
                    <br />
                    <button
                      onClick={() => deleteSession(session.id)}
                      style={{
                        marginTop: '5px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
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
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      alert("No active session found. Returning to Home.");
      location.href = 'index.html';
      return;
    }

    checkSessionValidity(sessionId).then(isValid => {
      if (!isValid) {
        alert("This session has been ended by the moderator.");
        localStorage.removeItem('currentSessionId');
        location.href = 'index.html';
      }
    });
  }, []);

  const handleConfirmOrder = async () => {
    const sessionId = getSessionId();
    if (!sessionId) {
      alert('Please join a session first!');
      navigateTo('index.html');
      return;
    }

    const items = Array.from(Confirmed_order).map(([name, qty]) => ({ name, qty }));
    // In a real app, table_no might come from session or user input
    // For now we'll mock it or use the username if available
    const table_no = "Table " + (Math.floor(Math.random() * 10) + 1);

    const orderData = {
      table_no: table_no,
      items: items,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      status: "pending"
    };

    try {
      const response = await fetch(`http://localhost:8080/api/sessions/${sessionId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        Confirmed_order.clear();
        alert('Order Confirmed sent to Kitchen!');
        navigateTo('order.html');
      } else {
        alert('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order');
    }
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

export const Moderator_main_1 = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/sessions', {
        method: 'POST',
      });
      const data = await response.json();
      setSessionId(data.id);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='frontbody'>
      <h1>Moderator Dashboard</h1>
      <div className='foodcontainer' style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {!sessionId ? (
          <button className='addtocartbutton' onClick={createSession} disabled={loading}>
            {loading ? 'Creating...' : 'Create New Session'}
          </button>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Session Created!</h2>
            <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '10px 0' }}>{sessionId}</p>
            <p>Share this code with users to join.</p>
            <button className='addtocartbutton' onClick={() => setSessionId(null)}>
              Create Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Filter out completed orders if needed, or backend can filter.
        // For now, let's show all that are not 'success' (or show all and let user filter?)
        // The previous logic filtered out 'success' locally.
        // Let's filter out 'success' status orders from the main view, OR confirm updates status.
        // Only show active orders? 
        // "Success" page shows confirmed orders. Dashboard shows pending?
        // Let's assume Dashboard shows everything getting worked on.
        // If status is 'success', maybe don't show it or show as completed.
        // The previous logic REMOVED the row.
        setOrders(data ? data.filter((o: any) => o.status !== 'success') : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async (order: any) => {
    // 1. Update Backend
    if (order.session_id) {
      try {
        await fetch(`http://localhost:8080/api/sessions/${order.session_id}/orders/${order.order_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'success' })
        });
      } catch (e) {
        console.error("Failed to update backend status", e);
      }
    }

    // 2. Update Local Storage for Success Page (Legacy/User View support)
    const successOrders = JSON.parse(localStorage.getItem('success_orders') || '[]');
    const exists = successOrders.some((o: any) => o.order_id === order.order_id);
    if (!exists) {
      const updatedOrder = { ...order, status: 'success' };
      successOrders.push(updatedOrder);
      localStorage.setItem('success_orders', JSON.stringify(successOrders));
    }

    // 3. Update Local State (Optimistic update)
    setOrders(prevOrders => prevOrders.filter(o => o.order_id !== order.order_id));

    // Refresh to be sure
    fetchOrders();
  };

  return (
    <>
      <div className="navbar">
        <h1>ของที่ต้องจัดเตรียม</h1>
        <a>จัดเตรียมเรียบร้อย</a>
      </div>

      <table>
        <thead>
          <tr>
            <th>orderID</th>
            <th>โต๊ะ</th>
            <th>รายการอาหาร</th>
            <th>จำนวน</th>
            <th>timestamp</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const items = order.items || [];
            const rowCount = items.length;
            const isEven = parseInt(order.order_id || '0') % 2 === 1;
            const rowClass = isEven ? 'bg-even' : 'bg-odd';

            return items.map((item: any, index: number) => (
              <tr key={`${order.order_id}-${index}`} className={rowClass}>
                {index === 0 && (
                  <>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.order_id}</td>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.table_no}</td>
                  </>
                )}
                <td>{item.name}</td>
                <td>{item.qty}</td>
                {index === 0 && (
                  <>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.timestamp || ''}</td>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>
                      <button className="confirmbtn" onClick={() => handleConfirm(order)}>ยืนยันorder</button>
                    </td>
                  </>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </>
  );
};

export const Success = () => {
  const [successOrders, setSuccessOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('success_orders') || '[]');
      setSuccessOrders(storedOrders);
    };

    loadOrders(); // Load initially

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'success_orders') {
        loadOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear the session? This will delete all confirmed orders.')) {
      localStorage.removeItem('success_orders');
      setSuccessOrders([]);
      alert('Session cleared!');
    }
  };

  return (
    <>
      <div className="navbar">
        <h1>ของที่ต้องจัดเตรียม</h1>
        <button
          onClick={handleClearSession}
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Clear Session
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>orderID</th>
            <th>โต๊ะ</th>
            <th>รายการอาหาร</th>
            <th>จำนวน</th>
            <th>timestamp</th>
          </tr>
        </thead>
        <tbody>
          {successOrders.map((order) => {
            const items = order.items || [];
            const rowCount = items.length;
            const isEven = parseInt(order.order_id) % 2 === 1;
            const rowClass = isEven ? 'bg-even' : 'bg-odd';

            return items.map((item: any, index: number) => (
              <tr key={`${order.order_id}-${index}`} className={rowClass}>
                {index === 0 && (
                  <>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.order_id}</td>
                    <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.table_no}</td>
                  </>
                )}
                <td>{item.name}</td>
                <td>{item.qty}</td>
                {index === 0 && (
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.timestamp || ''}</td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </>
  );
};