import React, { useState } from 'react';
import {
    Calendar, Bell, ShoppingBag, RefreshCcw, FileText, TrendingUp, Users, Box, ArrowUpRight, ArrowDownRight,
    MoreHorizontal, Filter, Download, Plus, ChevronDown, Monitor, Search, UtensilsCrossed
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// Data Mocks
const SALES_DATA = [
    { name: '2 am', purchase: 20000, sales: 15000 },
    { name: '4 am', purchase: 50000, sales: 30000 },
    { name: '8 am', purchase: 35000, sales: 25000 },
    { name: '10 am', purchase: 60000, sales: 45000 },
    { name: '12 pm', purchase: 40000, sales: 20000 },
    { name: '2 pm', purchase: 50000, sales: 35000 },
    { name: '4 pm', purchase: 70000, sales: 40000 },
    { name: '6 pm', purchase: 45000, sales: 30000 },
    { name: '8 pm', purchase: 60000, sales: 45000 },
    { name: '10 pm', purchase: 50000, sales: 25000 },
];

const DONUT_DATA = [
    { name: 'First Time', value: 5500, color: '#FF9F43' },
    { name: 'Returning', value: 3500, color: '#28C76F' },
];

const CATEGORY_DATA = [
    { name: 'Electronics', value: 698, color: '#FF9F43' },
    { name: 'Sports', value: 545, color: '#EA5455' },
    { name: 'Lifestyle', value: 456, color: '#28C76F' },
];

const TRANSACTIONS = [
    { date: '24 May 2025', customer: 'Andrea Willer', img: 'https://randomuser.me/api/portraits/women/1.jpg', id: '#114589', status: 'Completed', statusColor: 'bg-green-100 text-green-600', amount: '$4,560' },
    { date: '23 May 2025', customer: 'Timothy Sandsr', img: 'https://randomuser.me/api/portraits/men/2.jpg', id: '#114590', status: 'Completed', statusColor: 'bg-green-100 text-green-600', amount: '$3,569' },
    { date: '22 May 2025', customer: 'Binnie Rodriquez', img: 'https://randomuser.me/api/portraits/women/3.jpg', id: '#114591', status: 'Draft', statusColor: 'bg-pink-100 text-pink-600', amount: '$4,560' },
    { date: '21 May 2025', customer: 'Randy McCree', img: 'https://randomuser.me/api/portraits/men/4.jpg', id: '#114592', status: 'Completed', statusColor: 'bg-green-100 text-green-600', amount: '$2,155' },
    { date: '21 May 2025', customer: 'Dennis Anderson', img: 'https://randomuser.me/api/portraits/men/5.jpg', id: '#114593', status: 'Completed', statusColor: 'bg-green-100 text-green-600', amount: '$5,123' },
];

const TOP_PRODUCTS = [
    { name: 'Charger Cable - Lightning', price: '$1.97', stat: '+24% Sales', img: '🔌', trend: '+ 25%', trendColor: 'bg-green-100 text-green-600' },
    { name: 'Yves Saint Eau De Parfum', price: '$145', stat: '+28% Sales', img: '🧴', trend: '+ 25%', trendColor: 'bg-green-100 text-green-600' },
    { name: 'Apple Airpods 2', price: '$450', stat: '+50% Sales', img: '🎧', trend: '+ 25%', trendColor: 'bg-green-100 text-green-600' },
    { name: 'Vacuum Cleaner', price: '$150', stat: '+22% Sales', img: '🧹', trend: '- 15%', trendColor: 'bg-red-100 text-red-600' },
    { name: 'Samsung Galaxy S21 Fe 5g', price: '$899', stat: '+30% Sales', img: '📱', trend: '+ 25%', trendColor: 'bg-green-100 text-green-600' },
];

const LOW_STOCK = [
    { name: 'Dell XPS 13', id: 'ID : 70568914', stock: '05', img: '💻', status: 'In stock', statusColor: 'text-green-600' },
    { name: 'Vacuum Cleaner Robot', id: 'ID : 70403034', stock: '14', img: '🤖', status: 'In stock', statusColor: 'text-green-600' },
    { name: 'KitchenAid Stand Mixer', id: 'ID : 73255559', stock: '21', img: '🥣', status: 'In stock', statusColor: 'text-green-600' },
    { name: 'Levi\'s Trucker Jacket', id: 'ID : A124538', stock: '12', img: '🧥', status: 'In stock', statusColor: 'text-green-600' },
    { name: 'Lay\'s Classic', id: 'ID : 7365558', stock: '10', img: '🍟', status: 'In stock', statusColor: 'text-green-600' },
];

export function Dashboard() {
    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-y-auto w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-orange-200">
                    <div>
                        <div className="text-orange-100 text-sm font-medium mb-1">Total Sales</div>
                        <div className="text-2xl font-bold mb-1">$48,988,078</div>
                        <div className="text-sm font-medium opacity-90">200 Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Online Orders */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-blue-200">
                    <div>
                        <div className="text-blue-100 text-sm font-medium mb-1">Online Orders</div>
                        <div className="text-2xl font-bold mb-1">$16,478,145</div>
                        <div className="text-sm font-medium opacity-90">120 Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Takeaway */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-teal-200">
                    <div>
                        <div className="text-teal-100 text-sm font-medium mb-1">Takeaway</div>
                        <div className="text-2xl font-bold mb-1">$14,145,789</div>
                        <div className="text-sm font-medium opacity-90">50 Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Dine-In */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-purple-200">
                    <div>
                        <div className="text-purple-100 text-sm font-medium mb-1">Dine-In</div>
                        <div className="text-2xl font-bold mb-1">$18,364,144</div>
                        <div className="text-sm font-medium opacity-90">30 Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>


            {/* 5. Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales & Purchase Chart (Larger) */}
                <div className="lg:col-span-8 bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-orange-100 text-orange-500 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
                            <h3 className="font-bold text-lg text-gray-800">Sales & Purchase</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Total Purchase
                                <span className="w-2 h-2 rounded-full bg-orange-200"></span> Total Sales
                            </div>
                            <div className="flex bg-gray-100 rounded p-1 ml-4">
                                {['1D', '1W', '1M', '3M', '6M', '1Y'].map(t => (
                                    <button key={t} className={`px-2 py-1 text-xs rounded font-medium ${t === '1Y' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-64 cursor-crosshair">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SALES_DATA} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="purchase" fill="#FFEDD5" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="sales" fill="#F97316" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Overall Info & Customers Overview */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Overall Info */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs font-bold">i</div>
                            <h3 className="font-bold text-gray-800">Overall Information</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Suppliers', val: '6987', color: 'text-blue-500', bg: 'bg-blue-50', icon: Users },
                                { label: 'Customer', val: '4896', color: 'text-orange-500', bg: 'bg-orange-50', icon: Users },
                                { label: 'Orders', val: '487', color: 'text-green-500', bg: 'bg-green-50', icon: ShoppingBag },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                                    <item.icon className={`w-6 h-6 mb-2 ${item.color}`} />
                                    <div className="font-bold text-gray-800">{item.label}</div>
                                    <div className="text-xl font-bold text-gray-900">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Customers Overview */}
                    <div className="bg-white rounded-xl border shadow-sm p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Customers Overview</h3>
                            <select className="text-xs border rounded px-2 py-1 bg-white"><option>Today</option></select>
                        </div>
                        <div className="flex items-center justify-between flex-1">
                            <div className="w-32 h-32 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={DONUT_DATA} innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
                                            {DONUT_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">Total</div>
                            </div>
                            <div className="flex flex-col gap-4 text-sm w-1/2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-lg">5.5K</div>
                                        <div className="text-xs text-red-500 font-medium">First Time</div>
                                    </div>
                                    <div className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">+ 20%</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-lg">3.5K</div>
                                        <div className="text-xs text-green-500 font-medium">Returning</div>
                                    </div>
                                    <div className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">+ 21%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Lists Section (Top Selling, Low Stock, Recent Sales) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2 text-gray-800">
                            <span className="w-6 h-6 rounded bg-pink-100 flex items-center justify-center text-pink-500">🏆</span> Top Selling Products
                        </div>
                        <div className="text-xs border rounded px-2 py-1 bg-white cursor-pointer">Today <ChevronDown className="w-3 h-3 inline" /></div>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {TOP_PRODUCTS.map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">{p.img}</div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-800">{p.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{p.price} • <span className="text-gray-400">{p.stat}</span></div>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded ${p.trendColor}`}>{p.trend}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2 text-gray-800">
                            <span className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-500">⚠️</span> Low Stock Products
                        </div>
                        <div className="text-xs text-blue-600 font-bold underline cursor-pointer">View All</div>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {LOW_STOCK.map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">{p.img}</div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-800">{p.name}</div>
                                        <div className="text-xs text-gray-400 font-medium">{p.id}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">In Stock</div>
                                    <div className="font-bold text-red-500 text-sm">{p.stock}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2 text-gray-800">
                            <span className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-500">🛍️</span> Recent Sales
                        </div>
                        <div className="text-xs border rounded px-2 py-1 bg-white cursor-pointer">Weekly <ChevronDown className="w-3 h-3 inline" /></div>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {TOP_PRODUCTS.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">{p.img}</div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-800">{p.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{p.price}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500">Today</div>
                                    <div className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">+ Process</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 7. Transactions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2 text-gray-800">
                            <span className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-red-500">📄</span> Recent Transactions
                        </div>
                        <div className="text-xs text-gray-600 font-bold underline cursor-pointer">View All</div>
                    </div>
                    {/* Tabs */}
                    <div className="flex border-b text-sm font-medium text-gray-500">
                        <button className="px-6 py-3 border-b-2 border-orange-500 text-orange-500 font-bold bg-orange-50/50">Sale</button>
                        <button className="px-6 py-3 border-b-2 border-transparent hover:text-gray-800">Purchase</button>
                        <button className="px-6 py-3 border-b-2 border-transparent hover:text-gray-800">Quotation</button>
                        <button className="px-6 py-3 border-b-2 border-transparent hover:text-gray-800">Expenses</button>
                        <button className="px-6 py-3 border-b-2 border-transparent hover:text-gray-800">Invoices</button>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {TRANSACTIONS.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500 font-medium">{t.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <img src={t.img} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                                            <div>
                                                <div className="font-bold text-gray-800">{t.customer}</div>
                                                <div className="text-xs text-orange-500 font-medium">{t.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.statusColor}`}>{t.status}</span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-800">{t.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sales Statics (Mini Chart) */}
                <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-pink-100 text-pink-500 flex items-center justify-center">📊</span> Sales Statics
                        </div>
                        <div className="text-xs border rounded px-2 py-1 bg-white">2025 <ChevronDown className="w-3 h-3 inline" /></div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-green-500">$12,189</span>
                                <span className="text-[10px] bg-green-100 text-green-600 px-1 rounded font-bold">+12%</span>
                            </div>
                            <div className="text-xs text-gray-400">Revenue</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-orange-500">$48,988,078</span>
                                <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">-25%</span>
                            </div>
                            <div className="text-xs text-gray-400">Expense</div>
                        </div>
                    </div>
                    {/* Placeholder for small bar chart */}
                    <div className="flex-1 min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SALES_DATA.slice(0, 8)} barCategoryGap={4}>
                                <Bar dataKey="purchase" fill="#28C76F" radius={[2, 2, 0, 0]} barSize={4} />
                                <Bar dataKey="sales" fill="#EA5455" radius={[2, 2, 0, 0]} barSize={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 8. Bottom Widgets (Top Customers, Top Categories, Order Stats) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Customers */}
                <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2 text-gray-800">
                            <span className="w-6 h-6 rounded bg-orange-100 text-orange-500 flex items-center justify-center">👔</span> Top Customers
                        </div>
                        <div className="text-xs text-gray-600 font-bold underline cursor-pointer">View All</div>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {[
                            { name: 'Carlos Curran', loc: 'USA', orders: '24 Orders', spend: '$8,9645', img: 'https://randomuser.me/api/portraits/men/11.jpg' },
                            { name: 'Stan Counter', loc: 'UAE', orders: '12 Orders', spend: '$15,985', img: 'https://randomuser.me/api/portraits/women/12.jpg' },
                            { name: 'Richard Wilson', loc: 'Germany', orders: '14 Orders', spend: '$5,366', img: 'https://randomuser.me/api/portraits/men/13.jpg' },
                        ].map((c, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={c.img} className="w-10 h-10 rounded bg-gray-200" alt="" />
                                    <div>
                                        <div className="font-bold text-sm text-gray-800">{c.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{c.loc} • {c.orders}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-gray-800 text-sm">{c.spend}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories Donut */}
                <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-orange-100 text-orange-500 flex items-center justify-center">📂</span> Top Categories
                        </div>
                        <div className="text-xs border rounded px-2 py-1 bg-white">Weekly <ChevronDown className="w-3 h-3 inline" /></div>
                    </div>
                    <div className="flex items-center justify-center h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={CATEGORY_DATA} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute right-0 top-10 text-xs flex flex-col gap-2">
                            {CATEGORY_DATA.map((c, i) => (
                                <div key={i} className="flex gap-1 items-center">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                                    <span className="font-bold text-gray-600">{c.value} Sales</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto text-xs space-y-2">
                        <div className="flex justify-between border-b pb-1">
                            <span>Total Number Of Categories</span>
                            <span className="font-bold">698</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Number Of Products</span>
                            <span className="font-bold">7899</span>
                        </div>
                    </div>
                </div>

                {/* Order Statistics (Heatmap placeholder) */}
                <div className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-purple-100 text-purple-500 flex items-center justify-center">🌐</span> Order Statistics
                        </div>
                        <div className="text-xs border rounded px-2 py-1 bg-white">Weekly <ChevronDown className="w-3 h-3 inline" /></div>
                    </div>
                    {/* Visual Mock of Heatmap using Flex grid */}
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-400 font-medium">
                        <div></div>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center">{d}</div>)}

                        {['10am', '12pm', '2pm', '4pm', '6pm'].map((t, rowI) => (
                            <React.Fragment key={t}>
                                <div className="text-right pr-2">{t}</div>
                                {[...Array(7)].map((_, colI) => (
                                    <div key={colI} className={`h-6 rounded ${Math.random() > 0.6 ? 'bg-orange-400' : 'bg-orange-100'}`}></div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
