/**
 * Standalone Mock API Service with Rich Hardcoded Dummy Data
 * No backend required! Everything runs client-side with localStorage persistence.
 * When ready to connect to real backend APIs, replace this file with the real fetch wrapper.
 */

// -------------------------------------------------------------
// 1. Initial Dummy Data Store
// -------------------------------------------------------------

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Ergonomic Wireless Mouse',
    description: 'High-precision 2.4GHz optical wireless mouse with silent clicks, contoured rubber grip, and 18-month battery life. Perfect for productivity and comfortable daily work.',
    price: 850.0,
    category: 'Computer Accessories',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
    ],
    average_rating: 4.8,
    review_count: 5,
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'RGB Mechanical Gaming Keyboard',
    description: 'Tenkeyless compact layout with responsive blue clicky switches, full per-key RGB backlighting, aircraft-grade aluminum top plate, and detachable braided USB-C cable.',
    price: 3800.0,
    category: 'Computer Accessories',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    ],
    average_rating: 4.9,
    review_count: 8,
    created_at: '2026-09-02T11:00:00Z',
  },
  {
    id: 3,
    name: 'Braided USB-C to USB-C Fast Cable (2m)',
    description: '100W Power Delivery support with reinforced military-grade nylon braiding and aluminum alloy connector shells. High-speed 480Mbps data transfer sync.',
    price: 450.0,
    category: 'Cables & Chargers',
    stock: 99,
    image_url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.6,
    review_count: 12,
    created_at: '2026-09-03T09:00:00Z',
  },
  {
    id: 4,
    name: '65W GaN Dual Port Fast Charger',
    description: 'Ultra-compact Gallium Nitride (GaN) fast wall adapter with 1x USB-C (65W Max) and 1x USB-A (18W). Safely fast-charges laptops, tablets, and phones simultaneously.',
    price: 1450.0,
    category: 'Cables & Chargers',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.7,
    review_count: 6,
    created_at: '2026-09-04T14:00:00Z',
  },
  {
    id: 5,
    name: 'Active Noise-Cancelling Bluetooth Earbuds',
    description: 'Hybrid Active Noise Cancellation up to 35dB, transparency mode, dynamic bass boost, and 30 hours of playtime with the pocket-friendly wireless charging case.',
    price: 2200.0,
    category: 'Audio',
    stock: 29,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
    ],
    average_rating: 4.5,
    review_count: 4,
    created_at: '2026-09-05T16:00:00Z',
  },
  {
    id: 6,
    name: 'Over-Ear Wireless Studio Headphones',
    description: 'Plush memory foam earcups, 40mm tuned drivers for pristine acoustic clarity, multi-point Bluetooth pairing, and up to 50 hours of wireless playback.',
    price: 4500.0,
    category: 'Audio',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.9,
    review_count: 10,
    created_at: '2026-09-06T12:00:00Z',
  },
  {
    id: 7,
    name: '20,000mAh Ultra-Slim Power Bank',
    description: 'High-capacity external battery pack with 22.5W Super Fast Charging output, LED digital battery percentage screen, and dual USB output with USB-C input/output.',
    price: 1950.0,
    category: 'Power Banks',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.8,
    review_count: 7,
    created_at: '2026-09-07T08:00:00Z',
  },
  {
    id: 8,
    name: '7-in-1 Aluminum USB-C Hub',
    description: 'Comprehensive multiport expansion: 4K@60Hz HDMI, 100W PD pass-through charging, 3x USB 3.0 ports, and SD / TF high-speed card readers in heat-dissipating anodized aluminum.',
    price: 1650.0,
    category: 'Computer Accessories',
    stock: 38,
    image_url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.4,
    review_count: 3,
    created_at: '2026-09-08T13:00:00Z',
  },
  {
    id: 9,
    name: 'Foldable Aluminum Laptop Stand',
    description: 'Ergonomic 6-level height adjustable riser for 10-16 inch laptops and tablets. Promotes healthy posture, reduces neck fatigue, and enhances natural airflow cooling.',
    price: 950.0,
    category: 'Computer Accessories',
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.8,
    review_count: 9,
    created_at: '2026-09-09T15:00:00Z',
  },
  {
    id: 10,
    name: '1080p FHD Streaming Webcam with Mic',
    description: 'Crisp Full HD 1080p 60fps autofocus video with dual omnidirectional noise-cancelling microphones and physical privacy sliding shutter.',
    price: 2100.0,
    category: 'Computer Accessories',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.7,
    review_count: 5,
    created_at: '2026-09-10T10:30:00Z',
  },
  {
    id: 11,
    name: 'Magnetic Wireless Car Mount Charger',
    description: 'MagSafe-compatible 15W auto-clamping fast wireless car charger. Strong neodymium magnets hold your phone securely across rough roads and speed bumps.',
    price: 1250.0,
    category: 'Mobile Gadgets',
    stock: 70,
    image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.6,
    review_count: 6,
    created_at: '2026-09-11T17:00:00Z',
  },
  {
    id: 12,
    name: 'Bluetooth Smart Tracker Tag',
    description: 'Never lose your keys, wallet, or backpack again. Waterproof design, replaceable 1-year battery, 100ft Bluetooth range, and ultra-loud find-my-item buzzer ring.',
    price: 750.0,
    category: 'Mobile Gadgets',
    stock: 84,
    image_url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80',
    images: [],
    average_rating: 4.5,
    review_count: 4,
    created_at: '2026-09-12T11:45:00Z',
  },
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    product_id: 1,
    user_id: 2,
    user_name: 'Demo Customer',
    rating: 5,
    comment: 'Exceptional build quality and very comfortable for long hours of work! Battery lasts forever.',
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 2,
    product_id: 1,
    user_id: 3,
    user_name: 'Tanvir Ahmed',
    rating: 5,
    comment: 'Best wireless mouse at this price point in BD. Very smooth on wooden desk.',
    created_at: '2026-09-18T14:30:00Z',
  },
  {
    id: 3,
    product_id: 2,
    user_id: 4,
    user_name: 'Sabbir Hossain',
    rating: 5,
    comment: 'The mechanical switches feel very satisfying to type on. RGB colors are super bright!',
    created_at: '2026-09-19T18:15:00Z',
  },
];

