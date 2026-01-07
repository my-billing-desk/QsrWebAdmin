# SmartQSR Comprehensive Admin Documentation
## Modules, Sub-Modules, and Feature Details

This document provides a granular breakdown of every module and sub-module within the SmartQSR Admin Panel, detailing the specific functionalities and features available to administrators.

---

## 1. 📊 Dashboard Module
The nerve center for business intelligence and real-time monitoring.

### 🏠 Main Dashboard
*   **Performance Metrics**: 
    *   **Total Income**: Net revenue for the selected period.
    *   **Total Orders**: Volume of orders processed.
    *   **Total Customers**: Count of unique mobile numbers served.
    *   **Avg Per Customer**: Average transaction value per guest.
*   **Revenue Analytics**:
    *   **Revenue Chart**: Hourly or Daily trend analysis of sales.
    *   **Order Type Split**: Visual comparison of Dine-In, Takeaway, and Delivery revenue.
*   **Operational Monitoring**:
    *   **Connectivity Heartbeat**: Real-time status of POS devices and Aggregator (Zomato/Swiggy) sync.
    *   **Top 5 Items**: Best-selling items by quantity and revenue contribution.

---

## 2. 🛵 Daily Operations Module
Core tools for managing live restaurant data.

### 📂 Sub-Modules & Features:
*   **Running Orders**: 
    *   **Live Tracking**: Real-time view of active orders.
    *   **Status Management**: Move orders between `Placed`, `Preparing`, and `Served`.
*   **All Orders**: 
    *   **Historical Archive**: Searchable database of all past orders.
    *   **Collapsible Search**: Filter by Date Range, Order ID, Customer Name/Phone, and Order Status.
    *   **Data Export**: Download order data into Excel for external auditing.
    *   **Action Menu**: Bill Re-printing, Order Cancellation, and Payment Mode changes.
*   **Online Orders**: 
    *   **Aggregator Hub**: Centralized view for Zomato, Swiggy, and ONDC orders.
    *   **Source Logic**: Breakdown of revenue by specific online platform.
*   **KOT (Kitchen Order Ticket)**: 
    *   **Preparation Tracking**: Monitor which items are in queue.
    *   **Printer Management**: Check connectivity and re-print KOTs for missed tickets.
*   **Due Payment Settlement**: 
    *   **Credit Management**: Track orders with unpaid balances (Credit/Unpaid).
    *   **Settlement Actions**: Mark orders as paid upon receiving cash/UPI at a later date.

---

## 3. 🍴 Menu Management Module
The engine for product configuration and pricing.

### 📂 Sub-Modules & Features:
*   **Menu & Discounts**:
    *   **Items**: Create products with Image, Price, Description, and Veg/Non-Veg markers.
    *   **Categories**: Organise items into sections (Starters, Drinks, etc.).
    *   **Variations**: Manage multiple sizes (Regular/Large) or types for a single product.
    *   **Add-ons**: Configure modifiers (Extra Cheese, Dips) with selection rules.
    *   **Availability**: Instant toggle to enable/disable items globally or for specific platforms (e.g. Offline on Swiggy, Online on POS).
*   **Tables & Areas**:
    *   **Floor Layout**: Define Floor levels (Ground, Rooftop) and Table arrangements.
    *   **QR Connectivity**: Link digital menus to specific table IDs.
*   **Special Notes**:
    *   **Instructions**: Pre-define kitchen notes like "Sugar-free," "Extra Spicy," or "No Onion."

---

## 4. 📦 Inventory Management Module
Back-end control for supply chain and ingredient tracking.

### 📂 Sub-Modules & Features:
*   **Inventory Master**: 
    *   **Material Registry**: List all raw ingredients with Unit (Kg, Ltr, Pcs) and Cost Price.
    *   **Stock Alerts**: Set threshold levels for low-stock notifications.
*   **Purchase Entry**: 
    *   **Supplier Management**: Track purchases from different vendors.
    *   **Invoice Entry**: Record grand totals, taxes, and discounts for stock purchases.
    *   **Auto-Stock Update**: Automatically increments current stock upon saving a purchase.
*   **Stock Status**: 
    *   **Real-time Levels**: Current quantity of ingredients on hand.
    *   **Valuation**: Total monetary value of current held stock.

---

## 5. 🤝 CRM & Marketing Module
Customer engagement and retention tools.

### 📂 Sub-Modules & Features:
*   **Customers**: 
    *   **Profiles**: Detailed visit history, total spend, and favorite items.
*   **Loyalty & Rewards**: 
    *   **Point Configuration**: Define X points for every Y rupees spent.
    *   **Redemption Rules**: Set minimum points required for discounts.
*   **Promo Engine**:
    *   **Coupons**: Create unique codes with expiration and minimum order value rules.
    *   **Gift Cards**: Issue store credits or prepaid cards to customers.
*   **Feedback System**: 
    *   **Quality Control**: Collect guest ratings (Food, Service, Ambiance) linked to order IDs.

---

## 6. 💰 Financials & Accounting Module
Comprehensive cash flow and expense management.

### 📂 Sub-Modules & Features:
*   **Expenses**: 
    *   **Daily Outflow**: Record petty cash, rent, utilities, and daily payouts.
    *   **Category breakdown**: View expenses by type (Raw Material vs. Salary vs. Utilities).
*   **Denomination Tracker**: 
    *   **Cash Reconciliation**: Count physical currency notes at day-end to match POS calculations.
*   **GST & Taxation**: 
    *   **Tax Reports**: Extract periodic data for GST filings.
    *   **Slab Management**: Configure CGST/SGST/IGST percentages.

---

## 7. ⚙️ Management & System Configuration
Admin-level controls and hardware connectivity.

### 📂 Sub-Modules & Features:
*   **Outlet Configuration**:
    *   **Branding**: Update Outlet Name, Logo, and Address.
    *   **Timings**: Set operational hours and break timings.
    *   **Invoice Sequence**: Customize bill numbering patterns (e.g. INV-2024-001).
*   **System Roles & Permissions**:
    *   **RBAC (Role-Based Access Control)**: Create roles (Kitchen Staff, Cashier, Manager).
    *   **Granular Control**: Set specific Read/Write permissions for every single sub-module.
*   **User Management**: 
    *   **Staff Registry**: Manage individual logins, passwords, and profile data.
*   **POS Device Hub**:
    *   **Device Health**: Monitor which terminals are Online/Offline.
    *   **Version Control**: See the software version on every terminal to ensure consistency.
*   **Audit Logs**: 
    *   **Activity Timeline**: See who cancelled an order or changed a menu price with timestamps.

---
*Document Version: 1.1 | Date: January 6, 2026*
