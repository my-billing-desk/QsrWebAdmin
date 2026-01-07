# SmartQSR: Complete Administrative Implementation Guide

This document provides an exhaustive, feature-by-feature breakdown of the SmartQSR Admin Panel. It is designed to be the definitive reference for every module, sub-module, and child component implemented in the system.

---

## 🟢 1. Dashboard Module
The primary intelligence interface for the platform, providing high-level business visibility.

### 📊 Dashboard Home
*   **Top-Line Metrics (Key Performance Indicators)**:
    *   **Net Revenue (Total Income)**: Real-time calculation of all non-cancelled orders.
    *   **Order Volume**: Total count of transactions processed within the selected timeframe.
    *   **Guest Count (Total Customers)**: Tracking unique customer visits via mobile number identification.
    *   **Average Transaction Value (ATV)**: Calculated as Total Income / Total Customers.
*   **Revenue Channel Distribution**:
    *   Dynamic totalization and count for **Dine-In**, **Take Away**, and **Delivery** orders.
    *   **Online Aggregator Breakdown**: Specific revenue tracking for platforms like Zomato, Swiggy, and ONDC, showing order counts and net sales per platform.
*   **Time-Series Revenue Analysis**:
    *   **Hourly Peak Analysis**: A 6-slot daily chart (02am-06am, 06am-10am, etc.) mapping revenue to time of day to identify rush hours.
    *   **Daily Trends**: Multi-day revenue mapping for identifying weekly patterns.
*   **System Health & Synchronization**:
    *   **POS Heartbeat**: Displays "Time Since Last Sync" for the physical billing terminals.
    *   **Online Sync Status**: Real-time monitoring of connectivity to third-party delivery platforms.
*   **Product Performance**:
    *   **Top 5 Best Sellers**: Ranking items by both quantity sold and total revenue contribution.

---

## 🔵 2. Daily Operations Module
Handles the lifecycle of orders and active floor management.

### 📦 Sub-Module: All Orders
*   **Comprehensive Order Archive**: Access to every order ever placed on the platform.
*   **Collapsible Power-Search**:
    *   **Search Filters**: Order ID, Customer Name, Phone Number.
    *   **Categorization**: Filter by Order Type (Dine-In/Takeaway), Payment Type (Cash/Card/UPI), and Status.
    *   **Date Range**: Granular selection across Start and End dates/times.
*   **Operational Actions**:
    *   **Bill Management**: Re-print final bills, generate duplicate invoices.
    *   **Order Audit**: View full order details including items, taxes, and applied discounts.
    *   **Cancellation**: Authorized cancellation of orders with automated stock reversal (linked to Inventory).
*   **Excel Export**: One-click download of filtered order data for external accounting.

### 🏃 Sub-Module: Running Orders
*   **Live Order Tracking**: Dynamic card-based view of active orders.
*   **Workflow Stages**: Manage orders through the lifecycle: `Placed` → `Preparing` → `Served` → `Completed`.
*   **Kitchen Synchronization**: Changing status in the POS or Admin panel updates the Kitchen Display System (KDS) instantly.

### 📝 Sub-Module: KOT (Kitchen Order Ticket)
*   **Instruction Management**: Tracking of all items sent to the kitchen.
*   **KOT Re-print**: Ability to re-issue tickets to the kitchen in case of printer failure or lost slips.

### 💳 Sub-Module: Due Payment Settlement
*   **Credit/Unpaid Tracking**: Specifically manages orders where the customer has a "due" balance.
*   **Settlement Workflow**: Allows the admin to record partial or full payments received after the initial order closure.

---

## 🍴 3. Menu Management Module
The configuration engine for catalog and pricing.

### 📂 Sub-Module: Items & Categories
*   **Product Registry**: Add/Edit items with multiple attributes (Price, Tax Slab, Category, Food Type: Veg/Non-Veg/Egg).
*   **Dynamic Categories**: Nested organization of items (e.g., Beverages > Hot Drinks > Coffee).
*   **Image Management**: Upload and manage high-quality product visuals for digital menus.

### 📂 Sub-Module: Variations & Add-ons
*   **Variation Groups**: Define sizes (Small/Large) or types (Thin Crust/Hand Tossed) with unique pricing.
*   **Add-on Logic**: Linked modifier groups (e.g., Pizza allows "Extra Cheese" and "Olives" as add-ons).
*   **Selection Rules**: Configure minimum and maximum allowed selections for add-on groups.

### 📂 Sub-Module: Availability (Channel Manager)
*   **Platform-specific Toggle**: Enable/Disable items specifically for POS, Zomato, Swiggy, or ONDC independently.
*   **Bulk Availability**: Turn entire categories on/off for holiday management or stock shortage.

### 📂 Sub-Module: Tables, Floors & Taxes
*   **Floor Planning**: Visual or list-based management of Dining Areas (e.g., Ground Floor, Balcony, VIP Lounge).
*   **Table Registry**: Mapping table numbers and seating capacities.
*   **Tax Slabs**: Multi-slab GST/VAT management with configurable CGST/SGST percentages.

