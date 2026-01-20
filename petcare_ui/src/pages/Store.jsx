import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import Pagination from "../components/Pagination";
import { storeAPI, checkoutAPI } from "../services/api";
import { useApp } from "../context/AppContext";

const productsFood = [
  {
    id: 1,
    name: "Thức ăn hạt cho mèo Whiskas",
    price: 250000,
    img: "https://via.placeholder.com/200x200?text=Whiskas",
  },
  {
    id: 2,
    name: "Thức ăn hạt cho mèo TUNA",
    price: 250000,
    img: "https://via.placeholder.com/200x200?text=Tuna",
  },
  {
    id: 3,
    name: "Thức ăn hạt cho mèo CAT ON",
    price: 250000,
    img: "https://via.placeholder.com/200x200?text=Cat+On",
  },
  {
    id: 4,
    name: "Thức ăn hạt cho mèo ZOI CAT",
    price: 250000,
    img: "https://via.placeholder.com/200x200?text=Zoi+Cat",
  },
];

const productsAccessory = [
  {
    id: 5,
    name: "Nhà cho chó ngoài trời",
    price: 900000,
    img: "https://via.placeholder.com/200x200?text=Nha+cho+cho",
  },
  {
    id: 6,
    name: "Ổ dành cho mèo dễ đê",
    price: 130000,
    img: "https://via.placeholder.com/200x200?text=O+meo",
  },
  {
    id: 7,
    name: "Vòng đeo cổ cho mèo Happy",
    price: 50000,
    img: "https://via.placeholder.com/200x200?text=Vong+co",
  },
  {
    id: 8,
    name: "Rọ mõm chó",
    price: 70000,
    img: "https://via.placeholder.com/200x200?text=Ro+mom",
  },
];

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        active
          ? "bg-emerald-700 text-white"
          : "text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ p, onNavigate, handleAddToCart }) {
  const handleProductClick = () => {
    // Navigate to product detail with product ID
    onNavigate("product-detail", { productId: p.id });
  };

  return (
    <div
      className="rounded-3xl bg-white border border-gray-200 shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleProductClick}
    >
      <div className="rounded-2xl overflow-hidden bg-gray-50">
        <img src={p.images} alt={p.name} className="w-full h-40 object-cover" />
      </div>
      <div className="mt-3 text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
        {p.name}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-emerald-700 font-bold">
          {p.price.toLocaleString()} đ
        </div>
        <button
          className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(p);
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Grid({ items, onNavigate, handleAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <Card
          key={p.id}
          p={p}
          onNavigate={onNavigate}
          handleAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}

function Store({ onBack, current = "store", onNavigate }) {
  const { state, actions } = useApp();
  const [tab, setTab] = useState("food");
  const [q, setQ] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid

  const filterProducts = useCallback(() => {
    // Ensure allProducts is an array
    let filtered = Array.isArray(allProducts) ? allProducts : [];

    // Filter by attrs (product type)
    const targetAttr = tab === "food" ? "Thức ăn" : "Phụ kiện";
    filtered = filtered.filter((product) => product.attrs === targetAttr);

    // Filter by search query
    if (q.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [tab, q, allProducts]);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when tab or search query changes
  useEffect(() => {
    if (Array.isArray(allProducts)) {
      filterProducts();
    }
  }, [allProducts, filterProducts]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await storeAPI.getProducts();

      if (result.success) {
        // API trả về dữ liệu trong thuộc tính "content"
        setAllProducts(result.data?.content || []);
      } else {
        setError(result.error);
        // Fallback to mock data if API fails
        const baseItems = [...productsFood, ...productsAccessory];
        setAllProducts(baseItems);
      }
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
      // Fallback to mock data
      const baseItems = [...productsFood, ...productsAccessory];
      setAllProducts(baseItems);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!state.isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    const cartItemData = {
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      description: product.description,
      image: product.image,
    };

    console.log("Adding to cart:", cartItemData);
    const result = await checkoutAPI.addToCart(cartItemData);
    console.log("API Response:", result);

    if (result.success) {
      alert("Đã thêm vào giỏ hàng!");
      // Có thể reload giỏ hàng hoặc cập nhật state nếu cần
      // actions.addToCart không cần thiết vì chúng ta đã sử dụng API trực tiếp
    } else {
      console.error("API Error:", result.error);
      alert(result.error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar current={current} onNavigate={onNavigate} />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full rounded-xl bg-white pl-11 pr-4 py-3 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center mb-6">
          <TabButton active={tab === "food"} onClick={() => setTab("food")}>
            Thức ăn
          </TabButton>
          <TabButton active={tab === "acc"} onClick={() => setTab("acc")}>
            Phụ kiện
          </TabButton>
        </div>
        <Panel>
          <div className="space-y-6">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <div className="text-red-500 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              </div>
            )}

            {!loading && (
              <>
                <Grid
                  items={filteredProducts.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )}
                  onNavigate={onNavigate}
                  handleAddToCart={handleAddToCart}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Store;
