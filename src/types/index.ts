export type RoomType = 'Single Room' | '2-Sharing Room' | '3-Sharing Room' | 'Bachelor Flat';

export type AvailabilityStatus = 'available' | 'taken' | 'reserved';

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  type: RoomType;
  monthlyRentZAR: number;
  depositZAR: number;
  status: AvailabilityStatus;
  lastConfirmedDate: string;
  lastConfirmedTimestamp: number;
  features: string[];
  image: string;
  // Specific room furnishings & sharing details
  sharingDetails?: string; // What exactly is shared: "2 students share bedroom, shared bathroom & commune kitchen"
  isSharing?: boolean;
  sharedFacilities?: string[]; // e.g. ["Shared Kitchen", "Bathroom shared with 1 housemate", "Communal TV Lounge"]
  privateFacilities?: string[]; // e.g. ["Private Bed", "Study Desk", "Lockable Cupboard"]
  hasBed?: boolean;
  bedType?: string; // e.g. "Single Bed with Orthopedic Mattress"
  hasStudyDesk?: boolean;
  studyTableDetails?: string; // e.g. "Dedicated wooden study table, task chair, desk lamp & power point"
}

export interface LandlordAccount {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  propertiesCount: number;
  subscriptionStatus: 'active' | 'pending_payment' | 'expired' | 'trial';
  subscriptionPlan: 'Standard Listing (R149/mo)' | 'Featured Pro (R299/mo)' | 'Semester Pass (R699/term)';
  subscriptionExpires: string;
  monthlyFeeZAR: number;
  accessGranted: boolean;
  accessCode: string; // e.g. "VAAL-101" for landlord login
  verificationStatus: 'Verified (ID & Rates)' | 'Pending Verification';
  notes: string;
  registeredDate: string;
}

export interface TransportToSchool {
  hasTransport: boolean; // Does this accommodation offer dedicated transport to campus/school?
  transportType:
    | 'Free Scheduled Campus Shuttle'
    | 'Dedicated Residence Minibus'
    | 'Campus Commuter Van'
    | 'Walking Distance (Under 10 mins)'
    | 'Direct Campus Taxi Corridor';
  distanceToCampusKm: number;
  travelTimeMin: number; // In transit
  shuttleSchedule: string; // e.g. "Every 30 mins between 07:00 - 18:30 weekdays"
  costNote: string; // e.g. "Free for all registered tenants (Included in rent)"
  routeDescription: string; // e.g. "Direct pickup from res gate to VUT Main Gate & NWU Vaal"
  isDistanceRes: boolean; // True if res is located at a distance (>1.5km) from campus where transport is vital
  pickupPoint: string; // e.g. "Res Main Security Gate"
}

export interface Property {
  id: string;
  name: string;
  propertyType: 'Student Commune' | 'Purpose-Built Student Residence' | 'Commune House' | 'Apartment Block' | 'Private Cottage';
  isCommune: boolean; // Explicit flag: Is this accommodation a commune?
  address: string;
  suburb: string; // e.g. "CW1, Vanderbijlpark", "Bedworth Park", "CE2"
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // for custom interactive map visualizer
    yPercent: number;
  };
  primaryCampus: string;
  campusDistanceKm: number;
  walkingTimeMin: number;
  taxiRankDistanceKm: number;
  nsfasAccredited: boolean;
  genderPolicy: 'Co-ed' | 'Female Only' | 'Male Only';
  amenities: string[];
  // Campus transportation to school details
  transportToSchool: TransportToSchool;
  // Specific accommodation activities and features
  activities: string[]; // e.g. ['Swimming Pool', 'Pool Table (8-Ball)', 'Communal Braai Area', 'Table Tennis']
  wifiDetails: {
    speed: string; // e.g. "100Mbps Uncapped Fiber"
    uncapped: boolean;
    backupPower: boolean; // Runs during load shedding
    description: string;
  };
  images: string[];
  landlordId: string;
  landlord: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    isVerified: boolean;
    verificationBadge: string;
    memberSince: string;
    responseRate: string;
  };
  rating: number;
  reviewCount: number;
  description: string;
  hasSolarBackup: boolean;
  hasWaterBackup: boolean;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  campusName: string;
  city: string;
  coordinates: {
    xPercent: number;
    yPercent: number;
  };
  studentPopulation: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  roomId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  institution: string;
  message: string;
  preferredMoveDate: string;
  preferredViewingDate?: string;
  status: 'New' | 'Viewing Scheduled' | 'Deposit Paid' | 'Declined';
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  studentName: string;
  institution: string;
  roomType: string;
  rating: number;
  stayPeriod: string;
  comment: string;
  date: string;
}

export interface ReportItem {
  id: string;
  propertyId: string;
  propertyName: string;
  reason: 'Incorrect Price' | 'Room Already Taken' | 'Suspicious / Potential Scam' | 'Unresponsive Landlord' | 'Condition Differs from Photos';
  details: string;
  date: string;
  status: 'Under Review' | 'Resolved';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'student' | 'landlord';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyName: string;
  roomId?: string;
  roomNumber?: string;
  landlordId: string;
  landlordName: string;
  studentName: string;
  studentPhone: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadByLandlord: boolean;
  unreadByStudent: boolean;
  messages: ChatMessage[];
}