---

## 📦 4. Inventory Module (Comprehensive)
A massive subsystem for controlling the supply chain.

### 🛒 Sub-Module: Purchase Lifecycle
*   **Purchase Orders (PO)**: Generate formal requests to suppliers. Track pending vs. received POs.
*   **Stock Purchase (Invoice Entry)**:
    *   Direct stock increment via invoice entry.
    *   Linking items to specific Suppliers.
    *   Inputting Freight and Tax components for accurate Cost-of-Goods-Sold (COGS).
*   **Purchase Returns**: Manage returns of expired or damaged goods to suppliers with automated stock deduction.

### 🔎 Sub-Module: Manage Stock
*   **Available Stock (Live Inventory)**: Real-time tracking of every raw material (bun, patty, sauce, etc.).
*   **Opening/Closing Stock**: Daily entry system for reconciling physical stock with the digital ledger.
*   **Stock Transfer**: Move inventory between different outlets or a central warehouse.

### 👨‍🍳 Sub-Module: Production & Recipes
*   **Recipe Management (BOM)**: Link finished products to raw materials (e.g., 1 Burger = 1 Bun + 1 Patty + 20g Sauce).
*   **Auto-Consumption**: Automated deduction of raw materials from stock whenever a finished item is sold on the POS.
*   **Production Entry**: Track the manual processing of semi-finished goods (e.g., pre-making sauce batches).

### 📉 Sub-Module: Consumption & Wastage
*   **Wastage Recording**: Log damaged ingredients or expired goods with reasons (Expired, Spilt, Quality Issue).
*   **Sales Consumption**: View raw material usage based on sales history.

---

## 💰 5. Financials Module
Dedicated to managing payouts and non-sales income.

### 💸 Sub-Module: Expenses
*   **Daily Records**: Log every payout from the cash drawer or bank account.
*   **Master Sync**: Expense titles are automatically synchronized to a master table for consistent reporting.
*   **"Manage This Day" Feature**: Enhanced single-day editing flow that allows clearing and re-building a full day’s expense ledger in one step.

### 🏦 Sub-Module: Withdrawals & Cash Top-Ups
*   **Withdrawals**: Track cash taken from the cash drawer for banking or personal use.
*   **Cash Top-Up**: Log additional cash injected into the drawer (e.g., for morning "petti" or small change).
*   **Performance Tracking**: Lists show total counts and "Last Used" dates for every expense/top-up category.

---

## 🤝 6. CRM Module
Tools for guest management and marketing.

### 👤 Sub-Module: Customer Database
*   **Visit History**: Complete chronological list of orders for every customer.
*   **Spend Analysis**: Identifies "VIP" or "High-Frequency" guests based on total spend.

### 🎫 Sub-Module: Promo & Loyalty
*   **Coupon Engine**: Create discount codes with specific validity rules (Expiry, Min-Order, Discount Cap).
*   **Loyalty Points**: Assign point values to purchases. Customers can "Earn" and "Burn" points at the POS.
*   **Gift Cards**: Manage issuance, tracking, and balance for pre-paid brand cards.

### 💬 Sub-Module: Feedback
*   **Linked Feedback**: View ratings specifically linked to Order IDs for quality control.
*   **Metric Analysis**: Aggregated ratings for Food, Packaging, and Service.

---

## 📈 7. Reports Module
Final data output for business analysis.

### 📊 Sub-Module: Business Summaries
*   **Day End Summary (Z-Report)**: The final tally for the day—consolidating all Sales, Returns, Expenses, and Cash-in-Hand.
*   **Detailed Profit & Loss (P&L)**: Monthly comparison of Revenue vs. (Purchase Cost + Expenses).
*   **Tax/GST Reports**: Ready-to-file summaries of GST collected.

### 📦 Sub-Module: Inventory Analytics
*   **Stock History**: A line-by-line audit of every single stock movement for a material.
*   **Wastage Analysis**: Highlights which ingredients are costing the most due to spoilage.

---

## ⚙️ 8. Management Module
Administrative and system structural settings.

### 🛡️ Sub-Module: System Roles & User Management
*   **Role-Based Access (RBAC)**: Create roles like "Chef", "Cashier", or "Manager" with restricted access to specific modules (e.g., Chef can't see the P&L).
*   **Staff Profiles**: Secure login credentials management with session tracking.

### 🏗️ Sub-Module: Outlet Configuration
*   **Branding & Identity**: Upload logos for invoices, set contact info, and digital menu headers.
*   **Timings & Scheduling**: Set restaurant open/close hours, break times, and holiday notices.
*   **Invoice Sequence**: Customize prefix and suffix for branding on physical bills.
*   **Master Hub**: Centralized management of Categories used across the entire platform.

---
*Generated: 2026-01-06 | SmartQSR Implementation Library v2.0*