const INITIAL_ORDERS = [
  {
    id: 101,
    user_id: 2,
    user_name: 'Demo Customer',
    user_email: 'customer@example.com',
    total_amount: 1460.0,
    delivery_charge: 60.0,
    discount_amount: 0.0,
    coupon_code: null,
    district: 'Dhaka',
    thana: 'Dhanmondi',
    shipping_address: 'House 42, Road 9/A, Dhanmondi',
    phone: '01711223344',
    payment_method: 'cod',
    payment_status: 'paid',
    transaction_id: null,
    status: 'delivered',
    created_at: '2026-09-18T11:30:00Z',
    items: [
      {
        id: 1,
        order_id: 101,
        product_id: 1,
        product_name: 'Ergonomic Wireless Mouse',
        product_image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 850.0,
      },
      {
        id: 2,
        order_id: 101,
        product_id: 3,
        product_name: 'Braided USB-C to USB-C Fast Cable (2m)',
        product_image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 450.0,
      },
    ],
  },
  {
    id: 102,
    user_id: 2,
    user_name: 'Demo Customer',
    user_email: 'customer@example.com',
    total_amount: 3920.0,
    delivery_charge: 120.0,
    discount_amount: 0.0,
    coupon_code: null,
    district: 'Chattogram',
    thana: 'Panchlaish',
    shipping_address: 'GEC Circle, Nasirabad',
    phone: '01887654321',
    payment_method: 'sslcommerz',
    payment_status: 'paid',
    transaction_id: 'SSLC_DUMMY_8832',
    status: 'processing',
    created_at: '2026-09-22T09:15:00Z',
    items: [
      {
        id: 3,
        order_id: 102,
        product_id: 2,
        product_name: 'RGB Mechanical Gaming Keyboard',
        product_image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 3800.0,
      },
    ],
  },
];

