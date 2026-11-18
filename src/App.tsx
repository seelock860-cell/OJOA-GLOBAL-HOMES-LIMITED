import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { PublicLayout } from './components/PublicLayout';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Administrator Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="properties/new" element={<AdminPropertyFormPage />} />
          <Route path="properties/edit/:id" element={<AdminPropertyFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="content" element={<AdminContentPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

