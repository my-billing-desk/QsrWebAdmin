import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MenuManagement } from './components/MenuManagement';
import { UserManagement } from './components/UserManagement';
import { RoleManagement } from './components/RoleManagement';
import { AllOrders } from './components/orders/AllOrders';
import { KOT } from './components/orders/KOT';
import { Settings } from './components/Settings';
import { QuickLinksProvider } from './context/QuickLinksContext';
import { QuickLinksPage } from './components/QuickLinksPage';
import AggregatorCenter from './components/AggregatorCenter';
import Marketplace from './components/Marketplace';
import ConsumerMenu from './components/ConsumerMenu';
import AggregatorConfig from './components/AggregatorConfig';
import { ThemeProvider } from './context/ThemeContext';

// Inventory Imports (moved from misplaced section)
// Inventory Imports
import AddRawMaterial from './components/inventory/AddRawMaterial';
import RawMaterialsList from './components/inventory/RawMaterialsList';
import RecipeList from './components/inventory/RecipeList';
import AddRecipe from './components/inventory/AddRecipe';
import { Preferences } from './components/inventory/Preferences';
import { PurchaseEntry } from './components/inventory/PurchaseEntry';
import { PurchaseOrder } from './components/inventory/PurchaseOrder';
import { PurchaseReturn } from './components/inventory/PurchaseReturn';
import { StockTransfer } from './components/inventory/StockTransfer';
import { Wastage } from './components/inventory/Wastage';
import { ProductionEntry } from './components/inventory/Placeholders';
import { AvailableStock } from './components/inventory/AvailableStock';
import { ClosingStock } from './components/inventory/ClosingStock';
import { OpeningStock } from './components/inventory/OpeningStock';
import { Indent } from './components/inventory/Indent';
import { StockSummary } from './components/inventory/StockSummary';
import { OnlineOrders } from './components/orders/OnlineOrders';
import { RunningOrders } from './components/orders/RunningOrders';
import { InventoryLayout } from './components/inventory/InventoryLayout';
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { InventorySettings } from './components/inventory/InventorySettings';
import { InventoryReports } from './components/inventory/InventoryReports';

// ... (Auth imports in replaced block if overlapped, but tool says StartLine/EndLine. I will target the imports block and the routes block separately or be careful.)
// Actually the tool supports chunks. I will do this in one go if I can match safely.
// The imports are around line 18. The routes around line 216.
// I will use multi_replace for safety.

// Auth and Placeholder Imports (identified as missing from top)
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlaceholderPage } from './components/PlaceholderPage';
import { GiftCard } from './components/crm/GiftCard';
import { VirtualWallet } from './components/accounting/VirtualWallet';
import { SubOrderType } from './components/configuration/SubOrderType';
import { DeliveryDistance } from './components/configuration/DeliveryDistance';
import { AreaDeliveryCharges } from './components/configuration/AreaDeliveryCharges';
import { FloorPlan } from './components/configuration/FloorPlan';
import { EmailTemplateSettings } from './components/configuration/EmailTemplateSettings';
import { DayEndSummary } from './components/reports/DayEndSummary';
import { OutletConfiguration } from './components/configuration/OutletConfiguration';
import { ProfitLoss } from './components/reports/ProfitLoss';
import { ConfigureProfitLoss } from './components/reports/ConfigureProfitLoss';
import { MenuOnOff } from './components/menu/MenuOnOff';
import { SpecialNote } from './components/menu/SpecialNote';
import { MarketplaceSetting } from './components/configuration/MarketplaceSetting';
import { ThemeConfiguration } from './components/configuration/ThemeConfiguration';
import { SubscriptionPlans } from './components/configuration/SubscriptionPlans';
import { ActivityTimeline } from './components/user-logs/ActivityTimeline';

import { Coupons } from './components/promo/Coupons';
import { GiftCards } from './components/promo/GiftCards';
import { DiscountPlan } from './components/promo/DiscountPlan';
import { Discount } from './components/promo/Discount';
import { Expenses } from './components/financial/Expenses';
import { ExpenseCategory } from './components/financial/ExpenseCategory';
import { StockHistory } from './components/reports/StockHistory';
import { Toaster } from 'react-hot-toast';


