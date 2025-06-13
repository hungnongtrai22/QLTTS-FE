// ----------------------------------------------------------------------

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date | string | number;
  paymentTime: Date | string | number;
  deliveryTime: Date | string | number;
  completionTime: Date | string | number;
  timeline: {
    title: string;
    time: Date | string | number;
  }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  id: string;
  _id: string;
  name: string;
  work: string;
  priority: string;
  recruitmentDate: Date | string;
  interviewFormat: string;
  description: string;
  contractPeriod: number;
  ageFrom: number;
  ageTo: number;
  quantity: number;
  quantityMen: number;
  quantityWomen: number;
  married: string;
  study: string;
  applicationConditions: string;
  insurance: string;
  housingConditions: string;
  livingConditions: string;
  otherLivingConditions: string;
  listWorker: any;
  listIntern: any;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subTotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  history: IOrderHistory;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  createdAt: Date | string | number;
};
