// ----------------------------------------------------------------------

export type IOrderTableFilterValue = string | string[] | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  // Lọc TTS bên trong từng đơn theo tên nguồn ("Nhật Tân" = TTS chưa có nguồn).
  source: string[];
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
  tradeUnion: any;
  companySelect: any;
  housingConditions: string;
  livingConditions: string;
  otherLivingConditions: string;
  listWorker: any;
  listIntern: any;
  // ID các TTS đậu đơn này (một TTS có thể đậu nhiều đơn)
  listInternPass?: string[];
  // Số TTS đậu, tính ở FE để sắp xếp được theo cột "Đậu"
  passCount?: number;
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
