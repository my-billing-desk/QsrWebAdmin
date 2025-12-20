import React from 'react';
import { X, Check } from 'lucide-react';

export default function IntegrationStatusModal({ steps, onClose, integrationName }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Integration Status - {integrationName} (Two)</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="relative pl-4">
                        {/* Connecting Line - Background */}
                        <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-gray-100" />

                        {steps.map((step, index) => {
                            const isCompleted = index === 0; // Hardcoded for this specific demo "Request received" is done
                            const isActive = index === 0;

                            return (
                                <div key={step.id} className="relative flex gap-6 mb-10 last:mb-0 group">
                                    {/* Line Segment for active part */}
                                    {isCompleted && index < steps.length - 1 && (
                                        <div className="absolute left-[19px] top-4 h-[calc(100%+40px)] w-0.5 bg-teal-400 z-0 origin-top" />
                                    )}

                                    {/* Icon */}
                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors ${isActive
                                            ? 'bg-teal-400 text-white border-white shadow-lg shadow-teal-100'
                                            : 'bg-gray-100 text-gray-400 border-white'
                                        }`}>
                                        {isActive ? <Check size={18} strokeWidth={3} /> : <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />}
                                    </div>

                                    {/* Content */}
                                    <div className="pt-1">
                                        <h3 className={`font-bold text-base mb-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.label}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-600' : 'text-gray-300'}`}>
                                            {step.desc}
                                        </p>
                                        {step.date && (
                                            <p className="text-xs font-semibold text-gray-500 mt-2">
                                                {step.date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
