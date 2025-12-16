import type { Schema, Struct } from '@strapi/strapi';

export interface CheckoutShippingAddress extends Struct.ComponentSchema {
  collectionName: 'components_checkout_shipping_addresses';
  info: {
    displayName: 'shippingAddress';
    icon: 'paperPlane';
  };
  attributes: {
    address: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    email: Schema.Attribute.String;
    fullName: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    state: Schema.Attribute.String;
    zipCode: Schema.Attribute.String;
  };
}

export interface EcommerceOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_ecommerce_order_items';
  info: {
    displayName: 'orderItem';
    icon: 'code';
  };
  attributes: {
    color: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    productId: Schema.Attribute.Integer;
    productName: Schema.Attribute.String;
    quantity: Schema.Attribute.Integer;
    size: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'checkout.shipping-address': CheckoutShippingAddress;
      'ecommerce.order-item': EcommerceOrderItem;
    }
  }
}
