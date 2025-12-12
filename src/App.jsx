import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MenuManagement } from './components/MenuManagement';
import { UserManagement } from './components/UserManagement';
import { AllOrders } from './components/orders/AllOrders';
import { Settings } from './components/Settings';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import RawMaterialsList from './components/inventory/RawMaterialsList';
import AddRawMaterial from './components/inventory/AddRawMaterial';
import RecipeList from './components/inventory/RecipeList';
import AddRecipe from './components/inventory/AddRecipe';
// import { RawMaterials } from './components/inventory/RawMaterials'; // Removed
// import { Recipes } from './components/inventory/Recipes'; // Removed
import { Preferences } from './components/inventory/Preferences';
import { PurchaseEntry } from './components/inventory/PurchaseEntry';
import { PurchaseOrder } from './components/inventory/PurchaseOrder';
import { PurchaseReturn } from './components/inventory/PurchaseReturn';
import { StockTransfer } from './components/inventory/StockTransfer';
import { Wastage } from './components/inventory/Wastage';
import { StockStatus } from './components/inventory/Placeholders'; // Keeping as placeholder if not implemented yet
import { OnlineOrders } from './components/orders/OnlineOrders';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Kept for sidebar compatibility mostly, or we remove it
  const location = useLocation();

  const getTitle = (pathname) => {
    if (pathname === '/') return 'Overview';
    if (pathname === '/menu') return 'Menu Management';
    if (pathname === '/orders') return 'Orders';
    return pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
      {/* Background Gradients/Mesh */}
      {/* Background Gradients/Mesh - Removed for cleaner white look as requested */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/40 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-secondary-100/40 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-auto px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Login />; // Or navigate to login
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
        <Route path="/orders/running" element={<div className="flex items-center justify-center h-full text-xl font-bold text-gray-400">Running Orders Module</div>} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
        {/* Fallback for "Under Development" pages caught by sidebar links */}
        <Route path="*" element={<div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4"><div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-2xl">🚧</div><p>Module Under Development</p></div>} />
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
        <Route path="stock/closing" element={<StockStatus />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
