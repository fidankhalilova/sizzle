// Updated api.ts - FIXED getProductById method
import axios from "axios";
import type { Product } from "../Types/types";
import type { OrderInputData, Order, ShippingAddress } from "../Types/types";

const API_URL = "http://localhost:1337/api";

// Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// Correct Strapi v4 population syntax for nested relations
const transformProduct = (strapiProduct: any): Product => {
  console.log("Transforming product data:", strapiProduct);

  const product = strapiProduct.attributes || strapiProduct;
  const productId = strapiProduct.id || 0;

  // Extract image URL with proper Strapi v4 structure
  let imageUrl = "";

  // Log the image structure for debugging
  console.log("Image data structure:", product.image);

  // Handle different Strapi image formats
  if (product.image?.data?.attributes?.url) {
    // Strapi v4 format: image.data.attributes.url
    imageUrl = `http://localhost:1337${product.image.data.attributes.url}`;
    console.log("Found image URL (v4 format):", imageUrl);
  } else if (product.image?.url) {
    // Direct url from the example (when image is not nested in data)
    imageUrl = `http://localhost:1337${product.image.url}`;
    console.log("Found image URL (direct):", imageUrl);
  } else if (product.image?.formats?.large?.url) {
    // Use large format if available
    imageUrl = `http://localhost:1337${product.image.formats.large.url}`;
    console.log("Found large format image:", imageUrl);
  } else if (product.image?.formats?.medium?.url) {
    // Use medium format if available
    imageUrl = `http://localhost:1337${product.image.formats.medium.url}`;
    console.log("Found medium format image:", imageUrl);
  } else if (product.image?.formats?.small?.url) {
    // Use small format if available
    imageUrl = `http://localhost:1337${product.image.formats.small.url}`;
    console.log("Found small format image:", imageUrl);
  } else if (product.image?.data) {
    // Alternative v4 format
    const imageData = product.image.data;
    if (
      Array.isArray(imageData) &&
      imageData.length > 0 &&
      imageData[0].attributes?.url
    ) {
      imageUrl = `http://localhost:1337${imageData[0].attributes.url}`;
    } else if (imageData.attributes?.url) {
      imageUrl = `http://localhost:1337${imageData.attributes.url}`;
    }
  } else if (typeof product.image === "string") {
    // String URL
    imageUrl = product.image.startsWith("/")
      ? `http://localhost:1337${product.image}`
      : product.image;
  }

  // If still no image, use product ID to pick a fallback
  if (!imageUrl) {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
      "https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
    ];
    imageUrl = fallbackImages[productId % fallbackImages.length];
    console.log("Using fallback image:", imageUrl);
  }

  // Extract category
  let category = "Uncategorized";
  if (product.categories?.data?.length > 0) {
    const categoryData = product.categories.data[0];
    category = categoryData.attributes?.name || "Uncategorized";
  } else if (product.categories?.[0]?.name) {
    category = product.categories[0].name;
  } else if (product.category) {
    category = product.category;
  }

  // Extract sizes
  let sizes: string[] = [];
  if (product.sizes?.data) {
    sizes = product.sizes.data
      .map((size: any) => size.attributes?.name || size.name || "")
      .filter(Boolean);
  } else if (product.sizes) {
    sizes = product.sizes
      .map((size: any) => size.name || size.attributes?.name || "")
      .filter(Boolean);
  }

  // Extract gender
  let gender = "Unisex";
  if (product.gender?.data?.attributes?.name) {
    gender = product.gender.data.attributes.name;
  } else if (product.gender?.name) {
    gender = product.gender.name;
  } else if (product.gender) {
    gender = product.gender;
  }

  // Extract colors
  let colors: string[] = [];
  if (product.colors?.data) {
    colors = product.colors.data
      .map((color: any) => color.attributes?.name || color.name || "")
      .filter(Boolean);
  } else if (product.colors) {
    colors = product.colors
      .map((color: any) => color.name || color.attributes?.name || "")
      .filter(Boolean);
  }

  return {
    id: productId,
    name: product.name || "Unnamed Product",
    price: `$ ${(product.price || 0).toFixed(2)} USD`,
    image: imageUrl,
    category,
    colors: colors.length > 0 ? colors : ["Black", "White"],
    sizes: sizes.length > 0 ? sizes : ["S", "M", "L"],
    gender,
  };
};

