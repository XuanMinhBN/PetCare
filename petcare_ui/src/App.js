import "./App.css";
import React from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Store from "./pages/Store";
import UserProfile from "./pages/UserProfile";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import PetSelection from "./pages/PetSelection";
import Packages from "./pages/Packages";
import EditProfile from "./pages/EditProfile";
import PetProfile from "./pages/EditPetProfile";
import PetDetail from "./pages/PetDetail";
import CreateDogProfile from "./pages/CreateDogProfile";
import CreateCatProfile from "./pages/CreateCatProfile";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory";
import AddAddress from "./pages/AddAddress";
import EditAddress from "./pages/EditAddress";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ServiceManagement from "./pages/admin/ServiceManagement";
import UserManagementPage from "./pages/admin/UserManagementPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffWorkPage from "./pages/staff/StaffWorkPage";
import OrderReviewPage from "./pages/staff/OrderReviewPage";
import BookingReviewPage from "./pages/staff/BookingReviewPage";
import BookingConfirmationPage from "./pages/staff/BookingConfirmationPage";
import { AppProvider } from "./context/AppContext";
import { authAPI } from "./services/api";
import AuthGuard from "./components/AuthGuard";
import { ROLES } from "./constants/roles";

function App() {
  const [screen, setScreen] = React.useState("landing");
  const [screenParams, setScreenParams] = React.useState({});
  const [navigationStack, setNavigationStack] = React.useState([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Check authentication on app load and handle URL routing
  React.useEffect(() => {
    const checkAuth = () => {
      // Kiểm tra URL để xử lý routing cho reset password với token
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const orderId = urlParams.get("orderId");

      // Nếu URL là /reset-password và có token, chuyển đến trang reset password
      if (path === "/reset-password" && token) {
        setScreen("reset-password");
        setNavigationStack(["reset-password"]);
        setIsInitialized(true);
        return;
      }

      // Nếu URL là /payment-success và có orderId, chuyển đến trang thành công thanh toán
      if (path === "/payment-success" && orderId) {
        setScreen("payment-success");
        setNavigationStack(["payment-success"]);
        setIsInitialized(true);
        return;
      }

      const isAuthenticated = authAPI.isAuthenticated();
      if (isAuthenticated) {
        setScreen("home");
        setNavigationStack(["home"]);
      }
      setIsInitialized(true);
    };

    checkAuth();
  }, []);

  const goHome = () => {
    setScreen("home");
    setNavigationStack(["home"]);
  };
  const goLogin = () => setScreen("login");
  const goRegister = () => setScreen("register");
  const goLanding = () => setScreen("landing");
  const goForgotPassword = () => setScreen("forgot-password");
  const goResetPassword = () => setScreen("reset-password");
  const goStore = () => {
    setScreen("store");
    setNavigationStack(["home", "store"]);
  };

  const navigateWithParams = (newScreen, params = {}) => {
    setNavigationStack((prev) => [...prev, newScreen]);
    setScreen(newScreen);
    setScreenParams(params);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); // Remove current screen
      const previousScreen = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setScreen(previousScreen);
      setScreenParams({});
    } else {
      // If only one screen in stack, go to home
      setScreen("home");
      setNavigationStack(["home"]);
    }
  };

  if (screen === "login")
    return (
      <Login
        goHome={goHome}
        goLanding={goLanding}
        goForgotPassword={goForgotPassword}
        goResetPassword={goResetPassword}
      />
    );
  if (screen === "register")
    return <Register goHome={goHome} goLogin={goLogin} goLanding={goLanding} />;
  if (screen === "forgot-password")
    return (
      <ForgotPassword
        goLogin={goLogin}
        goLanding={goLanding}
        goResetPassword={goResetPassword}
      />
    );
  if (screen === "reset-password")
    return (
      <ResetPassword
        goLogin={goLogin}
        goLanding={goLanding}
        goForgotPassword={goForgotPassword}
      />
    );
  if (screen === "home") {
    // Initialize navigation stack when going to home
    if (navigationStack.length === 0) {
      setNavigationStack(["home"]);
    }
    return (
      <Home current="home" onNavigate={navigateWithParams} goStore={goStore} />
    );
  }
  if (screen === "store")
    return (
      <Store current="store" onNavigate={navigateWithParams} onBack={goBack} />
    );
  if (screen === "user-profile")
    return <UserProfile onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "pet-profile")
    return (
      <PetProfile
        onNavigate={navigateWithParams}
        onBack={goBack}
        petType={screenParams.petType}
      />
    );
  if (screen === "services")
    return <Services onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "booking")
    return (
      <Booking
        onNavigate={navigateWithParams}
        onBack={goBack}
        selectedService={screenParams.selectedService}
      />
    );
  if (screen === "pet-selection")
    return <PetSelection onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "packages")
    return <Packages onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "edit-profile")
    return <EditProfile onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "edit-pet-profile")
    return (
      <PetProfile
        onNavigate={navigateWithParams}
        onBack={goBack}
        petId={screenParams.petId}
      />
    );
  if (screen === "add-pet")
    return (
      <PetProfile
        onNavigate={navigateWithParams}
        onBack={goBack}
        petId={null}
      />
    );
  if (screen === "pet-detail")
    return (
      <PetDetail
        onNavigate={navigateWithParams}
        onBack={goBack}
        petId={screenParams.petId}
      />
    );
  if (screen === "add-address")
    return <AddAddress onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "edit-address")
    return (
      <EditAddress
        onNavigate={navigateWithParams}
        onBack={goBack}
        addressId={screenParams.addressId}
      />
    );
  if (screen === "notifications")
    return <Notifications onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "create-dog-profile")
    return <CreateDogProfile onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "create-cat-profile")
    return <CreateCatProfile onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "product-detail")
    return (
      <ProductDetail
        onNavigate={navigateWithParams}
        onBack={goBack}
        productId={screenParams.productId}
      />
    );
  if (screen === "shopping-cart")
    return <ShoppingCart onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "checkout")
    return <Checkout onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "order-history")
    return <OrderHistory onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "payment-success")
    return (
      <PaymentSuccess onNavigate={navigateWithParams} onBack={goBack} />
    );
  if (screen === "booking-confirmation")
    return (
      <BookingConfirmation
        onNavigate={navigateWithParams}
        onBack={goBack}
        appointmentData={screenParams.appointmentData}
      />
    );
  if (screen === "booking-history")
    return <BookingHistory onNavigate={navigateWithParams} onBack={goBack} />;
  if (screen === "admin-dashboard")
    return (
      <AuthGuard requiredRole={ROLES.ADMIN}>
        <AdminDashboard onNavigate={navigateWithParams} />
      </AuthGuard>
    );
  if (screen === "staff-dashboard")
    return (
      <AuthGuard requiredRole={ROLES.STAFF}>
        <StaffDashboard onNavigate={navigateWithParams} />
      </AuthGuard>
    );
  if (screen === "admin-products")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <ProductManagement onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "admin-orders")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <OrderManagement onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "admin-services")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <ServiceManagement onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "admin-users")
    return (
      <AuthGuard requiredRole={ROLES.ADMIN}>
        <UserManagementPage onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "staff-work")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <StaffWorkPage onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "staff-orders")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <OrderReviewPage onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "staff-bookings")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <BookingReviewPage onNavigate={navigateWithParams} onBack={goBack} />
      </AuthGuard>
    );
  if (screen === "staff-booking-confirmation")
    return (
      <AuthGuard requiredRole={[ROLES.ADMIN, ROLES.STAFF]}>
        <BookingConfirmationPage
          onNavigate={navigateWithParams}
          onBack={goBack}
        />
      </AuthGuard>
    );

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <Landing goLogin={goLogin} goRegister={goRegister} />;
}

function AppWrapper() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

export default AppWrapper;
