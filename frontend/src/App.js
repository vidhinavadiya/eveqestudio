import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { CartProvider } from './context/CartContext';

import SplashScreen from './components/SplashScreen';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import UsersPage from './pages/admin/user/UsersPage';
import Categories from './pages/admin/category/Categories';
import AdminSubcategories from './pages/admin/subcategory/subcategories';
import Subcategories from './pages/subcategory/Subcategories';
import AdminProducts from './pages/admin/product/Products';
import Coupons from './pages/admin/coupons/Coupons';
import BXGYCoupons from './pages/admin/bxgy/BXGYCoupons';
import Orders from './pages/admin/order/order';
import Review from './pages/admin/review/Review';
import Faqs from './pages/admin/faq/Faqs';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import CategorySubcategories from './pages/CategorySubcategories';
import Cart from './pages/Cart';
import AllProducts from './pages/AllProducts';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';

  function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem('isLoggedIn') === 'true'
    );
    const [userRole, setUserRole] = useState(
      localStorage.getItem('userRole') || 'guest'
    );
    const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

    // Splash timer
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

    // Login success handler
    const handleLoginSuccess = (role) => {
      setIsLoggedIn(true);
      setUserRole(role);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role);
    };

    // Logout handler
    const handleLogout = useCallback(() => {
      setIsLoggedIn(false);
      setUserRole('guest');
      localStorage.clear();
    }, []);

    if (showSplash) {
      return <SplashScreen />;
    }

  return (
    <CartProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/auth" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? '/admin' : userRole === 'seller' ? '/seller' : '/'} replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/auth" replace />} />
        <Route path="/about" element={<AboutUs isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/contact" element={<ContactUs isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/" replace />} />
        <Route path="/admin/users" element={isLoggedIn && userRole === 'admin' ? <UsersPage onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        <Route path="/admin/categories" element={isLoggedIn && userRole === 'admin' ? <Categories onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/" replace />} />
        <Route path="/admin/subcategories" element={isLoggedIn && userRole === 'admin' ? <AdminSubcategories onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        <Route path="/admin/products" element={ isLoggedIn && userRole === 'admin' ? <AdminProducts onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace /> }/>
        <Route path="/admin/coupons" element={ isLoggedIn && userRole === 'admin' ? <Coupons onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        <Route path="/admin/bxgy" element={ isLoggedIn && userRole === 'admin' ? <BXGYCoupons onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        <Route path="/admin/orders" element={ isLoggedIn && userRole === 'admin' ? <Orders onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace /> } />        
        <Route path="/admin/reviews" element={isLoggedIn && userRole === 'admin' ? <Review onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        <Route path="/admin/faqs" element={isLoggedIn && userRole === 'admin' ? <Faqs onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />
        {/* Seller Routes */}
        <Route path="/seller" element={isLoggedIn && userRole === 'seller' ? <SellerDashboard onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/> : <Navigate to="/" replace />} />

        {/* Public Category/Subcategory */}
        <Route path="/category/:categorySlug/:subSlug" element={<Subcategories onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        
        {/* 404 / Catch-all */}
        <Route path="/product/:id" element={<ProductDetail isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/search" element={<Search isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>} />
        <Route path="/category/:categorySlug" element={<CategorySubcategories isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>} />
        <Route path="/cart" element={isLoggedIn ? (<Cart isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />) : (<Navigate to="/auth" replace />)} />
        <Route path="/all-products" element={<AllProducts isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/checkout" element={<CheckoutPage isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/my-orders" element={isLoggedIn ? <MyOrders isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/auth" replace />} />        <Route path="/product/:id" element={<ProductDetail isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;