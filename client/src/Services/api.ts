import axios from "axios";
import type { Product } from "../Types/types";

const API_URL = "http://localhost:1337/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Product service
export const productService = {
  // Get all products with CORRECT Strapi v4 population syntax
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log("Fetching products with proper Strapi v4 population...");

      // CORRECT Strapi v4 population syntax
      const response = await api.get("/products", {
        params: {
          populate: {
            image: {
              fields: ["url", "formats"],
            },
            categories: {
              fields: ["name"],
            },
            sizes: {
              fields: ["name"],
            },
            colors: {
              fields: ["name"],
            },
            gender: {
              fields: ["name"],
            },
          },
        },
        paramsSerializer: (params) => {
          // Convert params to URL string manually
          const queryParams = new URLSearchParams();
          queryParams.append("populate[image][fields][0]", "url");
          queryParams.append("populate[image][fields][1]", "formats");
          queryParams.append("populate[categories][fields][0]", "name");
          queryParams.append("populate[sizes][fields][0]", "name");
          queryParams.append("populate[colors][fields][0]", "name");
          queryParams.append("populate[gender][fields][0]", "name");
          return queryParams.toString();
        },
      });

      console.log("API Response:", response.data);

      if (!response.data?.data) {
        console.warn("No data received from API");
        return [];
      }

      const products = response.data.data
        .map((item: any, index: number) => {
          try {
            console.log(`Product ${index + 1} raw data:`, item);
            return transformProduct(item);
          } catch (error) {
            console.error(
              `Error transforming product ${index + 1}:`,
              error,
              item
            );
            return null;
          }
        })
        .filter(Boolean);

      console.log(`Successfully loaded ${products.length} products`);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Alternative: Try deep population
  async getAllProductsDeep(): Promise<Product[]> {
    try {
      console.log("Trying deep population...");

      // Try multiple population formats
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          "populate[0]": "image",
          "populate[1]": "categories",
          "populate[2]": "sizes",
          "populate[3]": "colors",
          "populate[4]": "gender",
        },
      });

      console.log("Deep population response:", response.data);

      if (!response.data?.data) {
        throw new Error("No data from deep population");
      }

      return response.data.data.map(transformProduct).filter(Boolean);
    } catch (error) {
      console.error("Deep population failed:", error);
      throw error;
    }
  },
};