const INITIAL_ADDRESSES = [
  {
    id: 1,
    user_id: 2,
    label: 'Home',
    recipient_name: 'Demo Customer',
    phone: '01711223344',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    address_details: 'House 42, Road 9/A, Dhanmondi',
    is_default: true,
  },
  {
    id: 2,
    user_id: 2,
    label: 'Office',
    recipient_name: 'Demo Customer',
    phone: '01887654321',
    district: 'Chattogram',
    thana: 'Panchlaish',
    address_details: 'Level 5, Nasirabad Commercial Area',
    is_default: false,
  },
];

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Store Administrator',
    email: 'admin@example.com',
    role: 'admin',
    phone: '01700000000',
    total_orders: 0,
    total_spent: 0.0,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 2,
    name: 'Demo Customer',
    email: 'customer@example.com',
    role: 'customer',
    phone: '01711223344',
    total_orders: 2,
    total_spent: 5380.0,
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    role: 'customer',
    phone: '01911998877',
    total_orders: 1,
    total_spent: 1250.0,
    created_at: '2026-09-10T11:00:00Z',
  },
];

// -------------------------------------------------------------
// 2. Local Storage Helpers
// -------------------------------------------------------------

function getStore(key, defaultValue) {
  try {
    const saved = localStorage.getItem(`mock_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStore(key, value) {
  try {
    localStorage.setItem(`mock_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not save mock_${key}:`, e);
  }
}

// Initialize mock storage if not already seeded
if (!localStorage.getItem('mock_products')) setStore('products', INITIAL_PRODUCTS);
if (!localStorage.getItem('mock_reviews')) setStore('reviews', INITIAL_REVIEWS);
if (!localStorage.getItem('mock_orders')) setStore('orders', INITIAL_ORDERS);
if (!localStorage.getItem('mock_addresses')) setStore('addresses', INITIAL_ADDRESSES);
if (!localStorage.getItem('mock_users')) setStore('users', INITIAL_USERS);

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------------------------------------------
// 3. Auth Services (Mock)
// -------------------------------------------------------------
export const authService = {
  login: async ({ email, password }) => {
    await delay();
    const users = getStore('users', INITIAL_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const user = existing || {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'admin' : 'customer',
    };

    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('mock_current_user', JSON.stringify(user));
    return { access_token: token, user };
  },

  register: async (userData) => {
    await delay();
    const users = getStore('users', INITIAL_USERS);
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'customer',
      phone: userData.phone || '01700000000',
      total_orders: 0,
      total_spent: 0.0,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    setStore('users', users);

    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('mock_current_user', JSON.stringify(newUser));
    return { access_token: token, user: newUser };
  },

  getMe: async () => {
    await delay(50);
    const saved = localStorage.getItem('mock_current_user');
    if (saved) return JSON.parse(saved);

    // Default to demo customer
    const defaultUser = {
      id: 2,
      name: 'Demo Customer',
      email: 'customer@example.com',
      role: 'customer',
    };
    localStorage.setItem('mock_current_user', JSON.stringify(defaultUser));
    return defaultUser;
  },
};

// -------------------------------------------------------------
// 4. Product Services (Mock)
// -------------------------------------------------------------
export const productService = {
  getAll: async (params = {}) => {
    await delay();
    let list = [...getStore('products', INITIAL_PRODUCTS)];

    // Category filter
    if (params.category) {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }

    // Keyword search filter
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Min price
    if (params.min_price !== undefined && params.min_price !== null && params.min_price !== '') {
      list = list.filter((p) => p.price >= Number(params.min_price));
    }

    // Max price
    if (params.max_price !== undefined && params.max_price !== null && params.max_price !== '') {
      list = list.filter((p) => p.price <= Number(params.max_price));
    }

    // Sorting
    const sortBy = params.sort_by || 'id';
    const sortOrder = (params.sort_order || 'desc').toLowerCase();

    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  },

  getCategories: async () => {
    await delay(30);
    const products = getStore('products', INITIAL_PRODUCTS);
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort();
  },

  getById: async (id) => {
    await delay();
    const products = getStore('products', INITIAL_PRODUCTS);
    const item = products.find((p) => p.id === Number(id));
    if (!item) throw new Error(`Product with ID ${id} was not found`);
    return item;
  },

  getReviews: async (productId) => {
    await delay();
    const reviews = getStore('reviews', INITIAL_REVIEWS);
    return reviews
      .filter((r) => r.product_id === Number(productId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  canReview: async (productId) => {
    await delay(50);
    const currentUser = await authService.getMe();
    const orders = getStore('orders', INITIAL_ORDERS);

    // Check delivered order containing this product
    const delivered = orders.some(
      (o) =>
        o.user_id === currentUser.id &&
        o.status.toLowerCase() === 'delivered' &&
        o.items.some((i) => i.product_id === Number(productId))
    );

    const reviews = getStore('reviews', INITIAL_REVIEWS);
    const existing = reviews.find(
      (r) => r.product_id === Number(productId) && r.user_id === currentUser.id
    );

    return {
      can_review: delivered,
      has_reviewed: Boolean(existing),
      delivered: delivered,
      existing_review: existing || null,
    };
  },

  submitReview: async (productId, reviewData) => {
    await delay();
    const currentUser = await authService.getMe();
    const reviews = getStore('reviews', INITIAL_REVIEWS);

    const existingIndex = reviews.findIndex(
      (r) => r.product_id === Number(productId) && r.user_id === currentUser.id
    );

    const reviewObj = {
      id: existingIndex >= 0 ? reviews[existingIndex].id : Date.now(),
      product_id: Number(productId),
      user_id: currentUser.id,
      user_name: currentUser.name || 'Verified Buyer',
      rating: Number(reviewData.rating),
      comment: reviewData.comment || '',
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = reviewObj;
    } else {
      reviews.unshift(reviewObj);
    }
    setStore('reviews', reviews);

    // Recalculate average rating for this product
    const products = getStore('products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === Number(productId));
    if (pIndex >= 0) {
      const pReviews = reviews.filter((r) => r.product_id === Number(productId));
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      products[pIndex].average_rating = Math.round(avg * 10) / 10;
      products[pIndex].review_count = pReviews.length;
      setStore('products', products);
    }

    return reviewObj;
  },
};

// -------------------------------------------------------------
// 5. Order Services (Mock)
// -------------------------------------------------------------
export const orderService = {
  create: async (orderData) => {
    await delay(300);
    const orders = getStore('orders', INITIAL_ORDERS);
    const currentUser = await authService.getMe();

    const newOrder = {
      id: Math.floor(100 + Math.random() * 900),
      user_id: currentUser.id,
      user_name: orderData.customer_name || currentUser.name,
      user_email: orderData.customer_email || currentUser.email,
      total_amount: Number(orderData.total_amount || 0),
      delivery_charge: orderData.district?.toLowerCase() === 'dhaka' ? 60.0 : 120.0,
      discount_amount: Number(orderData.discount_amount || 0),
      coupon_code: orderData.coupon_code || null,
      district: orderData.district,
      thana: orderData.thana,
      shipping_address: orderData.shipping_address,
      phone: orderData.phone,
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_method === 'pay_now' ? 'paid' : 'unpaid',
      status: 'processing',
      created_at: new Date().toISOString(),
      items: (orderData.items || []).map((item, idx) => ({
        id: Date.now() + idx,
        order_id: null,
        product_id: item.product_id,
        product_name: item.product_name || `Product #${item.product_id}`,
        product_image: item.product_image || '',
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };

    orders.unshift(newOrder);
    setStore('orders', orders);

    return newOrder;
  },

  validateCoupon: async (code, subtotal) => {
    await delay(100);
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'SAVE10') {
      const discount = Math.round(subtotal * 0.1);
      return { valid: true, discount_amount: discount, message: '10% discount applied!' };
    }
    if (cleanCode === 'GADGET50') {
      return { valid: true, discount_amount: 50.0, message: '৳50 flat discount applied!' };
    }
    if (cleanCode === 'WELCOME100') {
      return { valid: true, discount_amount: 100.0, message: '৳100 welcome voucher applied!' };
    }

    throw new Error('Invalid or expired coupon code');
  },

  initSslPayment: async (orderId) => {
    await delay(200);
    return {
      status: 'SUCCESS',
      GatewayPageURL: `/orders?payment=success&welcome=1`,
    };
  },

  getMyOrders: async () => {
    await delay();
    const orders = getStore('orders', INITIAL_ORDERS);
    return orders;
  },

  getById: async (id) => {
    await delay();
    const orders = getStore('orders', INITIAL_ORDERS);
    const order = orders.find((o) => o.id === Number(id));
    if (!order) throw new Error('Order not found');
    return order;
  },
};

