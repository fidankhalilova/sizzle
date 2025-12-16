// TestApiComponent.jsx
import { useState, useEffect } from "react";
import { productService } from "../../Services/api";

const TestApiComponent = () => {
  const [status, setStatus] = useState<string>("Testing...");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test 1: Get all products
        setStatus("Testing /api/products...");
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);

        if (allProducts.length > 0) {
          setStatus(`✅ Found ${allProducts.length} products`);

          // Test 2: Try to get first product by ID
          const firstId = allProducts[0].id;
          setStatus(`Testing /api/products/${firstId}...`);

          const singleProduct = await productService.getProductById(firstId);
          if (singleProduct) {
            setStatus(`✅ Successfully fetched product ${firstId}`);
          } else {
            setStatus(`❌ Failed to fetch product ${firstId}`);
          }
        } else {
          setStatus("❌ No products found");
        }
      } catch (error) {
        setStatus(`❌ Error: ${(error as Error).message}`);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <div
        className={`p-4 rounded-lg mb-6 ${
          status.includes("✅") ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <p className="font-mono">{status}</p>
      </div>

      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Available Products:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg">
                <p>
                  <strong>ID:</strong> {product.id}
                </p>
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <button
                  onClick={() =>
                    (window.location.href = `/product/${product.id}`)
                  }
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test Product {product.id}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestApiComponent;
