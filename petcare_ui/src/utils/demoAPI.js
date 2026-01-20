// Demo API calls để test các chức năng
import { authAPI, storeAPI, servicesAPI, petAPI } from "../services/api";

// Demo data
const demoUser = {
  fullName: "Nguyễn Văn A",
  email: "demo@example.com",
  password: "123456",
};

const demoAdminUser = {
  fullName: "Admin User",
  email: "admin@example.com",
  password: "123456",
  role: "admin",
};

const demoProduct = {
  id: 1,
  name: "Thức ăn hạt cho mèo Whiskas",
  price: 250000,
  category: "food",
  img: "https://via.placeholder.com/200x200?text=Whiskas",
};

const demoService = {
  id: 1,
  name: "Tư vấn chuyên gia",
  description: "Tư vấn dinh dưỡng và chăm sóc",
  price: 200000,
  type: "per_session",
};

// Demo functions
export const demoAPI = {
  // Test authentication
  testAuth: async () => {
    console.log("=== Testing Authentication ===");

    // Test register
    console.log("1. Testing Register...");
    const registerResult = await authAPI.register(demoUser);
    console.log("Register result:", registerResult);

    // Test login
    console.log("2. Testing Login...");
    const loginResult = await authAPI.login({
      email: demoUser.email,
      password: demoUser.password,
    });
    console.log("Login result:", loginResult);

    // Check authentication status
    console.log("3. Checking auth status...");
    const isAuth = authAPI.isAuthenticated();
    const currentUser = authAPI.getCurrentUser();
    console.log("Is authenticated:", isAuth);
    console.log("Current user:", currentUser);
  },

  // Test store API
  testStore: async () => {
    console.log("=== Testing Store API ===");

    // Test get products
    console.log("1. Testing get products...");
    const productsResult = await storeAPI.getProducts("food", "", 1, 10);
    console.log("Products result:", productsResult);

    // Test add to cart
    console.log("2. Testing add to cart...");
    const addToCartResult = await storeAPI.addToCart(1, 2);
    console.log("Add to cart result:", addToCartResult);

    // Test get cart
    console.log("3. Testing get cart...");
    const cartResult = await storeAPI.getCart();
    console.log("Cart result:", cartResult);
  },

  // Test services API
  testServices: async () => {
    console.log("=== Testing Services API ===");

    // Test get services
    console.log("1. Testing get services...");
    const servicesResult = await servicesAPI.getServices();
    console.log("Services result:", servicesResult);

    // Test book service
    console.log("2. Testing book service...");
    const bookResult = await servicesAPI.bookService({
      serviceId: 1,
      serviceName: "Tư vấn chuyên gia",
      price: 200000,
      bookingDate: new Date().toISOString(),
      notes: "Demo booking",
    });
    console.log("Book service result:", bookResult);
  },

  // Test pet API
  testPets: async () => {
    console.log("=== Testing Pet API ===");

    // Test get pets
    console.log("1. Testing get pets...");
    const petsResult = await petAPI.getPets();
    console.log("Pets result:", petsResult);

    // Test create pet
    console.log("2. Testing create pet...");
    const createPetResult = await petAPI.createPet({
      name: "Mèo con",
      type: "cat",
      breed: "Mèo ta",
      age: 2,
      weight: 3.5,
      gender: "male",
    });
    console.log("Create pet result:", createPetResult);
  },

  // Test all APIs
  testAll: async () => {
    try {
      await demoAPI.testAuth();
      await demoAPI.testStore();
      await demoAPI.testServices();
      await demoAPI.testPets();

      console.log("=== All API tests completed ===");
    } catch (error) {
      console.error("API test error:", error);
    }
  },

  // Test logout
  testLogout: () => {
    console.log("=== Testing Logout ===");
    authAPI.logout();
    console.log("Logged out successfully");
  },

  // Clear localStorage and reset authentication
  clearAuthData: () => {
    console.log("=== Clearing Authentication Data ===");
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      console.log("Authentication data cleared successfully");
      console.log("Please refresh the page to see changes");
    } catch (error) {
      console.error("Error clearing authentication data:", error);
    }
  },

  // Quick admin login for testing admin pages
  quickAdminLogin: () => {
    console.log("=== Quick Admin Login ===");
    try {
      const mockAdminUser = {
        id: 1,
        fullName: "Admin User",
        email: "admin@example.com",
        role: "admin",
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      const mockToken = "mock-admin-token-" + Date.now();

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockAdminUser));

      console.log("Quick admin login successful!");
      console.log("You can now access admin pages");
      console.log("Refresh the page to see changes");

      return { success: true, user: mockAdminUser };
    } catch (error) {
      console.error("Error in quick admin login:", error);
      return { success: false, error };
    }
  },

  // Test navigation to admin pages
  testAdminNavigation: () => {
    console.log("=== Testing Admin Navigation ===");
    console.log("Current URL:", window.location.href);
    console.log("Current pathname:", window.location.pathname);
    console.log("Current hash:", window.location.hash);
    console.log("Current search:", window.location.search);

    // Try to trigger admin navigation
    const event = new CustomEvent("admin-navigate", {
      detail: { screen: "admin-products" },
    });
    window.dispatchEvent(event);

    console.log("Dispatched admin navigation event");
    console.log("Check console for navigation logs");
  },

  // Test services API
  testServicesAPI: async () => {
    console.log("=== Testing Services API ===");
    try {
      const result = await window.demoAPI.servicesAPI.getServices();
      console.log("Services API result:", result);

      if (result.success) {
        console.log("Services data:", result.data);
        console.log(
          "Number of services:",
          Array.isArray(result.data)
            ? result.data.length
            : result.data.services?.length || 0
        );
      } else {
        console.error("Services API error:", result.error);
      }
    } catch (error) {
      console.error("Services API exception:", error);
    }
  },

  // Test admin login
  testAdminLogin: async () => {
    console.log("=== Testing Admin Login ===");

    // Test admin login
    console.log("1. Testing Admin Login...");
    const loginResult = await authAPI.login({
      email: demoAdminUser.email,
      password: demoAdminUser.password,
    });
    console.log("Admin login result:", loginResult);

    // Check authentication status
    console.log("2. Checking admin auth status...");
    const isAuth = authAPI.isAuthenticated();
    const currentUser = authAPI.getCurrentUser();
    console.log("Is authenticated:", isAuth);
    console.log("Current user:", currentUser);
    console.log("Is admin:", currentUser?.role === "admin");
  },

  // Test regular user login
  testRegularLogin: async () => {
    console.log("=== Testing Regular User Login ===");

    // Test regular user login
    console.log("1. Testing Regular User Login...");
    const loginResult = await authAPI.login({
      email: demoUser.email,
      password: demoUser.password,
    });
    console.log("Regular user login result:", loginResult);

    // Check authentication status
    console.log("2. Checking regular user auth status...");
    const isAuth = authAPI.isAuthenticated();
    const currentUser = authAPI.getCurrentUser();
    console.log("Is authenticated:", isAuth);
    console.log("Current user:", currentUser);
    console.log("Is admin:", currentUser?.role === "admin");
  },
};

// Helper function để chạy demo từ console
window.demoAPI = {
  ...demoAPI,
  servicesAPI: servicesAPI,
};

console.log("Demo API loaded! Use window.demoAPI.testAll() to test all APIs");
console.log(
  "Quick admin login: window.demoAPI.quickAdminLogin() - Quick admin login for testing"
);
console.log(
  "Test admin nav: window.demoAPI.testAdminNavigation() - Test admin navigation"
);
console.log(
  "Test services API: window.demoAPI.testServicesAPI() - Test services API call"
);
console.log(
  "Admin test: window.demoAPI.testAdminLogin() - Login as admin user"
);
console.log(
  "Regular user test: window.demoAPI.testRegularLogin() - Login as regular user"
);
console.log(
  "Clear auth data: window.demoAPI.clearAuthData() - Clear localStorage and reset auth"
);
