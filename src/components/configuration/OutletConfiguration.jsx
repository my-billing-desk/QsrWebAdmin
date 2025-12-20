import React from 'react';
import {
    Store, MapPin, Clock, CreditCard, FileText, Layout,
    Monitor, Printer, Users, Settings, Smartphone, Truck, MessageSquare, ChevronRight, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function OutletConfiguration() {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-red-600">|</span>
                    Below are the configuration to manage your outlet information.
                </h1>

                <div className="flex justify-end gap-2 mt-4 text-xs font-semibold">
                    <div className="px-3 py-1 bg-white border rounded shadow-sm text-red-600">Restaurant: ID - <span className="text-red-600">368720</span></div>
                    <div className="px-3 py-1 bg-white border rounded shadow-sm">Desktop Version : <span className="text-red-600">119.0.2</span></div>
                    <button className="px-4 py-1 bg-red-600 text-white rounded flex items-center gap-1">Search <Search className="w-3 h-3" /></button>
                </div>
            </div>

            <Section title="Outlet Information">
                <ConfigCard icon={FileText} title="Outlet Details" desc="Configure email id, address, Logo of an Outlet." to="/config/outlet-details" />
                <ConfigCard icon={Smartphone} title="Contact Details" desc="Configure contact details of your's and your staff details to reach by mybill team." />
                <ConfigCard icon={Clock} title="Outlet Timings" desc="Configure Closing hours, lunch & dinner timings, timing information to display on various places." />
                <ConfigCard icon={CreditCard} title="Payment" desc="Configure Currency and Payment Types available." to="/accounting/payments" />
                <ConfigCard icon={FileText} title="Invoice Sequence" desc="Configure multiple invoice sequence" />
                <ConfigCard icon={Layout} title="Floor Plan" desc="create your own floor plan using tables" to="/config/floor-plan" />
            </Section>

            <Section title="Billing Screen">
                <ConfigCard icon={Monitor} title="Display" desc="Configure the billing screen display, look & values." />
                <ConfigCard icon={Monitor} title="Set Your Print Logo" desc="Logo to print at your desktop point of sale." />
                <ConfigCard icon={Layout} title="Calculations" desc="Configure how invoice gets calculate." />
                <ConfigCard icon={Settings} title="Connected Services" desc="Configure how different services gets connects." to="/config/marketplace" />
                <ConfigCard icon={Printer} title="Print" desc="Configure the print settings of the Bill and KOT." to="/config/email-template" />
                <ConfigCard icon={Users} title="Customer" desc="Configure the billing screen and it's component." />
            </Section>

            <Section title="Online/Advance Order">
                <ConfigCard icon={Smartphone} title="Online/Advance Order Configuration" desc="Configure auto accept, Duration, Cancel timings etc. of Online Orders." to="/config/sub-order" />
            </Section>

            <Section title="System Setting">
                <ConfigCard icon={Monitor} title="Billing System" desc="Configure Billing screen internal settings." />
            </Section>

            <Section title="Notification Setting">
                <ConfigCard icon={Monitor} title="SMS Configuration" desc="Configure the option to receive SMS from mybill." />
            </Section>

            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-900 transition-colors">
                    <MessageSquare className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 ml-1">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}

function ConfigCard({ icon: Icon, title, desc, to }) {
    const CardContent = (
        <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-500">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}

