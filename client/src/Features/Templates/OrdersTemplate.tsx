import OrdersHeroBanner from "../Sections/Orders/OrdersBanner";
import MyOrders from "../Sections/Orders/OrdersPage";

const OrdersTemplate = () => {
  return (
    <div>
      <OrdersHeroBanner />
      <div className="container mx-auto px-12 mt-10 mb-20">
        <MyOrders />
      </div>
    </div>
  );
};

export default OrdersTemplate;
