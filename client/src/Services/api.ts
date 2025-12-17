// Updated api.ts - COMPLETE FIXED VERSION with proper types
import axios from "axios";
import type {
  Product,
  OrderInputData,
  Order,
  ShippingAddress,
  OrderStatus,
  OrderItem,
} from "../Types/types";

const API_URL = "http://localhost:1337/api";

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
    imageUrl = `http://localhost:1337${product.image.data.attributes.url}`;
    console.log("Found image URL (v4 format):", imageUrl);
  } else if (product.image?.url) {
    imageUrl = `http://localhost:1337${product.image.url}`;
    console.log("Found image URL (direct):", imageUrl);
  } else if (product.image?.formats?.large?.url) {
    imageUrl = `http://localhost:1337${product.image.formats.large.url}`;
    console.log("Found large format image:", imageUrl);
  } else if (product.image?.formats?.medium?.url) {
    imageUrl = `http://localhost:1337${product.image.formats.medium.url}`;
    console.log("Found medium format image:", imageUrl);
  } else if (product.image?.formats?.small?.url) {
    imageUrl = `http://localhost:1337${product.image.formats.small.url}`;
    console.log("Found small format image:", imageUrl);
  } else if (product.image?.data) {
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

// Helper function to normalize status field value
const normalizeStatus = (status: any): OrderStatus => {
  const statusStr = String(status || "pending").toLowerCase();
  const validStatuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (validStatuses.includes(statusStr as OrderStatus)) {
    return statusStr as OrderStatus;
  }

  return "pending";
};

export const orderService = {
  // Create new order
  // Create new order - FIXED VERSION
  async createOrder(orderData: OrderInputData): Promise<Order> {
    try {
      console.log("📦 Creating order...", orderData);

      const orderNumber = generateOrderNumber();

      // IMPORTANT: Let's check what your Strapi orders schema actually looks like
      // First, let's try to fetch the schema to see what fields exist
      try {
        const schemaCheck = await axios.get(
          `${API_URL}/orders?pagination[pageSize]=1`
        );
        if (schemaCheck.data?.data?.[0]?.attributes) {
          const sampleOrder = schemaCheck.data.data[0].attributes;
          console.log("📋 Sample order fields:", Object.keys(sampleOrder));
          console.log(
            "📋 Sample order data:",
            JSON.stringify(sampleOrder, null, 2)
          );
        }
      } catch (schemaError: any) {
        console.log("⚠️ Could not fetch sample order:", schemaError.message);
      }

      // Let's try different approaches
      // Approach 1: Send data as-is
      const strapiOrderData = {
        data: {
          orderNumber: orderNumber,
          userEmail: orderData.userEmail,
          orderStatus: "pending", // This might be the field name

          // Try sending items as array (not stringified)
          items: orderData.items, // Try as array

          subtotal: Number(orderData.subtotal),
          shipping: Number(orderData.shipping),
          tax: Number(orderData.tax),
          total: Number(orderData.total),

          // Try sending shippingAddress as object
          shippingAddress: orderData.shippingAddress, // As object

          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes || "",
        },
      };

      console.log(
        "📤 Sending to Strapi:",
        JSON.stringify(strapiOrderData, null, 2)
      );

      const response = await axios.post(`${API_URL}/orders`, strapiOrderData);

      console.log(
        "✅ Order created successfully - Raw response:",
        response.data
      );

      // Check the response structure
      if (!response.data?.data) {
        console.error("❌ No data in response:", response.data);
        throw new Error("Invalid response from server");
      }

      const responseData = response.data.data;
      const attributes = responseData.attributes || {};

      console.log("📊 Response attributes:", attributes);

      // Try to extract the actual status from the response
      let actualStatus: OrderStatus = "pending";
      if (attributes.orderStatus) {
        actualStatus = normalizeStatus(attributes.orderStatus);
      } else if (attributes.status) {
        actualStatus = normalizeStatus(attributes.status);
      }

      // Try to extract items from response
      let itemsFromResponse: OrderItem[] = [];
      if (attributes.items) {
        if (typeof attributes.items === "string") {
          try {
            itemsFromResponse = JSON.parse(attributes.items);
          } catch (e) {
            console.error("❌ Error parsing items string:", e);
          }
        } else if (Array.isArray(attributes.items)) {
          itemsFromResponse = attributes.items;
        }
      }

      // If no items from response, use original items
      if (itemsFromResponse.length === 0) {
        itemsFromResponse = orderData.items;
      }

      // Try to extract shipping address from response
      let shippingAddressFromResponse: ShippingAddress =
        orderData.shippingAddress;
      if (attributes.shippingAddress) {
        if (typeof attributes.shippingAddress === "string") {
          try {
            shippingAddressFromResponse = JSON.parse(
              attributes.shippingAddress
            );
          } catch (e) {
            console.error("❌ Error parsing shippingAddress string:", e);
          }
        } else if (
          attributes.shippingAddress &&
          typeof attributes.shippingAddress === "object"
        ) {
          shippingAddressFromResponse = attributes.shippingAddress;
        }
      }

      const createdOrder: Order = {
        id: responseData.id,
        orderNumber: attributes.orderNumber || orderNumber,
        userEmail: attributes.userEmail || orderData.userEmail,
        status: actualStatus,
        items: itemsFromResponse,
        subtotal: attributes.subtotal || orderData.subtotal,
        shipping: attributes.shipping || orderData.shipping,
        tax: attributes.tax || orderData.tax,
        total: attributes.total || orderData.total,
        shippingAddress: shippingAddressFromResponse,
        paymentMethod: attributes.paymentMethod || orderData.paymentMethod,
        notes: attributes.notes || orderData.notes,
        createdAt: attributes.createdAt || new Date().toISOString(),
        updatedAt: attributes.updatedAt,
      };

      console.log("✅ Created order object:", createdOrder);
      return createdOrder;
    } catch (error: any) {
      console.error("❌ Error creating order:", error);

      // More detailed error logging
      if (error.response) {
        console.error("❌ Error status:", error.response.status);
        console.error("❌ Error data:", error.response.data);
        console.error("❌ Error headers:", error.response.headers);

        if (error.response.data?.error?.details?.errors) {
          const validationErrors = error.response.data.error.details.errors;
          console.error("❌ Validation errors:", validationErrors);

          const errorMessages = validationErrors
            .map(
              (err: any) =>
                `Field: ${err.path?.join(".") || "unknown"}, Message: ${
                  err.message
                }`
            )
            .join("; ");

          throw new Error(`Validation failed: ${errorMessages}`);
        }
      }

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create order"
      );
    }
  },

  async getOrdersByEmail(email: string): Promise<Order[]> {
    try {
      console.log(`📋 Fetching orders for email: ${email}`);

      // Get ALL orders from Strapi
      const response = await axios.get(`${API_URL}/orders`);

      console.log("📊 Raw Strapi response:", response.data);

      if (!response.data) {
        console.log("⚠️ No data in Strapi response");
        return [];
      }

      // IMPORTANT: Strapi might return data in different formats:
      // 1. Direct array: response.data (what you have)
      // 2. Nested: response.data.data (standard Strapi v4)
      // 3. Or response.data.ta (looks like you have this!)

      let ordersData = response.data;

      // Check for nested structure
      if (Array.isArray(response.data.ta)) {
        ordersData = response.data.ta;
        console.log("📦 Using response.data.ta array");
      } else if (Array.isArray(response.data.data)) {
        ordersData = response.data.data;
        console.log("📦 Using response.data.data array");
      } else if (Array.isArray(response.data)) {
        console.log("📦 Using response.data array directly");
      } else {
        console.log("⚠️ Unexpected response structure:", response.data);
        return [];
      }

      console.log(`📊 Found ${ordersData.length} total orders in Strapi`);

      // Filter by email
      const userOrders = ordersData.filter((order: any) => {
        // Check different possible email field locations
        const orderEmail = order.userEmail || order.email;

        if (!orderEmail) {
          console.log(
            `⚠️ Order ${order.id} has no email field. Fields:`,
            Object.keys(order)
          );
          return false;
        }

        const matches = orderEmail.toLowerCase() === email.toLowerCase();
        if (matches) {
          console.log(
            `✅ Found matching order ${order.id}: ${order.orderNumber} for ${email}`
          );
        }
        return matches;
      });

      console.log(`✅ Found ${userOrders.length} orders for ${email}`);

      // Transform to our Order type
      const orders: Order[] = userOrders.map((order: any) => {
        console.log(`📦 Processing order ${order.id}:`, order);

        // Parse items - they might already be an array
        let items: OrderItem[] = [];
        if (Array.isArray(order.items)) {
          items = order.items;
        } else if (typeof order.items === "string") {
          try {
            items = JSON.parse(order.items);
          } catch (error) {
            console.error(
              `❌ Error parsing items for order ${order.id}:`,
              error
            );
          }
        }

        // Parse shipping address
        // In api.ts - update the shipping address parsing section
        // Find this section and update it:

        let shippingAddress: ShippingAddress;

        // Check what format the shipping address is in
        console.log(
          `📦 Order ${order.id} shippingAddress type:`,
          typeof order.shippingAddress
        );
        console.log(
          `📦 Order ${order.id} shippingAddress value:`,
          order.shippingAddress
        );

        if (
          order.shippingAddress &&
          typeof order.shippingAddress === "object"
        ) {
          // Check if it's an object with data property (Strapi relation)
          const addr = order.shippingAddress;

          if (addr.data && typeof addr.data === "object") {
            // It's a Strapi relation object
            const addrData = addr.data;
            shippingAddress = {
              fullName:
                addrData.fullName || addrData.attributes?.fullName || "",
              email:
                addrData.email ||
                addrData.attributes?.email ||
                order.userEmail ||
                email,
              phone: addrData.phone || addrData.attributes?.phone || "",
              address: addrData.address || addrData.attributes?.address || "",
              city: addrData.city || addrData.attributes?.city || "",
              state: addrData.state || addrData.attributes?.state || "",
              zipCode: addrData.zipCode || addrData.attributes?.zipCode || "",
              country: addrData.country || addrData.attributes?.country || "",
            };
          } else {
            // It's a direct object
            shippingAddress = {
              fullName: addr.fullName || "",
              email: addr.email || order.userEmail || email,
              phone: addr.phone || "",
              address: addr.address || "",
              city: addr.city || "",
              state: addr.state || "",
              zipCode: addr.zipCode || "",
              country: addr.country || "",
            };
          }
        } else if (typeof order.shippingAddress === "string") {
          try {
            const parsed = JSON.parse(order.shippingAddress);
            shippingAddress = {
              fullName: parsed.fullName || "",
              email: parsed.email || order.userEmail || email,
              phone: parsed.phone || "",
              address: parsed.address || "",
              city: parsed.city || "",
              state: parsed.state || "",
              zipCode: parsed.zipCode || "",
              country: parsed.country || "",
            };
          } catch (error) {
            console.error(
              `❌ Error parsing shipping address string for order ${order.id}:`,
              error
            );
            shippingAddress = {
              fullName: "",
              email: order.userEmail || email,
              phone: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            };
          }
        } else {
          console.log(
            `⚠️ Shipping address for order ${order.id} is not in expected format:`,
            order.shippingAddress
          );

          // Try to extract address from other fields
          shippingAddress = {
            fullName: "",
            email: order.userEmail || email,
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          };
        }

        console.log(
          `✅ Parsed shipping address for order ${order.id}:`,
          shippingAddress
        );

        // Get status
        const rawStatus = order.orderStatus || order.status || "pending";
        const actualStatus = normalizeStatus(rawStatus);

        // Build the order object
        const transformedOrder: Order = {
          id: order.id || order.documentId || Date.now(),
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          userEmail: order.userEmail || email,
          status: actualStatus,
          items: items,
          subtotal: parseFloat(order.subtotal) || 0,
          shipping: parseFloat(order.shipping) || 0,
          tax: parseFloat(order.tax) || 0,
          total: parseFloat(order.total) || 0,
          shippingAddress: shippingAddress,
          paymentMethod: order.paymentMethod || order.payment || "unknown",
          notes: order.notes || "",
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt,
        };

        console.log(`✅ Transformed order ${transformedOrder.orderNumber}:`, {
          status: transformedOrder.status,
          items: transformedOrder.items.length,
          total: transformedOrder.total,
        });

        return transformedOrder;
      });

      // Sort by date (newest first)
      orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return orders;
    } catch (error: any) {
      console.error("❌ ERROR in getOrdersByEmail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Return empty array for better UX
      return [];
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

      const actualStatus = normalizeStatus(
        attributes.orderStatus || attributes.status || attributes.order_status
      );

      const order: Order = {
        id: item.id,
        orderNumber: attributes.orderNumber || orderNumber,
        userEmail: attributes.userEmail || "",
        status: actualStatus,
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

  // Update order status
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      console.log(`🔄 Updating order ${orderId} status to: ${status}`);

      const response = await axios.put(`${API_URL}/orders/${orderId}`, {
        data: {
          orderStatus: status,
        },
      });

      if (!response.data?.data) {
        throw new Error("No data received");
      }

      const attributes = response.data.data.attributes || {};
      const actualStatus = normalizeStatus(
        attributes.orderStatus || attributes.status || attributes.order_status
      );

      const updatedOrder: Order = {
        id: response.data.data.id,
        orderNumber: attributes.orderNumber || "",
        userEmail: attributes.userEmail || "",
        status: actualStatus,
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

  // Get all orders
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

        const actualStatus = normalizeStatus(
          attributes.orderStatus || attributes.status || attributes.order_status
        );

        return {
          id: item.id,
          orderNumber: attributes.orderNumber || `ORD-${item.id}`,
          userEmail: attributes.userEmail || "",
          status: actualStatus,
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

// Product service (unchanged)
export const productService = {
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

      if (!response.data?.data) {
        console.warn("⚠️ No data received from API");
        return [];
      }

      const rawProducts = response.data.data;
      console.log(`📦 Found ${rawProducts.length} products in Strapi`);

      const products = rawProducts
        .map((item: any) => {
          try {
            return transformProduct(item);
          } catch (error) {
            console.error(`❌ Error transforming product:`, error, item);
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

  async getProductById(id: number): Promise<Product | null> {
    try {
      console.log(`🔍 Fetching product with ID: ${id}`);

      try {
        const directResponse = await axios.get(
          `${API_URL}/products/${id}?populate=*`
        );
        if (directResponse.data?.data) {
          return transformProduct(directResponse.data.data);
        }
      } catch (directError: any) {
        console.log("⚠️ Direct endpoint failed, trying filter method");
      }

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
        return null;
      }

      const foundProduct = allResponse.data.data.find((p: any) => p.id == id);

      if (!foundProduct) {
        console.warn(`⚠️ Product with ID ${id} not found`);
        return null;
      }

      return transformProduct(foundProduct);
    } catch (error: any) {
      console.error(`❌ Error fetching product ${id}:`, error);
      return null;
    }
  },
};
