export interface UserProfile {
  username: string;
  tenantId: string;
  tenantTier: string;
  userRole: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
}