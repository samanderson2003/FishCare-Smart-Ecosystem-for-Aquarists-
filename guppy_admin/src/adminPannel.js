import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("LiveFish");
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    imageUrl: "",
  });
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const categories = [
    "LiveFish",
    "AquariumPlants",
    "AquascapingTools",
    "BreedingSupplies",
    "Decorations",
    "FishFood",
    "Medicines",
    "TankAccessories",
  ];

  const orderStatusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab, selectedCategory]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log("Attempting to fetch orders...");
      const querySnapshot = await getDocs(collection(db, "Orders"));
      
      // Check if we got any documents
      console.log(`Found ${querySnapshot.docs.length} order documents`);
      
      if (querySnapshot.empty) {
        console.log("The orders collection is empty");
        setOrders([]);
      } else {
        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Order data:", data);
          
          // Format timestamp if it exists, being careful with null values
          let formattedDate = "N/A";
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            try {
              formattedDate = new Date(data.createdAt.toDate()).toLocaleString();
            } catch (err) {
              console.error("Error formatting date:", err);
            }
          }
          
          return {
            id: doc.id,
            ...data,
            createdAtFormatted: formattedDate
          };
        });
        
        console.log("Processed orders:", ordersList);
        setOrders(ordersList);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, selectedCategory));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { status: status });
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status!");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "Orders", orderId));
        toast.success("Order deleted successfully!");
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order!");
      }
    }
  };

  const handleUpdateProduct = async (id, field, value) => {
    try {
      const productRef = doc(db, selectedCategory, id);
      await updateDoc(productRef, { [field]: value });
      toast.success("Product updated successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product!");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.imageUrl) {
      toast.error("Please fill in all required fields before adding a product.");
      return;
    }

    try {
      await addDoc(collection(db, selectedCategory), newProduct);
      toast.success("Product added successfully!");
      setNewProduct({ name: "", description: "", price: "", oldPrice: "", imageUrl: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product!");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, selectedCategory, id));
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product!");
      }
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      
      <div style={styles.tabs}>
        <button 
          style={activeTab === "orders" ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button 
          style={activeTab === "products" ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
      </div>

      {activeTab === "orders" ? (
  <div style={styles.ordersContainer}>
    <h2 style={styles.sectionTitle}>Customer Orders</h2>
    {loading ? (
      <div style={styles.loading}>
        <p>Loading orders...</p>
      </div>
    ) : orders.length === 0 ? (
      <p style={styles.noData}>No orders found.</p>
    ) : (
      <div style={styles.ordersWrapper}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderBasicInfo}>
                <h3 style={styles.orderTitle}>Order #{order.orderId || order.id.slice(0, 6)}</h3>
                <div style={styles.orderMeta}>
                  <span style={styles.orderDate}>{order.createdAtFormatted || "N/A"}</span>
                  <span style={getStatusStyle(order.status || "Pending")}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
              <div style={styles.orderActions}>
                <select 
                  value={order.status || "Pending"}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  style={styles.statusDropdown}
                >
                  {orderStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button 
                  onClick={() => toggleOrderDetails(order.id)}
                  style={styles.detailsButton}
                >
                  {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                </button>
                <button 
                  onClick={() => handleDeleteOrder(order.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
            
            {expandedOrderId === order.id && (
              <div style={styles.orderDetails}>
                <div style={styles.customerInfo}>
                  <h4 style={styles.detailsTitle}>Customer Information</h4>
                  <p><strong>Name:</strong> {order.shippingAddress?.name || "N/A"}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}</p>
                </div>
                
                <div style={styles.shippingInfo}>
                  <h4 style={styles.detailsTitle}>Shipping Address</h4>
                  <p>{order.shippingAddress?.addressLine1 || "N/A"}</p>
                  <p>{order.shippingAddress?.addressLine2 || ""}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                </div>
                
                <div style={styles.paymentInfo}>
                  <h4 style={styles.detailsTitle}>Payment Information</h4>
                  <p><strong>Method:</strong> {order.paymentMethod || "N/A"}</p>
                  <p><strong>Payment ID:</strong> {order.paymentId || "N/A"}</p>
                  <p><strong>Payment Status:</strong> {order.status || "N/A"}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount || "0.00"}</p>
                </div>
                
                <div style={styles.orderItems}>
                  <h4 style={styles.detailsTitle}>Order Items</h4>
                  <table style={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total ({order.totalItems} items)</strong></td>
                        <td>₹{order.totalAmount || "0.00"}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
      ) : (
        <div style={styles.productsContainer}>
          <h2 style={styles.sectionTitle}>Manage Products</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categoryDropdown}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div style={styles.addProductSection}>
            <h3 style={styles.subsectionTitle}>Add New Product</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name*</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price*</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Old Price (Optional)</label>
                <input
                  type="number"
                  placeholder="Old Price"
                  value={newProduct.oldPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL*</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
                <label style={styles.label}>Description*</label>
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={styles.textarea}
                />
              </div>
            </div>
            <button onClick={handleAddProduct} style={styles.addButton}>Add Product</button>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <p style={styles.noData}>No products found in this category.</p>
          ) : (
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <div style={styles.productImageContainer}>
                    <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productDescription}>{product.description}</p>
                    <div style={styles.productPricing}>
                      <span style={styles.currentPrice}>₹{product.price}</span>
                      {product.oldPrice && (
                        <span style={styles.oldPrice}>₹{product.oldPrice}</span>
                      )}
                    </div>
                    <div style={styles.productActions}>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)} 
                        style={styles.productDeleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};
const getStatusStyle = (status) => {
  const baseStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  };
  
  switch(status) {
    case "Pending":
      return { ...baseStyle, backgroundColor: "#FEF3C7", color: "#92400E" };
    case "Processing":
      return { ...baseStyle, backgroundColor: "#DBEAFE", color: "#1E40AF" };
    case "Shipped":
      return { ...baseStyle, backgroundColor: "#C7D2FE", color: "#3730A3" };
    case "Delivered":
      return { ...baseStyle, backgroundColor: "#D1FAE5", color: "#065F46" };
    case "Cancelled":
      return { ...baseStyle, backgroundColor: "#FEE2E2", color: "#991B1B" };
    default:
      return { ...baseStyle, backgroundColor: "#E5E7EB", color: "#374151" };
  }
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  header: {
    color: "#1F2937",
    marginBottom: "24px",
    fontSize: "28px",
    fontWeight: "700",
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: "16px",
  },
  tabs: {
    display: "flex",
    marginBottom: "24px",
    borderBottom: "1px solid #E5E7EB",
  },
  tab: {
    padding: "12px 24px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTab: {
    padding: "12px 24px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    color: "#2563EB",
    borderBottom: "2px solid #2563EB",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#1F2937",
  },
  subsectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1F2937",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#6B7280",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    borderRadius: "8px",
  },
  // Orders styles
  ordersContainer: {
    width: "100%",
  },
  ordersWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
  },
  orderBasicInfo: {
    flex: "1",
  },
  orderTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#1F2937",
  },
  orderMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  orderDate: {
    color: "#6B7280",
    fontSize: "14px",
  },
  orderActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  statusDropdown: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    fontSize: "14px",
  },
  detailsButton: {
    padding: "6px 12px",
    backgroundColor: "#F3F4F6",
    color: "#374151",
    border: "1px solid #D1D5DB",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    border: "1px solid #FCA5A5",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  orderDetails: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#F9FAFB",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  customerInfo: {
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },
  shippingInfo: {
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "6px", 
    border: "1px solid #E5E7EB",
  },
  paymentInfo: {
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },
  detailsTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "8px",
    color: "#374151",
  },
  orderItems: {
    gridColumn: "1 / -1",
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  // Products styles
  productsContainer: {
    width: "100%",
  },
  categoryDropdown: {
    padding: "10px 16px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    width: "300px",
  },
  addProductSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#374151",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    height: "100px",
    resize: "vertical",
  },
  addButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  productImageContainer: {
    height: "180px",
    overflow: "hidden",
    borderBottom: "1px solid #E5E7EB",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productInfo: {
    padding: "16px",
  },
  productName: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "8px",
    color: "#1F2937",
  },
  productDescription: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "12px",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  productPricing: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  currentPrice: {
    fontWeight: "600",
    color: "#1F2937",
    fontSize: "16px",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#9CA3AF",
    fontSize: "14px",
  },
  productActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  productDeleteButton: {
    padding: "6px 12px",
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    border: "1px solid #FCA5A5",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default AdminPanel;