import React from 'react';
import { X, Printer, Download, Clock, User, Phone, MapPin } from 'lucide-react';

export function OrderViewModal({ order, isOpen, onClose }) {
    if (!isOpen || !order) return null;

    const items = order.items || [];
    const subTotal = order.totalAmount - (order.taxAmount || 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-none">Order Details</h2>
                        <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                            <span className="font-mono text-indigo-600 font-bold">#{order.orderNumber}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{new Date(order.createdAt).toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Print Invoice">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer & Order Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Information</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{order.customerName || 'Walk-in Guest'}</span>
                                </div>
                                {order.customerPhone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm text-gray-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{order.customerPhone}</span>
                                    </div>
                                )}
                                {order.deliveryAddress && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{order.deliveryAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Order Type</span>
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${order.type === 'dine-in' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {order.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Source</span>
                                    <span className="text-sm font-bold text-gray-700">{order.source || 'POS'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Current Status</span>
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items ({items.length})</h3>
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Item Name</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {item.itemName}
                                                {item.variantName && <span className="text-[10px] text-gray-400 ml-1">({item.variantName})</span>}
                                                {item.addons?.length > 0 && (
                                                    <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                                                        Add-ons: {item.addons.map(a => a.name).join(', ')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-gray-700">x{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">₹{item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end pt-4">
                        <div className="w-1/2 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900 font-medium">₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax</span>
                                <span className="text-gray-900 font-medium">₹{(order.taxAmount || 0).toFixed(2)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t flex justify-between">
                                <span className="text-base font-bold text-gray-900">Grand Total</span>
                                <div className="text-right">
                                    <span className="text-xl font-black text-indigo-600">₹{order.totalAmount?.toFixed(2)}</span>
                                    <p className="text-[10px] text-gray-400 font-medium">Inclusive of all taxes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border rounded-xl text-sm font-bold text-gray-600 hover:bg-white transition-all active:scale-95 shadow-sm">
                        Close
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