const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

export const orderService = {
  // Create new order
  async createOrder(orderData: OrderInputData): Promise<Order> {
    try {
      console.log("📦 Creating order...", orderData);

      // Generate unique order number
      const orderNumber = generateOrderNumber();

      // IMPORTANT: Check what fields your Strapi orders collection actually has
      // Common field names in Strapi:
      // - orderNumber (or order_number)
      // - userEmail (or customer_email)
      // - status (or orderStatus)
      // - items (JSON string or relation)
      // - subtotal, shipping, tax, total
      // - shippingAddress (JSON string)
      // - paymentMethod (or payment_method)
      // - notes (optional)

      const strapiOrderData = {
        data: {
          orderNumber: orderNumber,
          userEmail: orderData.userEmail,
          // Try 'status' first, if it doesn't work, try 'orderStatus'
          status: "pending",
          // orderStatus: "pending", // Alternative field name

          // Items might need to be stored as JSON string in Strapi
          items: JSON.stringify(orderData.items),

          subtotal: Number(orderData.subtotal),
          shipping: Number(orderData.shipping),
          tax: Number(orderData.tax),
          total: Number(orderData.total),

          // Shipping address as JSON string
          shippingAddress: JSON.stringify(orderData.shippingAddress),

          // Payment method - try different field names
          paymentMethod: orderData.paymentMethod,
          // payment: orderData.paymentMethod, // Alternative
          // payment_method: orderData.paymentMethod, // Alternative

          // Notes - only include if field exists in Strapi
          // notes: orderData.notes || "",
        },
      };

      console.log(
        "📤 Sending to Strapi:",
        JSON.stringify(strapiOrderData, null, 2)
      );

      const response = await axios.post(`${API_URL}/orders`, strapiOrderData);

      console.log("✅ Order created successfully:", response.data);

      // Transform response back to our Order type
      const createdOrder: Order = {
        id: response.data.data.id,
        orderNumber,
        userEmail: orderData.userEmail,
        status: "pending",
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        createdAt:
          response.data.data.attributes?.createdAt || new Date().toISOString(),
      };

      return createdOrder;
    } catch (error: any) {
      console.error("❌ Error creating order:", error);

      // More helpful error message
      if (error.response?.status === 400) {
        console.error("❌ Bad Request - Check field names in Strapi");
        console.error("Error details:", error.response?.data);

        // Check what fields are actually available
        try {
          const testResponse = await axios.get(
            `${API_URL}/orders?pagination[pageSize]=1`
          );
          if (testResponse.data?.data?.[0]?.attributes) {
            const existingOrder = testResponse.data.data[0].attributes;
            console.log(
              "📋 Available fields in orders:",
              Object.keys(existingOrder)
            );
          }
        } catch (testError) {
          console.error("Could not check orders structure");
        }
      }

      throw new Error(
        error.response?.data?.error?.message || "Failed to create order"
      );
    }
  },

  // Get orders by user email - FIXED VERSION
  async getOrdersByEmail(email: string): Promise<Order[]> {
    try {
      console.log("📋 Fetching orders for:", email);

      const response = await axios.get(`${API_URL}/orders`, {
        params: {
          // Filter by user email
          "filters[userEmail][$eq]": email,
          // Or try different field names if the above doesn't work:
          // "filters[email][$eq]": email,
          // "filters[customer_email][$eq]": email,

          // Sort by creation date (newest first)
          "sort[0]": "createdAt:desc",

          // Get all orders (adjust pageSize as needed)
          "pagination[pageSize]": 100,

          // Populate all fields if needed
          populate: "*",
        },
      });

      console.log("📦 Raw orders response:", response.data);

      if (!response.data?.data) {
        console.log("No orders data received");
        return [];
      }

      // Transform Strapi response to our Order type
      const orders: Order[] = response.data.data.map((item: any) => {
        const attributes = item.attributes || {};

        // Parse items from JSON string if stored that way
        let items = [];
        try {
          if (typeof attributes.items === "string") {
            items = JSON.parse(attributes.items);
          } else if (Array.isArray(attributes.items)) {
            items = attributes.items;
          }
        } catch (error) {
          console.error("Error parsing items:", error);
          items = [];
        }

        // Parse shipping address from JSON string if stored that way
        let shippingAddress: ShippingAddress;
        try {
          if (typeof attributes.shippingAddress === "string") {
            shippingAddress = JSON.parse(attributes.shippingAddress);
          } else if (
            attributes.shippingAddress &&
            typeof attributes.shippingAddress === "object"
          ) {
            shippingAddress = attributes.shippingAddress;
          } else {
            // Default fallback
            shippingAddress = {
              fullName: "",
              email: attributes.userEmail || "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            };
          }
        } catch (error) {
          console.error("Error parsing shipping address:", error);
          shippingAddress = {
            fullName: "",
            email: attributes.userEmail || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          };
        }

        return {
          id: item.id,
          orderNumber: attributes.orderNumber || `ORD-${item.id}`,
          userEmail: attributes.userEmail || email,
          status: attributes.status || attributes.orderStatus || "pending",
          items: items,
          subtotal: attributes.subtotal || 0,
          shipping: attributes.shipping || 0,
          tax: attributes.tax || 0,
          total: attributes.total || 0,
          shippingAddress: shippingAddress,
          paymentMethod:
            attributes.paymentMethod ||
            attributes.payment ||
            attributes.payment_method ||
            "unknown",
          notes: attributes.notes || "",
          createdAt: attributes.createdAt || new Date().toISOString(),
          updatedAt: attributes.updatedAt,
        };
      });

      console.log(`✅ Found ${orders.length} orders for ${email}`);
      return orders;
    } catch (error: any) {
      console.error("❌ Error fetching orders:", error);

      // Check if endpoint exists
      if (error.response?.status === 404) {
        console.error(
          "Orders endpoint not found. Make sure 'orders' collection exists in Strapi."
        );
      } else if (error.response?.status === 403) {
        console.error("Permission denied. Check Strapi permissions.");
      }

      throw new Error("Failed to fetch orders");
    }
  },

  // Get single order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      console.log("🔍 Fetching order:", orderNumber);

      const response = await axios.get(`${API_URL}/orders`, {
        params: {
          "filters[orderNumber][$eq]": orderNumber,
          populate: "*",
        },
      });

      if (!response.data?.data || response.data.data.length === 0) {
        return null;
      }

      const item = response.data.data[0];
      const attributes = item.attributes || {};

      // Parse items
      let items = [];
      try {
        if (typeof attributes.items === "string") {
          items = JSON.parse(attributes.items);
        } else if (Array.isArray(attributes.items)) {
          items = attributes.items;
        }
      } catch (error) {
        console.error("Error parsing items:", error);
      }

      // Parse shipping address
      let shippingAddress: ShippingAddress;
      try {
        if (typeof attributes.shippingAddress === "string") {
          shippingAddress = JSON.parse(attributes.shippingAddress);
        } else if (
          attributes.shippingAddress &&
          typeof attributes.shippingAddress === "object"
        ) {
          shippingAddress = attributes.shippingAddress;
        } else {
          shippingAddress = {
            fullName: "",
            email: attributes.userEmail || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          };
        }
      } catch (error) {
        console.error("Error parsing shipping address:", error);
        shippingAddress = {
          fullName: "",
          email: attributes.userEmail || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        };
      }

      const order: Order = {
        id: item.id,
        orderNumber: attributes.orderNumber || orderNumber,
        userEmail: attributes.userEmail || "",
        status: attributes.status || attributes.orderStatus || "pending",
        items: items,
        subtotal: attributes.subtotal || 0,
        shipping: attributes.shipping || 0,
        tax: attributes.tax || 0,
        total: attributes.total || 0,
        shippingAddress: shippingAddress,
        paymentMethod:
          attributes.paymentMethod ||
          attributes.payment ||
          attributes.payment_method ||
          "unknown",
        notes: attributes.notes || "",
        createdAt: attributes.createdAt || new Date().toISOString(),
        updatedAt: attributes.updatedAt,
      };

      console.log("✅ Order found:", order);
      return order;
    } catch (error: any) {
      console.error("❌ Error fetching order:", error);
      throw new Error("Failed to fetch order");
    }
  },

  // Update order status (for admin use)
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      console.log(`🔄 Updating order ${orderId} status to: ${status}`);

      const response = await axios.put(`${API_URL}/orders/${orderId}`, {
        data: {
          status: status,
          // Or try orderStatus if that's the field name
          // orderStatus: status,
        },
      });

      if (!response.data?.data) {
        throw new Error("No data received");
      }

      const attributes = response.data.data.attributes || {};

      // Transform back to our Order type
      const updatedOrder: Order = {
        id: response.data.data.id,
        orderNumber: attributes.orderNumber || "",
        userEmail: attributes.userEmail || "",
        status: attributes.status || attributes.orderStatus || "pending",
        items: [],
        subtotal: attributes.subtotal || 0,
        shipping: attributes.shipping || 0,
        tax: attributes.tax || 0,
        total: attributes.total || 0,
        shippingAddress: {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        paymentMethod: attributes.paymentMethod || "unknown",
        notes: attributes.notes || "",
        createdAt: attributes.createdAt || new Date().toISOString(),
        updatedAt: attributes.updatedAt,
      };

      return updatedOrder;
    } catch (error: any) {
      console.error("❌ Error updating order:", error);
      throw new Error("Failed to update order");
    }
  },

  // Get all orders (admin use)
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log("📋 Fetching all orders");

      const response = await axios.get(`${API_URL}/orders`, {
        params: {
          "sort[0]": "createdAt:desc",
          "pagination[pageSize]": 100,
          populate: "*",
        },
      });

      if (!response.data?.data) {
        return [];
      }

      const orders: Order[] = response.data.data.map((item: any) => {
        const attributes = item.attributes || {};

        // Parse items
        let items = [];
        try {
          if (typeof attributes.items === "string") {
            items = JSON.parse(attributes.items);
          } else if (Array.isArray(attributes.items)) {
            items = attributes.items;
          }
        } catch (error) {
          console.error("Error parsing items:", error);
        }

        // Parse shipping address
        let shippingAddress: ShippingAddress;
        try {
          if (typeof attributes.shippingAddress === "string") {
            shippingAddress = JSON.parse(attributes.shippingAddress);
          } else if (
            attributes.shippingAddress &&
            typeof attributes.shippingAddress === "object"
          ) {
            shippingAddress = attributes.shippingAddress;
          } else {
            shippingAddress = {
              fullName: "",
              email: attributes.userEmail || "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            };
          }
        } catch (error) {
          console.error("Error parsing shipping address:", error);
          shippingAddress = {
            fullName: "",
            email: attributes.userEmail || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          };
        }

        return {
          id: item.id,
          orderNumber: attributes.orderNumber || `ORD-${item.id}`,
          userEmail: attributes.userEmail || "",
          status: attributes.status || attributes.orderStatus || "pending",
          items: items,
          subtotal: attributes.subtotal || 0,
          shipping: attributes.shipping || 0,
          tax: attributes.tax || 0,
          total: attributes.total || 0,
          shippingAddress: shippingAddress,
          paymentMethod:
            attributes.paymentMethod ||
            attributes.payment ||
            attributes.payment_method ||
            "unknown",
          notes: attributes.notes || "",
          createdAt: attributes.createdAt || new Date().toISOString(),
          updatedAt: attributes.updatedAt,
        };
      });

      console.log(`✅ Found ${orders.length} total orders`);
      return orders;
    } catch (error: any) {
      console.error("❌ Error fetching all orders:", error);
      throw new Error("Failed to fetch orders");
    }
  },
};

