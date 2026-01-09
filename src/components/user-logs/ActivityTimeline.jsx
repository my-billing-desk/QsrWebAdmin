import React from 'react';

export function ActivityTimeline() {
    // Mock Data based on Reference
    const timelineData = [
        {
            date: '24 Sep 2024',
            title: 'Documentation',
            description: 'Document system processes, policies, and procedures.',
            active: false
        },
        {
            date: '20 Sep 2024',
            title: 'Testing and Quality Assurance',
            description: 'Perform unit testing, integration testing, and user acceptance testing',
            active: false
        },
        {
            date: '10 Sep 2024',
            title: 'System Design and Configuration',
            description: 'Set up modules, workflows, and user roles',
            active: false
        },
        {
            date: '02 Sep 2024',
            title: 'Requirements Gathering',
            description: 'Collect requirements from HR, IT, and end-users.',
            active: false
        },
        {
            date: '01 Sep 2024',
            title: 'Planning and Preparation',
            description: 'Identify objectives, deliverables, and stakeholders.',
            active: false
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 font-sans gap-6 overflow-y-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Timeline</h1>
                <div className="text-sm text-gray-500">Pages / <span>Timeline</span></div>
            </div>

            {/* Timeline Container */}
            <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[140px] top-4 bottom-0 w-px bg-gray-200 dark:bg-gray-700 md:left-[140px] left-8"></div>

                    <div className="space-y-12">
                        {timelineData.map((item, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row gap-8 items-start">
                                {/* Date Section */}
                                <div className="md:w-[140px] shrink-0 text-right pt-1 hidden md:block">
                                    <span className="text-sm font-medium text-gray-500">{item.date}</span>
                                </div>
                                {/* Mobile Date */}
                                <div className="md:hidden pl-12 text-sm text-gray-500 mb-[-20px]">{item.date}</div>

                                {/* Node */}
                                <div className="absolute left-[8px] md:left-[140px] -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full border-[3px] border-surface bg-gray-200 z-10 box-content" style={{ borderColor: 'var(--bg-white)' }}>
                                    {/* Inner dot optional, ref shows just a circle mostly or active state */}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 pl-12 md:pl-0">
                                    <h3 className="text-base font-bold text-main mb-1" style={{ color: 'var(--text-main)' }}>{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