// -------------------------------------------------------------
// 6. Admin Services (Mock)
// -------------------------------------------------------------
export const adminService = {
  getDashboard: async () => {
    await delay();
    const orders = getStore('orders', INITIAL_ORDERS);
    const products = getStore('products', INITIAL_PRODUCTS);
    const users = getStore('users', INITIAL_USERS);

    const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      total_sales: totalSales,
      total_orders: orders.length,
      total_products: products.length,
      total_users: users.length,
      recent_orders: orders.slice(0, 5),
    };
  },

  getProducts: async () => {
    await delay();
    return getStore('products', INITIAL_PRODUCTS);
  },

  createProduct: async (productData) => {
    await delay();
    const products = getStore('products', INITIAL_PRODUCTS);
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;

    const newProd = {
      ...productData,
      id: newId,
      images: productData.images || [],
      average_rating: 0.0,
      review_count: 0,
      created_at: new Date().toISOString(),
    };

    products.unshift(newProd);
    setStore('products', products);
    return newProd;
  },

  updateProduct: async (id, productData) => {
    await delay();
    const products = getStore('products', INITIAL_PRODUCTS);
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) throw new Error('Product not found');

    products[index] = {
      ...products[index],
      ...productData,
      images: productData.images !== undefined ? productData.images : products[index].images,
      updated_at: new Date().toISOString(),
    };

    setStore('products', products);
    return products[index];
  },

  deleteProduct: async (id) => {
    await delay();
    let products = getStore('products', INITIAL_PRODUCTS);
    products = products.filter((p) => p.id !== Number(id));
    setStore('products', products);
    return { success: true };
  },

  getOrders: async () => {
    await delay();
    return getStore('orders', INITIAL_ORDERS);
  },

  updateOrderStatus: async (id, status) => {
    await delay();
    const orders = getStore('orders', INITIAL_ORDERS);
    const index = orders.findIndex((o) => o.id === Number(id));
    if (index === -1) throw new Error('Order not found');

    orders[index].status = status;
    setStore('orders', orders);
    return orders[index];
  },

  getUsers: async () => {
    await delay();
    return getStore('users', INITIAL_USERS);
  },
};