// Product service
export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log("🔄 Fetching products from Strapi...");

      const response = await axios.get(`${API_URL}/products`, {
        params: {
          "pagination[pageSize]": 100,
          "populate[0]": "image",
          "populate[1]": "categories",
          "populate[2]": "sizes",
          "populate[3]": "colors",
          "populate[4]": "gender",
        },
      });

      console.log("✅ API Response received");
      console.log("📊 Raw response data:", response.data);

      if (!response.data?.data) {
        console.warn("⚠️ No data received from API");
        return [];
      }

      const rawProducts = response.data.data;
      console.log(`📦 Found ${rawProducts.length} products in Strapi`);

      // Log all product IDs
      console.log("═══════════════════════════════════════");
      console.log("📋 AVAILABLE PRODUCT IDs IN STRAPI:");
      rawProducts.forEach((p: any, index: number) => {
        console.log(
          `   ${index + 1}. ID: ${p.id} → ${p.attributes?.name || "Unnamed"}`
        );
      });
      console.log("═══════════════════════════════════════");

      const products = rawProducts
        .map((item: any, index: number) => {
          try {
            return transformProduct(item);
          } catch (error) {
            console.error(
              `❌ Error transforming product ${index + 1}:`,
              error,
              item
            );
            return null;
          }
        })
        .filter(Boolean);

      console.log(`✅ Successfully loaded ${products.length} products`);
      return products;
    } catch (error: any) {
      console.error("❌ Error fetching products:", error);
      throw error;
    }
  },

  // FIXED: Get single product by ID - NOW WORKING
  async getProductById(id: number): Promise<Product | null> {
    try {
      console.log(`🔍 Fetching product with ID: ${id}`);

      // METHOD 1: First try the direct endpoint with SIMPLE params
      try {
        const directResponse = await axios.get(
          `${API_URL}/products/${id}?populate=*`
        );
        console.log("✅ Direct endpoint response:", directResponse.data);

        if (directResponse.data?.data) {
          return transformProduct(directResponse.data.data);
        }
      } catch (directError: any) {
        console.log("⚠️ Direct endpoint failed:", directError.message);
        if (directError.response?.status === 404) {
          console.log(`❌ Product ${id} not found via direct endpoint`);
        }
      }

      // METHOD 2: If direct fails, get all products and filter
      console.log("🔄 Trying filter method...");
      const allResponse = await axios.get(`${API_URL}/products`, {
        params: {
          "pagination[pageSize]": 100,
          "populate[0]": "image",
          "populate[1]": "categories",
          "populate[2]": "sizes",
          "populate[3]": "colors",
          "populate[4]": "gender",
        },
      });

      if (!allResponse.data?.data) {
        console.warn("⚠️ No products data received");
        return null;
      }

      // Find the specific product
      const foundProduct = allResponse.data.data.find((p: any) => p.id == id);

      if (!foundProduct) {
        console.warn(`⚠️ Product with ID ${id} not found in products list`);

        // Show available IDs
        const availableIds = allResponse.data.data.map((p: any) => p.id);
        console.log("Available product IDs:", availableIds);

        return null;
      }

      console.log("✅ Found product via filter method:", foundProduct);
      return transformProduct(foundProduct);
    } catch (error: any) {
      console.error(`❌ Error fetching product ${id}:`, error);

      // More detailed error info
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });

      return null;
    }
  },

  // Get available product IDs
  async getAvailableProductIds(): Promise<number[]> {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          "pagination[pageSize]": 100,
          "fields[0]": "id",
        },
      });

      if (!response.data?.data) {
        return [];
      }

      return response.data.data.map((p: any) => p.id);
    } catch (error) {
      console.error("❌ Error fetching product IDs:", error);
      return [];
    }
  },

  // Check if a specific product exists
  async productExists(id: number): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`, {
        params: {
          "fields[0]": "id",
        },
      });
      return !!response.data?.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // New method: Get products by filter (alternative approach)
  async getProductsByFilter(filters: any): Promise<Product[]> {
    try {
      const params: any = {
        "pagination[pageSize]": 100,
        "populate[0]": "image",
        "populate[1]": "categories",
        "populate[2]": "sizes",
        "populate[3]": "colors",
        "populate[4]": "gender",
      };

      // Add filters
      Object.keys(filters).forEach((key) => {
        params[`filters[${key}]`] = filters[key];
      });

      const response = await axios.get(`${API_URL}/products`, { params });

      if (!response.data?.data) {
        return [];
      }

      return response.data.data.map(transformProduct).filter(Boolean);
    } catch (error) {
      console.error("❌ Error fetching products by filter:", error);
      return [];
    }
  },
};