function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open
  const location = useLocation();

  const getTitle = (pathname) => {
    if (pathname === '/') return 'Overview';
    if (pathname === '/menu') return 'Menu Management';
    if (pathname === '/orders') return 'Orders';
    // Handle specific inventory routes for titles if needed, otherwise default
    if (pathname.startsWith('/inventory/')) {
      const subPath = pathname.split('/').pop();
      return subPath.charAt(0).toUpperCase() + subPath.slice(1).replace(/-/g, ' ');
    }
    return pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-main-app font-sans overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-300">
        <Header title={getTitle(location.pathname)} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto px-4 pb-4">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Login />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  if (!user) return <Login />;

  return (
    <Routes>
      {/* Main App Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/orders/online" element={<OnlineOrders />} />
        <Route path="/orders/kot" element={<KOT />} />
        <Route path="/orders/due-payment" element={<PlaceholderPage title="Due Payment Settlement" />} />
        <Route path="/orders/running" element={<RunningOrders />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/settings" element={<Settings />} />

        {/* New Modules */}
        <Route path="/reports/profit-loss" element={<ProfitLoss />} />
        <Route path="/reports/profit-loss/configure" element={<ConfigureProfitLoss />} />
        <Route path="/aggregator-center" element={<AggregatorCenter />} />

        {/* Menu */}
        <Route path="/menu/on-off" element={<MenuOnOff />} />
        <Route path="/menu/special-note" element={<SpecialNote />} />

        {/* Reports */}

        <Route path="/reports/day-end" element={<DayEndSummary />} />
        <Route path="/reports/other" element={<PlaceholderPage title="Other Reports" />} />
        <Route path="/reports/delivery" element={<PlaceholderPage title="Delivery Management" />} />



        {/* Promo */}
        <Route path="/promo/coupons" element={<Coupons />} />
        <Route path="/promo/gift-cards" element={<GiftCards />} />
        <Route path="/promo/discount-plan" element={<DiscountPlan />} />
        <Route path="/promo/discount" element={<Discount />} />

        {/* Financial */}
        <Route path="/financial/expenses" element={<Expenses />} />
        <Route path="/financial/expense-category" element={<ExpenseCategory />} />


        {/* Reports */}
        <Route path="/reports/stock-history" element={<StockHistory />} />
        <Route path="/reports/profit-loss" element={<ProfitLoss />} />

        {/* Config */}
        <Route path="/config/outlet" element={<OutletConfiguration />} />
        <Route path="/config/theme" element={<ThemeConfiguration />} />
        <Route path="/config/sub-order" element={<SubOrderType />} />
        <Route path="/config/delivery" element={<DeliveryDistance />} />
        <Route path="/config/area-delivery" element={<AreaDeliveryCharges />} />
        <Route path="/config/marketplace" element={<MarketplaceSetting />} />
        <Route path="/config/floor-plan" element={<FloorPlan />} />
        <Route path="/config/email-template" element={<EmailTemplateSettings />} />
        <Route path="/config/subscription" element={<SubscriptionPlans />} />
        <Route path="/logs/timeline" element={<ActivityTimeline />} />


        {/* Accounting */}
        <Route path="/accounting/payments" element={<PlaceholderPage title="Payment Information" />} />
        <Route path="/accounting/virtual-wallet" element={<VirtualWallet />} />
        <Route path="/accounting/reconciliation" element={<PlaceholderPage title="Online Order Reconciliation" />} />
        <Route path="/accounting/gst" element={<PlaceholderPage title="GST Information" />} />
        <Route path="/accounting/bank" element={<PlaceholderPage title="Bank Details" />} />
        <Route path="/accounting/kyc" element={<PlaceholderPage title="KYC Details" />} />
        <Route path="/accounting/utility" element={<PlaceholderPage title="Utility Bills" />} />
        <Route path="/accounting/expense" element={<PlaceholderPage title="Expense & Withdrawal" />} />
        <Route path="/accounting/service-history" element={<PlaceholderPage title="Service Payment History" />} />
        <Route path="/accounting/agreement" element={<PlaceholderPage title="Agreement Info" />} />
        <Route path="/accounting/loan" element={<PlaceholderPage title="Loan Information" />} />
        <Route path="/accounting/denomination" element={<PlaceholderPage title="Denomination" />} />

        {/* User Management */}
        <Route path="/users/biller" element={<PlaceholderPage title="Biller App" />} />
        <Route path="/users/biller-group" element={<PlaceholderPage title="Biller Group Management" />} />
        <Route path="/users/admin-group" element={<PlaceholderPage title="Admin Group Management" />} />
        <Route path="/users/admin" element={<PlaceholderPage title="Admin Management" />} />

        {/* User Logs */}
        <Route path="/logs/store" element={<PlaceholderPage title="Online Store Logs" />} />
        <Route path="/logs/item-on-off" element={<PlaceholderPage title="Online Item On/Off Logs" />} />
        <Route path="/logs/auto-accept" element={<PlaceholderPage title="Auto Accept Change Logs" />} />
        <Route path="/logs/support" element={<PlaceholderPage title="Support Management" />} />
        <Route path="/logs/notifications" element={<PlaceholderPage title="Notification" />} />
        <Route path="/logs/menu-trigger" element={<PlaceholderPage title="Menu Trigger Logs" />} />
        <Route path="/logs/closing-hour" element={<PlaceholderPage title="Closing Hour Logs" />} />

        {/* Others */}
        <Route path="/apps/other" element={<PlaceholderPage title="Other APPs" />} />
        <Route path="/finance" element={<PlaceholderPage title="Finance" />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/config/:slug" element={<AggregatorConfig />} />

        {/* CRM */}
        <Route path="/crm/marketing" element={<PlaceholderPage title="Marketing" />} />
        <Route path="/crm/campaign" element={<PlaceholderPage title="Campaign" />} />
        <Route path="/crm/reputation" element={<PlaceholderPage title="Reputation" />} />
        <Route path="/crm/beta" element={<PlaceholderPage title="Beta" />} />
        <Route path="/crm/automation" element={<PlaceholderPage title="Marketing Automation" />} />
        <Route path="/crm/customers" element={<PlaceholderPage title="Customers" />} />
        <Route path="/crm/feedback" element={<PlaceholderPage title="Feedback" />} />
        <Route path="/crm/gift-card" element={<GiftCard />} />
        <Route path="/crm/loyalty" element={<PlaceholderPage title="Loyalty" />} />
        <Route path="/crm/dual-screen" element={<PlaceholderPage title="Dual Screen Marketing" />} />
        <Route path="/crm/ebill" element={<PlaceholderPage title="Ebill Templates" />} />

        {/* Fallback for "Under Development" pages caught by sidebar links */}
        <Route path="*" element={<div className="flex items-center justify-center h-full text-muted flex-col gap-4"><div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-2xl border" style={{ borderColor: 'var(--border-color)' }}>🚧</div><p>Module Under Development</p></div>} />
      </Route>

      {/* Inventory Routes - Separate Layout */}
      <Route path="/inventory" element={<InventoryLayout />}>
        <Route index element={<Navigate to="/inventory/dashboard" replace />} />
        <Route path="dashboard" element={<InventoryDashboard />} />

        {/* Raw Materials Routes */}
        <Route path="raw-materials" element={<RawMaterialsList />} />
        <Route path="raw-materials/add" element={<AddRawMaterial />} />
        <Route path="raw-materials/edit/:id" element={<AddRawMaterial />} />

        {/* Recipe Routes */}
        <Route path="recipes" element={<RecipeList />} />
        <Route path="recipes/add" element={<AddRecipe />} />
        <Route path="recipes/edit/:id" element={<AddRecipe />} />

        <Route path="preferences" element={<Preferences />} />
        <Route path="purchase" element={<PurchaseEntry />} />
        <Route path="purchase-order" element={<PurchaseOrder />} />
        <Route path="purchase-return" element={<PurchaseReturn />} />
        <Route path="transfer" element={<StockTransfer />} />
        <Route path="wastage" element={<Wastage />} />
        <Route path="production" element={<ProductionEntry />} />
        <Route path="stock/available" element={<AvailableStock />} />
        <Route path="stock/closing" element={<ClosingStock />} />
        <Route path="stock/opening" element={<OpeningStock />} />
        <Route path="indent" element={<Indent />} />
        <Route path="reports" element={<InventoryReports />} />
        <Route path="reports/stock-history" element={<StockHistory />} />
        <Route path="consumption-summary" element={<StockSummary />} />
        <Route path="settings" element={<InventorySettings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <QuickLinksProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/scan-order" element={<ConsumerMenu />} />
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
          </QuickLinksProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
