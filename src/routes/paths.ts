// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    intern: {
      root: `${ROOTS.DASHBOARD}/intern/list`,
      new: `${ROOTS.DASHBOARD}/intern/new`,
      list: `${ROOTS.DASHBOARD}/intern/list`,
      listPoint: `${ROOTS.DASHBOARD}/intern/listPoint`,
      listByTradeUnion: `${ROOTS.DASHBOARD}/intern/listByTradeUnion`,
      listBySource: `${ROOTS.DASHBOARD}/intern/listBySource`,
      listByDongThap: `${ROOTS.DASHBOARD}/intern/listByDongThap`,
      cards: `${ROOTS.DASHBOARD}/intern/cards`,
      profile: (id: string) => `${ROOTS.DASHBOARD}/intern/${id}/profile`,
      account: `${ROOTS.DASHBOARD}/intern/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/intern/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/intern/${MOCK_ID}/edit`,
      },
    },
    tradeUnion: {
      root: `${ROOTS.DASHBOARD}/tradeUnion/list`,
      new: `${ROOTS.DASHBOARD}/tradeUnion/new`,
      list: `${ROOTS.DASHBOARD}/tradeUnion/list`,
      cards: `${ROOTS.DASHBOARD}/tradeUnion/cards`,
      profile: `${ROOTS.DASHBOARD}/tradeUnion/profile`,
      account: `${ROOTS.DASHBOARD}/tradeUnion/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tradeUnion/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/tradeUnion/${MOCK_ID}/edit`,
      },
    },
    company: {
      root: `${ROOTS.DASHBOARD}/company/list`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      list: `${ROOTS.DASHBOARD}/company/list`,
      cards: `${ROOTS.DASHBOARD}/company/cards`,
      profile: `${ROOTS.DASHBOARD}/company/profile`,
      account: `${ROOTS.DASHBOARD}/company/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/company/${MOCK_ID}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order/list`,
      new: `${ROOTS.DASHBOARD}/order/new`,
      list: `${ROOTS.DASHBOARD}/order/list`,
      cards: `${ROOTS.DASHBOARD}/order/cards`,
      profile: `${ROOTS.DASHBOARD}/order/profile`,
      account: `${ROOTS.DASHBOARD}/order/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/order/${id}/edit`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/order/${MOCK_ID}/edit`,
      },
    },
    source: {
      root: `${ROOTS.DASHBOARD}/source/list`,
      new: `${ROOTS.DASHBOARD}/source/new`,
      list: `${ROOTS.DASHBOARD}/source/list`,
      cards: `${ROOTS.DASHBOARD}/source/cards`,
      profile: `${ROOTS.DASHBOARD}/source/profile`,
      account: `${ROOTS.DASHBOARD}/source/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/source/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/source/${MOCK_ID}/edit`,
      },
    },
    diary: {
      root: `${ROOTS.DASHBOARD}/diary/list`,
      new: `${ROOTS.DASHBOARD}/diary/new`,
      list: `${ROOTS.DASHBOARD}/diary/list`,
      cards: `${ROOTS.DASHBOARD}/diary/cards`,
      profile: (id: string) => `${ROOTS.DASHBOARD}/diary/${id}/profile`,
      account: `${ROOTS.DASHBOARD}/diary/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/diary/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/diary/${MOCK_ID}/edit`,
      },
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user/list`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    // order: {
    //   root: `${ROOTS.DASHBOARD}/order`,
    //   details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
    //   },
    // },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
