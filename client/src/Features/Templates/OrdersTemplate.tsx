import OrdersHeroBanner from "../Sections/Orders/OrdersBanner";
import MyOrders from "../Sections/Orders/OrdersPage";

const OrdersTemplate = () => {
  return (
    <div className="container mx-auto px-12">
      <OrdersHeroBanner />
      <MyOrders />
    </div>
  );
};

export default OrdersTemplate;
