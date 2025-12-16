import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService, orderService, settingsService } from '../services/api';
import { ShoppingCart, Share2, Info, User, Check, Printer, ChevronLeft, Plus, Minus } from 'lucide-react';

const generateBillHtml = (order, settings) => {
    const formatCurrency = (amount) => Number(amount).toFixed(2);
    // Ensure numeric values
    const totalAmount = Number(order.totalAmount || 0);
    const taxAmount = Number(order.taxAmount || 0);
    const roundOff = Number(order.roundOff || 0);
    const subTotal = order.subTotal ? Number(order.subTotal) : (totalAmount - taxAmount - roundOff);

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Bill #${order.orderNumber}</title>
        <style>
            @page { margin: 0; }
            body { 
                font-family: 'Courier New', monospace; 
                width: 300px;
                margin: 0 auto; 
                padding: 10px; 
                background: white; 
                color: black;
                font-size: 12px;
                line-height: 1.2;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            
            .header { margin-bottom: 10px; border-bottom: 1px dashed black; padding-bottom: 5px; }
            .store-name { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
            
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 5px; }
            
            .table-header { display: flex; border-bottom: 1px dashed black; padding: 2px 0; margin-bottom: 5px; font-weight: bold; }
            .col-item { flex: 1; }
            .col-qty { width: 30px; text-align: center; }
            .col-price { width: 50px; text-align: right; }
            
            .item-row { display: flex; margin-bottom: 2px; }
            
            .totals { margin-top: 10px; border-top: 1px dashed black; padding-top: 5px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .grand-total { font-size: 14px; font-weight: bold; border-top: 1px solid black; border-bottom: 1px solid black; padding: 5px 0; margin-top: 5px; }
            
            .footer { text-align: center; margin-top: 15px; font-size: 10px; }
        </style>
    </head>
    <body>
        <div class="header text-center">
            <div class="store-name uppercase">${settings.store_name || 'QSR STORE'}</div>
            <div>${settings.store_address || ''}</div>
            <div>${settings.store_phone ? 'Ph: ' + settings.store_phone : ''}</div>
            ${settings.gst_no ? `<div>GSTIN: ${settings.gst_no}</div>` : ''}
        </div>

        <div class="meta-grid">
            <span>Date: ${new Date().toLocaleDateString('en-GB')}</span>
            <span>Time: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="meta-grid">
            <span>Bill No: ${order.orderNumber ? order.orderNumber.slice(-8) : '---'}</span>
            <span class="uppercase">${order.type}</span>
        </div>
        ${order.customerName ? `<div class="meta-grid"><span>Cust: ${order.customerName}</span></div>` : ''}

        <div class="table-header">
            <div class="col-item">Item</div>
            <div class="col-qty">Qty</div>
            <div class="col-price">Amt</div>
        </div>

        ${order.items.map(item => `
            <div class="item-row">
                <div class="col-item">
                    ${item.itemName}
                    ${item.variantName ? `<br><small>(${item.variantName})</small>` : ''}
                </div>
                <div class="col-qty">${item.quantity}</div>
                <div class="col-price">${formatCurrency(item.price * item.quantity)}</div>
            </div>
        `).join('')}

        <div class="totals">
            <div class="total-row">
                <span>Sub Total</span>
                <span>${formatCurrency(subTotal)}</span>
            </div>
            ${taxAmount > 0 ? `
            <div class="total-row">
                <span>Tax</span>
                <span>${formatCurrency(taxAmount)}</span>
            </div>` : ''}
            ${Math.abs(roundOff) > 0 ? `
            <div class="total-row">
                <span>Round Off</span>
                <span>${formatCurrency(roundOff)}</span>
            </div>` : ''}
            
            <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>₹ ${formatCurrency(totalAmount)}</span>
            </div>
        </div>

        <div class="footer">
            <p>Scan & Order</p>
            <p>Thank You!</p>
        </div>
    </body>
    </html>
    `;
};

const generateKotHtml = (order) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>KOT #${order.orderNumber}</title>
        <style>
            @page { margin: 0; }
            body { 
                font-family: 'Courier New', monospace; 
                width: 300px;
                margin: 0 auto; 
                padding: 10px; 
                background: white; 
                color: black;
                font-size: 12px;
            }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .header { border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 10px; }
            .item-row { display: flex; padding: 5px 0; border-bottom: 1px dashed #ccc; }
            .qty { width: 30px; font-weight: bold; font-size: 14px; }
            .name { flex: 1; font-weight: bold; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header text-center">
            <div style="font-size: 18px; font-weight: 900;">KITCHEN TICKET</div>
            <div class="uppercase bold" style="font-size: 14px;">${order.type}</div>
            <div style="margin-top:5px;">${new Date().toLocaleTimeString()}</div>
        </div>

        ${order.items.map(item => `
            <div class="item-row">
                <div class="qty">${item.quantity}</div>
                <div class="name">
                    ${item.itemName}
                    ${item.variantName ? `<br><small style="font-weight:normal">(${item.variantName})</small>` : ''}
                </div>
            </div>
        `).join('')}
    </body>
    </html>
    `;
};

export default function ConsumerMenu() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const table = searchParams.get('table');

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    // Auth State
    const [authStep, setAuthStep] = useState('login'); // 'login' | 'otp' | 'menu' | 'cart' | 'confirmed'
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    // Cart State
    const [cart, setCart] = useState([]);
    const [lastOrder, setLastOrder] = useState(null);

    useEffect(() => {
        async function loadMenu() {
            try {
                const [catRes, itemRes, setRes] = await Promise.all([
                    menuService.getCategories(),
                    menuService.getItems(),
                    settingsService.getSettings()
                ]);
                setCategories(catRes.data);
                setItems(itemRes.data || []);
                setSettings(setRes.data || {});
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        }
        loadMenu();
    }, []);

    // Derived State
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const printHtml = (html) => {
        const win = window.open('', '', 'width=400,height=600');
        win.document.write(html);
        win.document.close();
        setTimeout(() => {
            win.focus();
            win.print();
            // win.close(); // Optional: keep open for mobile users to see
        }, 500);
    };

    // Handlers
    const handleSendOtp = (e) => {
        e.preventDefault();
        if (customer.name && customer.phone.length >= 10) {
            setAuthStep('otp');
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === '1234') {
            setAuthStep('menu');
        } else {
            setOtpError('Invalid OTP (Try 1234)');
        }
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.id === itemId) return { ...i, quantity: i.quantity - 1 };
                return i;
            }).filter(i => i.quantity > 0);
        });
    };

    const getItemQty = (itemId) => cart.find(i => i.id === itemId)?.quantity || 0;

    const handlePlaceOrder = async () => {
        try {
            // Calculate tax estimates for display (simple logic, backend does actual)
            const gstPercent = parseFloat(settings.gst_percentage || 5);
            let taxAmount = 0;
            let finalTotal = 0;
            let subTotal = 0;

            // Assuming Exclusive Tax for now as per common practice
            subTotal = cartTotal;
            taxAmount = subTotal * (gstPercent / 100);
            finalTotal = subTotal + taxAmount;
            const roundOff = Math.round(finalTotal) - finalTotal;

            const orderData = {
                customerName: customer.name,
                customerPhone: customer.phone,
                tableNumber: table,
                status: 'placed',
                items: cart.map(i => ({
                    itemId: i.id,
                    itemName: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    variantId: i.variantId || null
                })),
                totalAmount: Math.round(finalTotal),
                taxAmount: taxAmount,
                subTotal: subTotal,
                roundOff: roundOff,
                source: 'ScanOrder'
            };

            const res = await orderService.create(orderData);
            const createdOrder = res.data;
            setLastOrder(createdOrder);
            setCart([]);
            setAuthStep('confirmed');

            // KOT will be printed by POS automatically

        } catch (e) {
            console.error("Order Failed", e);
            alert("Failed to place order. Please try again.");
        }
    };

    const handlePrintBill = async () => {
        if (!lastOrder) return;
        try {
            await orderService.update(lastOrder.id, { printBillRequested: true });
            alert("Bill sent to POS Printer!");
        } catch (e) {
            console.error("Print request failed", e);
            alert("Failed to send print request.");
        }
    };

    // ... Rest of Render Logic is same ...


    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Menu...</div>;

    // --- RENDERERS ---

    // 1. Login Step
    if (authStep === 'login') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <User size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome!</h2>
                    <p className="text-gray-500 text-center mb-6">Enter details to order food.</p>
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={customer.phone}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="9876543210"
                                minLength={10}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                            Send OTP
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setCustomer({ name: 'Guest User', phone: '9999999999' });
                                setAuthStep('menu');
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-500 underline"
                        >
                            Skip Login (Guest)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. OTP Step
    if (authStep === 'otp') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
                    <p className="text-gray-500 text-center mb-6 text-sm">Sent to {customer.phone}</p>
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-center text-2xl tracking-widest"
                                placeholder="1234"
                                maxLength={4}
                            />
                            {otpError && <p className="text-red-500 text-xs mt-1 text-center">{otpError}</p>}
                        </div>
                        <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                            Verify & Start Ordering
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthStep('login')}
                            className="w-full py-2 text-gray-500 text-sm font-medium hover:text-gray-700"
                        >
                            Change Number
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 3. Cart View
    if (authStep === 'cart') {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
                <div className="bg-white p-4 shadow-sm flex items-center gap-4">
                    <button onClick={() => setAuthStep('menu')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft />
                    </button>
                    <h1 className="font-bold text-lg">Your Cart</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">Cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">-</button>
                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="bg-white p-6 border-t border-gray-100 shadow-lg">
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-500">Items Total</span>
                            <span className="font-bold">₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-lg font-bold">
                            <span>Grand Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // 4. Confirmed / Status View
    if (authStep === 'confirmed') {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                <p className="text-gray-500 mb-8">Order #{lastOrder?.id || '---'}. KOT has been sent to the kitchen.</p>

                <div className="space-y-4 w-full max-w-sm">
                    <button
                        onClick={handlePrintBill}
                        className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Printer size={18} /> Print Bill
                    </button>
                    <button
                        onClick={() => setAuthStep('menu')}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/30"
                    >
                        Order More Items
                    </button>
                </div>
            </div>
        );
    }

    // 5. Menu View (Default)
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-lg">QSR Menu</h1>
                    <p className="text-xs text-green-600 font-medium">
                        {type === 'take-away' ? 'Take Away' : `Dine-In • Table ${table || '?'}`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{customer.name}</span>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        <Info size={20} />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 p-4 no-scrollbar">
                {categories.map(cat => (
                    <button key={cat.id} className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-sm active:bg-red-50 active:border-red-500 active:text-red-500">
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Items */}
            <div className="px-4 space-y-4">
                {items.map(item => {
                    const qty = getItemQty(item.id);
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                    <img src={`http://localhost:5001${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description || 'Delicious item'}</p>
                                <div className="mt-auto flex justify-between items-end">
                                    <span className="font-bold text-gray-900">₹{item.price}</span>
                                    {qty === 0 ? (
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="px-4 py-1.5 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100"
                                        >
                                            ADD +
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-red-50 rounded-lg border border-red-100 px-2 py-1">
                                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-red-600">-</button>
                                            <span className="text-sm font-bold text-red-600 w-4 text-center">{qty}</span>
                                            <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center font-bold text-red-600">+</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cart Button */}
            {cartCount > 0 && (
                <div className="fixed bottom-4 left-4 right-4 bg-red-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center z-20 cursor-pointer hover:bg-red-700 transition-colors" onClick={() => setAuthStep('cart')}>
                    <div className="flex flex-col">
                        <span className="text-xs opacity-90">{cartCount} ITEMS</span>
                        <span className="font-bold">₹{cartTotal}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        View Cart <ShoppingCart size={18} />
                    </div>
                </div>
            )}
        </div>
    );
}
