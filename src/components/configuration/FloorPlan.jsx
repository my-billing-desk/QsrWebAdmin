import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export function FloorPlan() {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Floor Plan</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">Preview</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">Discard</button>
                    <button className="px-4 py-2 bg-red-700 text-white rounded text-sm hover:bg-red-800">Save Floor Plan</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
            </div>

            <div className="flex gap-6 h-[700px]">
                {/* Left Panel */}
                <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="font-bold text-gray-700 dark:text-gray-200">Floor Plan</h2>
                        <span className="text-gray-400 cursor-pointer">✎</span>
                    </div>

                    <div>
                        <h3 className="text-red-600 text-sm font-semibold mb-2">Other</h3>
                        <div className="flex gap-2 flex-wrap text-sm">
                            <div className="w-12 h-12 bg-gray-500 text-white flex items-center justify-center rounded shadow cursor-pointer">SS</div>
                            <div className="w-12 h-12 bg-gray-500 text-white flex items-center justify-center rounded shadow cursor-pointer">1</div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Editor */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Grid Canvas */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMGgwdjFIMHoiIGZpbGw9IiNlNWU1ZTUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')]">
                        {/* Canvas Area */}
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex gap-8 items-end">
                        <div className="flex gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">Height</label>
                                <input type="number" className="w-16 p-1 border rounded text-center" defaultValue={0} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">Width</label>
                                <input type="number" className="w-16 p-1 border rounded text-center" defaultValue={0} />
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center border rounded mt-auto hover:bg-gray-50">↻</button>
                            <button className="w-8 h-8 flex items-center justify-center border rounded mt-auto hover:bg-gray-50">↺</button>
                            <button className="w-8 h-8 flex items-center justify-center border rounded mt-auto hover:bg-gray-50 text-red-600"><Trash2Icon /></button>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600">Text Size</label>
                            <input type="number" className="w-16 p-1 border rounded text-center" defaultValue={14} />
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Shape</label>
                            <div className="flex gap-4 items-center h-8">
                                <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-8 h-8 bg-gray-200 cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-8 h-8 bg-gray-200 rotate-45 transform scale-75 cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-b-xl rounded-t-sm cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-16 h-8 bg-gray-200 cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-16 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"></div>
                            </div>
                        </div>

                        {/* Barriers */}
                        <div className="flex flex-col gap-1 border-l pl-4">
                            <label className="text-xs font-semibold text-gray-600">Barriers</label>
                            <div className="flex gap-2">
                                <div className="w-4 h-8 bg-gray-200 cursor-pointer hover:bg-gray-300"></div>
                                <div className="w-8 h-4 bg-gray-200 cursor-pointer hover:bg-gray-300 self-end"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Trash2Icon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>; }
