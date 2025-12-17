// Create a file: src/utils/debugOrders.ts
export async function debugStrapiOrders() {
  console.log("🔍 Debugging Strapi Orders...");

  try {
    // Check if endpoint exists
    const response = await fetch("http://localhost:1337/api/orders?populate=*");
    const data = await response.json();

    console.log("📊 Strapi Response:", {
      status: response.status,
      totalOrders: data.data?.length || 0,
      meta: data.meta,
      firstOrder: data.data?.[0],
    });

    if (data.data && data.data.length > 0) {
      // Log all orders with their email
      console.log("📋 All Orders in Strapi:");
      data.data.forEach((order: any, index: number) => {
        const attrs = order.attributes || {};
        console.log(
          `${index + 1}. ID: ${order.id}, Order#: ${
            attrs.orderNumber
          }, Email: ${attrs.userEmail}, Status: ${
            attrs.orderStatus || attrs.status
          }`
        );
      });
    }

    return data;
  } catch (error) {
    console.error("❌ Error connecting to Strapi:", error);
    return null;
  }
}

// Add a debug button to your MyOrders page
const DebugOrdersButton = () => {
  const handleDebug = async () => {
    const result = await debugStrapiOrders();
    if (result?.data?.length > 0) {
      alert(`Found ${result.data.length} orders in Strapi`);
    } else {
      alert("No orders found in Strapi or connection failed");
    }
  };

  return (
    <button
      onClick={handleDebug}
      className="px-4 py-2 bg-purple-500 text-white rounded-lg"
    >
      🔍 Debug Strapi
    </button>
  );
};

export default DebugOrdersButton;
