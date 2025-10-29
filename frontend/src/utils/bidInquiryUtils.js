/**
 * Utility functions and constants for Bid Inquiry System
 */

// ============== CONSTANTS ==============

export const BID_INQUIRY_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  AWARDED: 'AWARDED',
  CANCELLED: 'CANCELLED'
};

export const BID_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
};

export const ROOM_TYPES = [
  { value: 'STANDARD', label: 'Standard Room' },
  { value: 'DELUXE', label: 'Deluxe Room' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'EXECUTIVE', label: 'Executive Room' },
  { value: 'PRESIDENTIAL', label: 'Presidential Suite' }
];

export const MEAL_PLANS = [
  { value: 'ROOM_ONLY', label: 'Room Only' },
  { value: 'BREAKFAST', label: 'Breakfast Included' },
  { value: 'HALF_BOARD', label: 'Half Board (Breakfast + Dinner)' },
  { value: 'FULL_BOARD', label: 'Full Board (All Meals)' },
  { value: 'ALL_INCLUSIVE', label: 'All Inclusive' }
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'LKR', label: 'LKR (Rs)', symbol: 'Rs' }
];

export const SRI_LANKAN_CITIES = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura',
  'Trincomalee', 'Batticaloa', 'Matara', 'Badulla', 'Ratnapura',
  'Kurunegala', 'Kalutara', 'Nuwara Eliya', 'Bentota', 'Hikkaduwa',
  'Mirissa', 'Ella', 'Sigiriya', 'Dambulla', 'Polonnaruwa',
  'Arugam Bay', 'Tangalle', 'Unawatuna', 'Weligama', 'Yala',
  'Udawalawe', 'Horton Plains', 'Haputale', 'Bandarawela'
];

// ============== STATUS HELPERS ==============

export const getStatusColor = (status) => {
  const colors = {
    OPEN: 'text-green-600 bg-green-50 border-green-200',
    CLOSED: 'text-gray-600 bg-gray-50 border-gray-200',
    AWARDED: 'text-blue-600 bg-blue-50 border-blue-200',
    CANCELLED: 'text-red-600 bg-red-50 border-red-200',
    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    ACCEPTED: 'text-green-600 bg-green-50 border-green-200',
    REJECTED: 'text-red-600 bg-red-50 border-red-200',
    WITHDRAWN: 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getStatusLabel = (status) => {
  const labels = {
    OPEN: 'Open for Bidding',
    CLOSED: 'Closed',
    AWARDED: 'Bid Awarded',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending Review',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn'
  };
  return labels[status] || status;
};

// ============== DATE/TIME HELPERS ==============

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeRemaining = (deadline) => {
  if (!deadline) return null;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 24) {
    return `${hours}h ${minutes}m remaining`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h remaining`;
};

export const isDeadlineApproaching = (deadline) => {
  if (!deadline) return false;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  const hoursRemaining = diff / (1000 * 60 * 60);
  
  return hoursRemaining > 0 && hoursRemaining <= 24; // Within 24 hours
};

export const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now > deadlineDate;
};

// ============== PRICE HELPERS ==============

export const formatPrice = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  const currencySymbol = CURRENCIES.find(c => c.value === currency)?.symbol || currency;
  return `${currencySymbol} ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const calculateTotalPrice = (pricePerRoom, numberOfRooms, numberOfNights) => {
  return pricePerRoom * numberOfRooms * numberOfNights;
};

export const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage) return price;
  return price - (price * discountPercentage / 100);
};

// ============== VALIDATION HELPERS ==============

export const validateDateRange = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkInDate < today) {
    return 'Check-in date must be in the future';
  }
  
  if (checkOutDate <= checkInDate) {
    return 'Check-out date must be after check-in date';
  }
  
  return null; // Valid
};

export const validateBudget = (budgetMin, budgetMax) => {
  if (budgetMin && budgetMax && parseFloat(budgetMax) < parseFloat(budgetMin)) {
    return 'Maximum budget must be greater than or equal to minimum budget';
  }
  return null; // Valid
};

export const validateBidPrice = (bidPrice, budgetMin, budgetMax) => {
  const price = parseFloat(bidPrice);
  const min = parseFloat(budgetMin);
  const max = parseFloat(budgetMax);
  
  if (min && price < min) {
    return 'Bid price is below the minimum budget';
  }
  
  if (max && price > max) {
    return 'Bid price exceeds the maximum budget';
  }
  
  return null; // Valid
};

// ============== TEXT HELPERS ==============

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural || `${singular}s`;
};

// ============== ROOM TYPE & MEAL PLAN HELPERS ==============

export const getRoomTypeLabel = (value) => {
  const roomType = ROOM_TYPES.find(rt => rt.value === value);
  return roomType ? roomType.label : value;
};

export const getMealPlanLabel = (value) => {
  const mealPlan = MEAL_PLANS.find(mp => mp.value === value);
  return mealPlan ? mealPlan.label : value;
};

// ============== STATISTICS HELPERS ==============

export const calculateWinRate = (acceptedBids, totalBids) => {
  if (!totalBids || totalBids === 0) return 0;
  return ((acceptedBids / totalBids) * 100).toFixed(1);
};

export const getBidCountLabel = (count) => {
  if (count === 0) return 'No bids yet';
  if (count === 1) return '1 bid received';
  return `${count} bids received`;
};
