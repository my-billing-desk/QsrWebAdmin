import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper functions for Menu
export const menuService = {
    getCategories: () => api.get('/menu/categories'),
    createCategory: (data) => api.post('/menu/categories', data),
    deleteCategory: (id) => api.delete(`/menu/categories/${id}`),

    getItems: () => api.get('/menu/items'),
    createItem: (data) => api.post('/menu/items', data),
    updateItem: (id, data) => api.put(`/menu/items/${id}`, data),
    deleteItem: (id) => api.delete(`/menu/items/${id}`),
    updateStatus: (id, data) => api.patch(`/menu/items/${id}/status`, data),
    updateBulkStatus: (data) => api.post('/menu/items/bulk-status', data),
    importFullMenu: (data) => api.post('/menu/items/import-full', data),
    exportFullMenu: () => api.get('/menu/items/export'),
    reorder: (type, updates) => api.post('/menu/reorder', { type, updates }),

    getVariants: () => api.get('/menu/variants'),
    createVariant: (data) => api.post('/menu/variants', data),
    deleteVariant: (id) => api.delete(`/menu/variants/${id}`),

    getAddons: () => api.get('/menu/addons'),
    createAddon: (data) => api.post('/menu/addons', data),
    deleteAddon: (id) => api.delete(`/menu/addons/${id}`),
};

export const configService = {
    getTables: () => api.get('/config/tables'),
    createTable: (data) => api.post('/config/tables', data),
    deleteTable: (id) => api.delete(`/config/tables/${id}`),

    getTaxes: () => api.get('/config/taxes'),
    createTax: (data) => api.post('/config/taxes', data),
    deleteTax: (id) => api.delete(`/config/taxes/${id}`),

    getDiscounts: () => api.get('/config/discounts'),
    createDiscount: (data) => api.post('/config/discounts', data),
    deleteDiscount: (id) => api.delete(`/config/discounts/${id}`),
};

export const userService = {
    getUsers: () => api.get('/auth/users'),
    register: (data) => api.post('/auth/register', data),
};

export const aggregatorService = {
    getAll: () => api.get('/aggregators'),
    toggle: (id) => api.post(`/aggregators/${id}/toggle`)
};

export const specialNoteService = {
    getAll: () => api.get('/special-notes'),
    create: (data) => api.post('/special-notes', data),
    update: (id, data) => api.put(`/special-notes/${id}`, data),
    delete: (id) => api.delete(`/special-notes/${id}`),
    toggleStatus: (id) => api.patch(`/special-notes/${id}/toggle`),
};

export const dashboardService = {
    getStats: (params) => api.get('/dashboard/stats', { params }),
    getCharts: (params) => api.get('/dashboard/charts', { params }),
    getRecentOrders: () => api.get('/dashboard/recent-orders'),
    getTopItems: () => api.get('/dashboard/top-items'),
    clearData: () => api.post('/dashboard/clear-data'),
};

export const orderService = {
    getAll: (params) => api.get('/orders', { params }),
    create: (data) => api.post('/orders', data),
    update: (id, data) => api.put(`/orders/${id}`, data),
};

export const groupService = {
    getAddonGroups: () => api.get('/groups/addon-groups'),
    createAddonGroup: (data) => api.post('/groups/addon-groups', data),
    deleteAddonGroup: (id) => api.delete(`/groups/addon-groups/${id}`),

    // Variation Groups
    getVariationGroups: () => api.get('/groups/variation-groups'),
    createVariationGroup: (data) => api.post('/groups/variation-groups', data),
    updateVariationGroup: (id, data) => api.put(`/groups/variation-groups/${id}`, data),
    deleteVariationGroup: (id) => api.delete(`/groups/variation-groups/${id}`),
    assignGroups: (data) => api.post('/groups/assign-groups', data),
};

export const inventoryService = {
    getRawMaterials: () => api.get('/inventory/materials'),
    createRawMaterial: (data) => api.post('/inventory/materials', data),
    updateRawMaterial: (id, data) => api.put(`/inventory/materials/${id}`, data),
    deleteRawMaterial: (id) => api.delete(`/inventory/materials/${id}`),

    getRecipes: () => api.get('/inventory/recipes'),
    getRecipe: (params) => api.get('/inventory/recipe', { params }), // { itemId, variantId }
    saveRecipe: (data) => api.post('/inventory/recipes', data),

    // Procurement
    getSuppliers: () => api.get('/inventory/suppliers'),
    createSupplier: (data) => api.post('/inventory/suppliers', data),

    getPurchases: () => api.get('/inventory/purchases'),
    createPurchase: (data) => api.post('/inventory/purchases', data),

    getPurchaseOrders: () => api.get('/inventory/orders'),
    createPurchaseOrder: (data) => api.post('/inventory/orders', data),

    getPurchaseReturns: () => api.get('/inventory/returns'),
    createPurchaseReturn: (data) => api.post('/inventory/returns', data),

    // Wastage
    getWastages: () => api.get('/inventory/wastage'),
    createWastage: (data) => api.post('/inventory/wastage', data),

    getStats: () => api.get('/inventory/stats'),
    updateClosingStock: (data) => api.post('/inventory/closing-stock', data),
    getClosingStockReport: () => api.get('/inventory/reports/closing-stock'),
    getStockSummaryReport: (params) => api.get('/inventory/reports/stock-summary', { params }), // New
    getOrderWiseConsumptionReport: (params) => api.get('/inventory/reports/order-consumption', { params }), // New
    getConsumptionSummaryReport: (params) => api.get('/inventory/reports/consumption-summary', { params }), // New
};

export const settingsService = {
    getSettings: () => api.get('/settings'), // Alias for consistency
    getAll: () => api.get('/settings'),
    update: (data) => api.post('/settings', data),
};
export const settingService = settingsService;

export default api;
