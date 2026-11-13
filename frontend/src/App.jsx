import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickQuoteModal from './components/QuickQuoteModal';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

function MainApp() {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [adminTab, setAdminTab] = useState('dashboard');

  // Handle URL hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('admin')) {
        setCurrentView('admin');
        const parts = hash.split('/');
        if (parts[1]) setAdminTab(parts[1]);
      } else if (hash.startsWith('product/')) {
        const idOrSlug = hash.replace('product/', '');
        setCurrentView('product-detail');
        setViewParams({ slug: idOrSlug });
      } else if (hash === 'catalog') {
        setCurrentView('catalog');
      } else if (hash === 'checkout') {
        setCurrentView('checkout');
      } else if (hash.startsWith('track')) {
        setCurrentView('track-order');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch categories and featured products on start
  const refreshGlobalData = () => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch((e) => console.error('Failed to load categories', e));

    fetch('/api/products?limit=12')
      .then((r) => r.json())
      .then((data) => setFeaturedProducts(data.products || []))
      .catch((e) => console.error('Failed to load products', e));
  };

  useEffect(() => {
    refreshGlobalData();
  }, []);

  const navigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update hash
    if (view === 'admin') {
      window.location.hash = `/admin/${adminTab}`;
    } else if (view === 'product-detail' && params.slug) {
      window.location.hash = `/product/${params.slug}`;
    } else if (view === 'home') {
      window.location.hash = '/';
    } else {
      window.location.hash = `/${view}`;
    }
  };

  const handleAdminTabChange = (tabId) => {
    setAdminTab(tabId);
    window.location.hash = `/admin/${tabId}`;
  };

  // If in Admin Portal
  if (currentView === 'admin') {
    return (
      <AdminLayout
        activeTab={adminTab}
        onTabChange={handleAdminTabChange}
        onExitAdmin={() => navigate('home')}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={handleAdminTabChange} />}
        {adminTab === 'products' && <AdminProducts categories={categories} />}
        {adminTab === 'categories' && (
          <AdminCategories
            onCategoriesUpdated={(updated) => setCategories(updated)}
          />
        )}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'quotes' && <AdminQuotes />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Customer Storefront
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar
        onNavigate={navigate}
        currentView={currentView}
        categories={categories}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            categories={categories}
            products={featuredProducts}
            onNavigate={navigate}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            categories={categories}
            initialCategory={viewParams.category}
            initialSearch={viewParams.search}
            onNavigate={navigate}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={viewParams.productId}
            slug={viewParams.slug}
            onNavigate={navigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onNavigate={navigate}
            onOrderCompleted={(order) => setViewParams({ order })}
          />
        )}

        {currentView === 'order-success' && (
          <OrderSuccessPage
            order={viewParams.order}
            onNavigate={navigate}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderPage
            initialOrderNumber={viewParams.orderNumber}
            onNavigate={navigate}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global drawers & modals */}
      <CartDrawer onNavigate={navigate} />
      <QuickQuoteModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CurrencyProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
}
