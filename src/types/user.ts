import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type ICompanyTableFilters = {
  name: string;
  tradeUnion: string[];
  status: string;
};

export type IInternTableFilters = {
  name: string;
  tradeUnion: string[];
  company?: string[];
  source?: string[];
  type?: string[];
  status: string;
  year?: any[]
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date | string | number;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date | string | number;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date | string | number;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

export type IAccountItem = {
  _id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  role: string;
  tradeUnion: any;
};

export type IContactItem = {
  _id: string;
  internId: any;
  address: string;
  email: string;
  phone: string;
  addressDadAndMom: string;
  phoneDad: string;
  phoneMom: string;
};

export type IStudyItem = {
  _id: string;
  internId: any;
  health: number;
  cooperation: number;
  attend: number;
  discipline: number;
  attitude: number;
  acquiringKnowledge: number;
  write: number;
  read: number;
  listen: number;
  speak: number;
  total: number;
  average: number;
  level: string;
  time: number;
  kanji: number;
  grammarAndReading: number;
  listeningComprehension: number;
  totalReadingAndListening: number;
  learningProcess: string;
  characteristic: string;
  comment: string;
  createdAt: any;
  monthAndYear: any;
  teacher: string;
};

export type IInternItem = {
  _id: string;
  name: string;
  userId: number;
  namejp: string;
  gender: string;
  blood: string;
  birthday: string;
  age: number;
  height: number;
  weight: number;
  BMI: number;
  blindColor: boolean;
  leftEye: number;
  rightEye: number;
  avatar: string;
  familyList: any;
  family: any;
  schoolList: any;
  school: any;
  companyList: any;
  company: any;
  smoke: boolean;
  alcohol: boolean;
  tattoo: boolean;
  familyInJapan: boolean;
  moveForeign: boolean;
  city: string;
  hand: string;
  address: string;
  married: string;
  driverLicense: string;
  interest: string;
  strong: any;
  weak: any;
  foreignLanguage: string;
  aim: string;
  money: string;
  plan: string;
  tradeUnion: any;
    source: any;
  companySelect: any;
  iq: number | null;
  math: number | null;
  kraepelin1: number | null;
  kraepelin2: number | null;
  createdAt: any;
  status: string;
  job: string;
  interviewDate: any;
  studyDate: any;
  startDate: any;
  departureDate: any;
  type: string;
  certificate: any;
  pushup: number | null;
  field: string;
  citizenId: string;
  citizenDate: string;
  citizenPlace: string;
  passportId: string;
  passportDate: any;
  reff: string;
  street: string;
  state: string;
  postelCode: string;
  country: string;
  phone: string;
  contractId: string;
  contractDate: any;
  contractPeriod: string;
  contractResult: string;
  profileStatus: string;
  orderId: any;
  description: string;
  returnDate: any;
};

export type ITradeUnionItem = {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  createdAt: string;
};

export type ISourceItem = {
  _id: string;
  name: string;
  email: string;
  address: string;
  state: string;
  phone: string;
  createdAt: string;
};

export type IDiaryItem = {
  _id: string;
  name: string;
  intern: any;
  status: string;
  direction: string;
  startDate: string;
  endDate: string;
  time: number;
  description: string;
  person: string;
};

export type ICompanyItem = {
  _id: string;
  name: string;
  email: string;
  web: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  tradeUnion: any;
  createdAt: string;
};

export type IUserAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: Date | string | number;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
