import { X, Printer } from 'lucide-react';
import { createPortal } from 'react-dom';

export function OrderViewModal({ order, isOpen, onClose }) {
    if (!isOpen || !order) return null;

    const items = order.items || [];

    const InfoItem = ({ label, value, className = "" }) => (
        <div className={`flex border-b border-gray-100 last:border-0 ${className}`}>
            <span className="w-1/3 py-2 px-3 text-[11px] font-bold text-gray-900 border-r border-gray-100 bg-gray-50/50">{label}:</span>
            <span className="w-2/3 py-2 px-3 text-[11px] text-gray-700">{value || '-'}</span>
        </div>
    );

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white rounded shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
                {/* Header */}
                <div className="px-4 py-2 border-b flex justify-between items-center bg-white">
                    <h2 className="text-base font-bold text-gray-800">Order Details</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* 3-Column Grid for Metadata */}
                    <div className="border border-gray-100 rounded overflow-hidden">
                        <div className="grid grid-cols-3">
                            {/* Column 1 */}
                            <div className="border-r border-gray-100 last:border-r-0">
                                <InfoItem label="Order No." value={order.orderNumber} />
                                <InfoItem label="Customer Phone" value={order.customerPhone} />
                                <InfoItem label="No. of Persons" value={order.noOfPersons} />
                                <InfoItem label="Total Tax" value={`₹ ${parseFloat(order.taxAmount || 0).toFixed(2)}`} />
                                <InfoItem label="Settlement Amount" value={`₹ ${parseFloat(order.settlementAmount || 0).toFixed(2)}`} />
                                <InfoItem label="Paid" value={order.paidAmount ? `₹ ${order.paidAmount}` : '-'} />
                                <InfoItem label="Tip" value={order.tipAmount ? `₹ ${order.tipAmount}` : '-'} />
                                <InfoItem label="Settlement Counter" value={order.settlementCounter} />
                            </div>
                            {/* Column 2 */}
                            <div className="border-r border-gray-100 last:border-r-0">
                                <InfoItem label="Billing User" value={order.createdBy || order.userName || 'admin'} />
                                <InfoItem label="Customer Address" value={order.deliveryAddress} />
                                <InfoItem label="Order Type" value={order.type} />
                                <InfoItem label="Total Discount" value={`₹ (${parseFloat(order.discountAmount || 0).toFixed(2)})`} />
                                <InfoItem label="Order Status" value={order.status} />
                                <InfoItem label="Payment Type" value={order.paymentMode || order.paymentType || 'Other [UPI]'} />
                                <InfoItem label="Sub Order Type" value={order.subOrderType || order.type} />
                                <InfoItem label="Settled By" value={order.settledBy} />
                            </div>
                            {/* Column 3 */}
                            <div className="last:border-r-0">
                                <InfoItem label="Customer Name" value={order.customerName} />
                                <InfoItem label="Customer Locality" value={order.locality} />
                                <InfoItem label="Assign to" value={order.assignTo || '-'} />
                                <InfoItem label="Grand Total" value={`₹ ${parseFloat(order.totalAmount || 0).toFixed(2)}`} />
                                <InfoItem label="Printed" value={order.isKotPrinted ? `Yes (1 time(s)) (${new Date(order.updatedAt).toLocaleString()})` : 'No'} />
                                <InfoItem label="Coupon Code" value={order.couponCode} />
                                <InfoItem label="Sequence Name" value={order.sequenceName} />
                            </div>
                        </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
                        <div className="border border-gray-200 rounded overflow-hidden">
                            <table className="w-full text-[11px] text-left">
                                <thead className="bg-[#ebf3ff] text-gray-800 border-b border-gray-200">
                                    <tr>
                                        <th className="px-3 py-2 font-bold w-1/3">Item Name</th>
                                        <th className="px-3 py-2 font-bold">Special Note</th>
                                        <th className="px-3 py-2 font-bold text-center">Quantity</th>
                                        <th className="px-3 py-2 font-bold text-right">Unit Price (₹)</th>
                                        <th className="px-3 py-2 font-bold text-right">Total Price (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 py-2 font-medium">
                                                {item.itemName}
                                                {item.variantName && <span className="text-[10px] text-gray-400 ml-1">({item.variantName})</span>}
                                            </td>
                                            <td className="px-3 py-2 text-gray-500 italic">
                                                {item.specialNote || '--'}
                                            </td>
                                            <td className="px-3 py-2 text-center">{item.quantity}</td>
                                            <td className="px-3 py-2 text-right">{parseFloat(item.price).toFixed(2)}</td>
                                            <td className="px-3 py-2 text-right">{parseFloat(item.total).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Summary Right Aligned */}
                            <div className="border-t border-gray-200 bg-white">
                                <div className="flex justify-end p-2 px-4">
                                    <div className="w-64 space-y-1 text-[11px]">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Charge</span>
                                            <span className="font-medium">{parseFloat(order.deliveryCharge || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Container Charge</span>
                                            <span className="font-medium">{parseFloat(order.containerCharge || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Service Charge</span>
                                            <span className="font-medium">{parseFloat(order.serviceCharge || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Round Off</span>
                                            <span className="font-medium">{parseFloat(order.roundOff || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t border-gray-100">
                                            <span className="font-bold text-gray-900">Grand Total</span>
                                            <span className="font-bold text-gray-900">{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-2 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-white transition-all bg-gray-100">
                        Close
                    </button>
                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5" /> Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