// -------------------------------------------------------------
// 7. Address Services (Mock)
// -------------------------------------------------------------
export const addressService = {
  getAll: async () => {
    await delay(50);
    return getStore('addresses', INITIAL_ADDRESSES);
  },

  create: async (data) => {
    await delay();
    const addresses = getStore('addresses', INITIAL_ADDRESSES);
    const newAddr = { ...data, id: Date.now() };
    if (newAddr.is_default) {
      addresses.forEach((a) => (a.is_default = false));
    }
    addresses.push(newAddr);
    setStore('addresses', addresses);
    return newAddr;
  },

  update: async (id, data) => {
    await delay();
    const addresses = getStore('addresses', INITIAL_ADDRESSES);
    const index = addresses.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error('Address not found');

    if (data.is_default) {
      addresses.forEach((a) => (a.is_default = false));
    }
    addresses[index] = { ...addresses[index], ...data };
    setStore('addresses', addresses);
    return addresses[index];
  },

  delete: async (id) => {
    await delay();
    let addresses = getStore('addresses', INITIAL_ADDRESSES);
    addresses = addresses.filter((a) => a.id !== Number(id));
    setStore('addresses', addresses);
    return { success: true };
  },

  setDefault: async (id) => {
    await delay();
    const addresses = getStore('addresses', INITIAL_ADDRESSES);
    addresses.forEach((a) => {
      a.is_default = a.id === Number(id);
    });
    setStore('addresses', addresses);
    return { success: true };
  },
};

// -------------------------------------------------------------
// 8. Upload Services (Mock - Converts local File to Blob/ObjectURL)
// -------------------------------------------------------------
export const uploadService = {
  uploadImage: async (file) => {
    await delay(150);
    // Instant simulated upload using browser Object URL
    const url = URL.createObjectURL(file);
    return { url, filename: file.name };
  },

  uploadMultiple: async (files) => {
    await delay(250);
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    return { urls };
  },
};
