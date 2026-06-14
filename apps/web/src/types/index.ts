export type TourStatus = 'DRAFT' | 'PUBLISHED' | 'FINISHED' | 'CANCELLED' | 'FULL';
export type TourType = 'DOMESTIC' | 'INTERNATIONAL';
export type TourCategory =
  | 'DOMESTIC'
  | 'INTERNATIONAL'
  | 'ADVENTURE'
  | 'NATURE'
  | 'CULTURAL'
  | 'PILGRIMAGE'
  | 'LUXURY'
  | 'FAMILY'
  | 'EDUCATIONAL'
  | 'RECREATIONAL';
export type TourDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
export type Role =
  | 'SUPER_ADMIN'
  | 'AGENCY_ADMIN'
  | 'AGENCY_STAFF'
  | 'TOUR_GUIDE'
  | 'ACCOUNTANT'
  | 'CONTENT_MANAGER'
  | 'SUPPORT_AGENT'
  | 'CUSTOMER'
  | 'AFFILIATE';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  nationalId?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE';
  avatar?: string;
  walletBalance: number;
  loyaltyPoints: number;
  role: Role;
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  twoFaEnabled: boolean;
  emailVerifiedAt?: string;
  mobileVerifiedAt?: string;
  createdAt: string;
}

export interface TourMedia {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  sortOrder: number;
  isCover: boolean;
}

export interface TourItinerary {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  meals: string[];
  activities?: string;
  location?: string;
  time?: string;
}

export interface TourService {
  id: string;
  serviceType: 'INCLUDED' | 'EXCLUDED' | 'OPTIONAL';
  title: string;
  description?: string;
  icon?: string;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  city: string;
  country: string;
  images: string[];
  amenities: string[];
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  status: TourStatus;
  type: TourType;
  category: TourCategory;
  difficulty: TourDifficulty;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  durationNights: number;
  originCity: string;
  destinationCity: string;
  destinationCountry: string;
  maxCapacity: number;
  currentCapacity: number;
  basePrice: number;
  pricePerChild?: number;
  priceSingleRoom?: number;
  currency: string;
  isInstallmentAvailable: boolean;
  installmentMonths?: number;
  cancellationPolicy?: string;
  termsConditions?: string;
  requiredDocuments?: string;
  climateInfo?: string;
  minAge?: number;
  maxAge?: number;
  isFeatured: boolean;
  viewCount: number;
  media?: TourMedia[];
  itinerary?: TourItinerary[];
  services?: TourService[];
  hotels?: { hotel: Hotel; checkInDate: string; checkOutDate: string; nights: number }[];
  transportations?: Transportation[];
  reviews?: Review[];
  _count?: { reviews: number; bookings: number };
}

export interface Transportation {
  id: string;
  type: 'FLIGHT' | 'TRAIN' | 'BUS' | 'SHIP' | 'VAN';
  company?: string;
  departureTime: string;
  arrivalTime: string;
  fromLocation: string;
  toLocation: string;
  class: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  body: string;
  guideRating?: number;
  accommodationRating?: number;
  transportationRating?: number;
  valueRating?: number;
  adminReply?: string;
  createdAt: string;
  user: { firstName: string; lastName: string; avatar?: string };
  media?: { url: string; type: string }[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  adultsCount: number;
  childrenCount: number;
  passengersCount: number;
  totalPrice: number;
  paidAmount: number;
  discountAmount: number;
  walletUsed: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  voucherNumber?: string;
  invoiceNumber?: string;
  createdAt: string;
  tour: Pick<Tour, 'title' | 'slug' | 'coverImage' | 'departureDate' | 'destinationCity' | 'destinationCountry' | 'originCity'>;
  passengers?: BookingPassenger[];
}

export interface BookingPassenger {
  id: string;
  firstName: string;
  lastName: string;
  nationalId?: string;
  passportNumber?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE';
  nationality?: string;
  passportExpireDate?: string;
  isLeadPassenger: boolean;
  roomType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
