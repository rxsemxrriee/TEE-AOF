import './App.css';
import './style.css';
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
    const response = await fetch(`http://localhost:8080/tables/${sessionId}`);
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
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({
    meat: [], fish: [], veg: [], app: [], drink: []
  });

  const [, setCartUpdate] = useState(0);
  const updateCart = () => setCartUpdate(prev => prev + 1);

  // Fetch menu from DB
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:8080/menu');
        if (response.ok) {
          const result = await response.json();
          const items = result.data || [];
          const grouped: { [key: string]: any[] } = { meat: [], fish: [], veg: [], app: [], drink: [] };
          items.forEach((item: any) => {
            if (grouped[item.Category]) {
              grouped[item.Category].push(item);
            } else {
              grouped.other = grouped.other || [];
              grouped.other.push(item);
            }
          });
          setCategories(grouped);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic menu", err);
      }
    };
    fetchMenu();
  }, []);

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

    {Object.keys(categories).map((categoryKey) => {
      const items = categories[categoryKey];
      if (!items || items.length === 0) return null;

      const titleMap: { [key: string]: string } = {
        meat: 'Meat', fish: 'Seafood', veg: 'Vegetables', app: 'Appetizers', drink: 'Drinks', other: 'Other'
      };

      return (
        <div key={categoryKey}>
          <hr />
          <h2>{titleMap[categoryKey] || categoryKey}</h2>
          <div className='foodcontainer'>
            {items.map((item: any) => (
              <Menulist key={item.ID} id={item.ID} name={item.Name} img="mhoo.png" onUpdate={updateCart} />
            ))}
          </div>
        </div>
      );
    })}

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
      alert('Please enter a session token');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/tables/${sessionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Table session not found or failed to join');
      }

      alert(`Joined table session with Token ${sessionId}`);
      localStorage.setItem('currentSessionId', sessionId);
      // Redirect with session ID param
      location.href = `order.html?session=${sessionId}`;
    } catch (error) {
      alert('Failed to join table. Please check the Token.');
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
        placeholder="Enter Table Token"
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
      const response = await fetch('http://localhost:8080/tables');
      if (response.ok) {
        const result = await response.json();
        setSessions(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const [createdLink, setCreatedLink] = useState('');

  const createSession = async () => {
    if (!tableNo) {
      alert("Please enter a table number");
      return;
    }
    setLoading(true);
    setCreatedLink(''); // Reset previous link
    try {
      const response = await fetch('http://localhost:8080/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNo }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const newTable = result.data;

      const link = `${window.location.origin}/index.html?session=${newTable.Token}`;
      setCreatedLink(link);
      alert(`Session created for Table ${newTable.Number}!\nToken: ${newTable.Token}`);

      setTableNo(''); // Reset input
      fetchSessions(); // Refresh list immediately
    } catch (error) {
      console.error('Error creating table session:', error);
      alert(`Failed to create table session: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: number) => {
    if (confirm("Are you sure you want to delete this table?")) {
      try {
        const response = await fetch(`http://localhost:8080/tables/${sessionId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchSessions();
        } else {
          alert("Failed to delete table");
        }
      } catch (error) {
        console.error("Error deleting table:", error);
      }
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
          {loading ? 'Creating...' : 'Create New Table Session'}
        </button>
        {createdLink && (
          <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', borderRadius: '5px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#285e61' }}>Share this link:</p>
            <a href={createdLink} target="_blank" rel="noopener noreferrer" style={{ color: '#319795', wordBreak: 'break-all' }}>{createdLink}</a>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h2>Active Tables ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <p>No active tables.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sessions.map((session) => (
                <li key={session.ID} style={{
                  backgroundColor: 'white',
                  color: 'black',
                  margin: '10px 0',
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1.2em' }}>Table {session.Number}</strong>
                    <span style={{ marginLeft: '10px', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>Token: {session.Token}</span>
                    <br />
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      Created: {new Date(session.CreateAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Status: {session.Status}</strong>
                    <br />
                    <button
                      onClick={() => deleteSession(session.ID)}
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
export const Menulist = ({ id, name, img, onUpdate }: { id: number; name: string; img?: string; onUpdate?: () => void }) => {
  const [popupstate, setpopupstate] = useState(false)
  const [itemamount, setitemamount] = useState(0)

  const handleAddToCart = () => {
    if (itemamount <= 0) {
      alert("Please change the amount")
    }
    else {
      Confirmed_order.set(id, { name, qty: itemamount });
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
let Confirmed_order = new Map<number, { name: string, qty: number }>(savedCart ? JSON.parse(savedCart) : []);

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

    const items = Array.from(Confirmed_order).map(([id, data]) => ({ menu_item_id: id, quantity: data.qty }));

    const orderData = {
      token: sessionId,
      items: items,
    };

    try {
      const response = await fetch(`http://localhost:8080/orders`, {
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
          {Array.from(Confirmed_order).map(([id, data]) => (
            <li key={id}>
              <Checkout_order name={data.name} amount={data.qty} />
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

const PendingOrdersView = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders');
      if (response.ok) {
        const result = await response.json();
        // Assuming backend returns Order objects with {ID, TableID, Status, CreateAt, Items: []}
        setOrders(result.data ? result.data.filter((o: any) => o.Status !== 'served') : []);
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
    try {
      if (order.ID) {
        await fetch(`http://localhost:8080/orders/${order.ID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'served' })
        });
      }
    } catch (e) {
      console.error("Failed to update backend status", e);
    }

    setOrders(prevOrders => prevOrders.filter(o => o.ID !== order.ID));
    // Trigger storage event so Success tab updates if it's open (though they share local fetch now)
    window.dispatchEvent(new Event('storage'));
    fetchOrders();
  };

  return (
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
        {orders.map((order, orderIndex) => {
          const items = order.Items || [];
          const rowCount = items.length === 0 ? 1 : items.length;
          const isEven = orderIndex % 2 === 0;
          const rowClass = isEven ? 'bg-even' : 'bg-odd';

          if (items.length === 0) {
            return (
              <tr key={`${order.ID}-noitems`} className={rowClass}>
                <td>{order.ID}</td>
                <td>{order.Table?.Number ?? order.TableID}</td>
                <td colSpan={2} style={{ color: '#999' }}>No items</td>
                <td>{new Date(order.CreateAt).toLocaleTimeString()}</td>
                <td>
                  <button className="confirmbtn" onClick={() => handleConfirm(order)}>ยืนยันorder</button>
                </td>
              </tr>
            );
          }

          return items.map((item: any, index: number) => (
            <tr key={`${order.ID}-${index}`} className={rowClass}>
              {index === 0 && (
                <>
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.ID}</td>
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.Table?.Number ?? order.TableID}</td>
                </>
              )}
              {/* Assuming MenuItemID is mapped to item's name somehow, or needs adjusting. We just show ID if name is missing */}
              <td>{item.MenuItem?.Name ?? `Item #${item.MenuItemID}`}</td>
              <td>{item.Quantity}</td>
              {index === 0 && (
                <>
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{new Date(order.CreateAt).toLocaleTimeString()}</td>
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
  );
};

const SuccessOrdersView = () => {
  const [successOrders, setSuccessOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders');
      if (response.ok) {
        const result = await response.json();
        setSuccessOrders(result.data ? result.data.filter((o: any) => o.Status === 'served') : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Load initially

    const handleStorageChange = () => {
      fetchOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(fetchOrders, 5000); // 5s polling for success

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    }
  }, []);

  return (
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
        {successOrders.map((order, orderIndex) => {
          const items = order.Items || [];
          const rowCount = items.length === 0 ? 1 : items.length;
          const isEven = orderIndex % 2 === 0;
          const rowClass = isEven ? 'bg-even' : 'bg-odd';

          if (items.length === 0) {
            return (
              <tr key={`${order.ID}-noitems`} className={rowClass}>
                <td>{order.ID}</td>
                <td>{order.Table?.Number ?? order.TableID}</td>
                <td colSpan={2} style={{ color: '#999' }}>No items</td>
                <td>{new Date(order.CreateAt).toLocaleTimeString()}</td>
              </tr>
            );
          }

          return items.map((item: any, index: number) => (
            <tr key={`${order.ID}-${index}`} className={rowClass}>
              {index === 0 && (
                <>
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.ID}</td>
                  <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{order.Table?.Number ?? order.TableID}</td>
                </>
              )}
              <td>{item.MenuItem?.Name ?? `Item #${item.MenuItemID}`}</td>
              <td>{item.Quantity}</td>
              {index === 0 && (
                <td rowSpan={rowCount} style={{ verticalAlign: 'top' }}>{new Date(order.CreateAt).toLocaleTimeString()}</td>
              )}
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
};

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'success'>('pending');

  const handleClearSession = async () => {
    if (confirm('Are you sure you want to clear the session? This will delete all confirmed orders.')) {
      try {
        const response = await fetch('http://localhost:8080/orders/served', {
          method: 'DELETE',
        });
        if (response.ok) {
          localStorage.removeItem('success_orders');
          window.dispatchEvent(new Event('storage')); // trigger update if needed
          alert('Session cleared!');
        } else {
          alert('Failed to clear orders');
        }
      } catch (error) {
        console.error('Error clearing orders:', error);
      }
    }
  };

  return (
    <>
      <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <h1 style={{ margin: 0 }}>{activeTab === 'pending' ? 'ของที่ต้องจัดเตรียม' : 'ออเดอร์ที่เสร็จสิ้น'}</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'pending' ? '#ff6b6b' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === 'pending' ? 'bold' : 'normal'
            }}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setActiveTab('success')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'success' ? '#ff6b6b' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === 'success' ? 'bold' : 'normal'
            }}
          >
            Success Orders
          </button>
          {activeTab === 'success' && (
            <button
              onClick={handleClearSession}
              style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Clear Session
            </button>
          )}
        </div>
      </div>

      {activeTab === 'pending' ? <PendingOrdersView /> : <SuccessOrdersView />}
    </>
  );
};