import axios, { InternalAxiosRequestConfig } from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

// ----------------------------------------------------------------------
// Gắn token vào mọi request đi tới BE của hệ thống.
//
// Phần lớn code domain (~70 file trong src/sections/) gọi `axios` trần với URL ghép tay
// thay vì instance ở file này, nên chúng không mang header Authorization. Từ khi BE bắt
// buộc đăng nhập, những lời gọi đó sẽ hỏng. Thay vì sửa từng file, gắn interceptor cho
// cả instance lẫn axios mặc định.
//
// Chỉ gắn token khi URL trỏ tới BE của mình: tuyệt đối không gửi token sang bên thứ ba
// (upload ảnh gọi thẳng api.cloudinary.com).

const isOwnApi = (url?: string) => {
  if (!url) return false;
  // Lời gọi qua instance dùng đường dẫn tương đối vì đã có baseURL.
  if (url.startsWith('/')) return true;
  return !!HOST_API && url.startsWith(HOST_API);
};

const attachAccessToken = (config: InternalAxiosRequestConfig) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && isOwnApi(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (error) {
    // localStorage có thể không dùng được (chế độ riêng tư): cứ gửi request không token.
  }

  return config;
};

// Interceptor của instance không tự áp cho axios mặc định, phải đăng ký riêng cả hai.
axiosInstance.interceptors.request.use(attachAccessToken);
axios.interceptors.request.use(attachAccessToken);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/account/me',
    login: '/api/account/login',
    register: '/api/account/register',
  },
  account: {
    list: '/api/account/list',
    create: '/api/account/register',
    edit: '/api/account/edit',
    delete: '/api/account/delete',
    resetPassword: '/api/account/resetPassword',
  },
  tradeUnion: {
    list: '/api/tradeUnion/list',
  },
  source: {
    list: '/api/source/list',
  },
  company: {
    list: '/api/company/list',
    listByTradeUnion: '/api/company/listByTradeUnion',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
