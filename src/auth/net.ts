export const CLERK_HOST = 'https://clerk.suno.ai';

export const CLERK_BASE_PATH = `${CLERK_HOST}/v1`;

export const CLERK_ENVIROMENT_PATH = `${CLERK_BASE_PATH}/environment`;
export const CLERK_CLIENT_PATH = `${CLERK_BASE_PATH}/client`;

export const CLERK_SIGN_IN_PATH = `${CLERK_CLIENT_PATH}/sign_ins`;
export const CLERK_SESSIONS_PATH = `${CLERK_CLIENT_PATH}/sessions`;

export const getClerkSessionPath = (session: string): string =>
  `${CLERK_SESSIONS_PATH}/${session}`;

export const getClerkTokenPath = (session: string): string =>
  `${getClerkSessionPath(session)}/tokens`;

export const getClerkTouchPath = (session: string): string =>
  `${getClerkSessionPath(session)}/touch`;

export type ClerkRequestResponse<RES> =
  | {
      response: RES | null;
      client: ClerkClient | null;
    }
  | {
      errors: ClerkError[];
      clerk_trace_id?: string;
    };

type ClerkError = {
  message: string;
  long_message: string;
  code: string;
};

export type ClerkClient = {
  object: 'client';
  id: string;
  sessions: ClerkSession[];
  sign_in: ClerkSignInAttempt | null;
  sign_up: ClerkSignUpAttempt | null;
  last_active_session_id: string | null;
  created_at: number;
  updated_at: number;
};

export type ClerkSession = {
  object: 'session';
  id: string;
  status: string;
  expire_at: number;
  abandon_at: number;
  last_active_at: number;
  last_active_organization_id: unknown | null;
  actor: unknown | null;
  user: ClerkUser;
  public_user_data: ClerkPublicUserData;
  created_at: number;
  updated_at: number;
  last_active_token: ClerkToken;
};

type ClerkUser = {
  id: string;
  object: 'user';
  username: string | null;
  first_name: string;
  last_name: string;
  image_url: string;
  has_image: boolean;
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  email_addresses: ClerkEmailAddress[];
  phone_numbers: unknown[];
  web3_wallets: unknown[];
  passkeys: unknown[];
  external_accounts: ClerkExternalAccount[];
  saml_accounts: unknown[];
  public_metadata: unknown;
  unsafe_metadata: unknown;
  external_id: unknown;
  last_sign_in_at: number;
  banned: boolean;
  locked: boolean;
  lockout_expires_in_seconds: number | null;
  verification_attempts_remaining: number;
  created_at: number;
  updated_at: number;
  delete_self_enabled: boolean;
  create_organization_enabled: boolean;
  last_active_at: number;
  profile_image_url: string;
  organization_memberships: unknown[];
};

type ClerkEmailAddress = {
  id: string;
  object: 'email_address';
  email_address: string;
  reserved: boolean;
  verification: ClerkFactorVerification;
  linked_to: ClerkLink[];
  created_at: number;
  updated_at: number;
};

type ClerkExternalAccount = {
  object: 'external_account';
  id: string;
  provider: string;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  username: string;
  public_metadata: unknown;
  label: unknown | null;
  created_at: number;
  updated_at: number;
  verification: ClerkFactorVerification;
  image_url?: string;
};

type ClerkLink = {
  type: string;
  id: string;
};

type ClerkPublicUserData = {
  first_name: string;
  last_name: string;
  image_url: string;
  has_image: boolean;
  identifier: string;
  profile_image_url: string;
};

export type ClerkToken = {
  object: 'token'
  jwt: string;
};

export type ClerkSignInAttempt = {
  object: 'sign_in_attempt';
  id: string;
  status: string;
  supported_identifiers: unknown[];
  supported_first_factors: ClerkSignFactor[];
  supported_second_factors: ClerkSignFactor[] | null;
  first_factor_verification: ClerkFactorVerification | null;
  second_factor_verification: ClerkFactorVerification | null;
  identifier: unknown | null;
  user_data: unknown | null;
  created_session_id: unknown | null;
  abandon_at: number;
};

type ClerkSignFactor = {
  strategy: string;
};

type ClerkFactorVerification = {
  status: string;
  strategy: string;
  attempts: unknown | null;
  expire_at: number | null;
  external_verification_redirect_url?: string;
  error?: ClerkError;
};

export type ClerkSignUpAttempt = {
  object: 'sign_up_attempt';
  id: string;
  status: string;
  required_fields: string[];
  optional_fields: string[];
  missing_fields: string[];
  unverified_fields: unknown[];
  verifications: ClerkSignUpVerifications;
  username: unknown | null;
  email_address: unknown | null;
  phone_number: unknown | null;
  web3_wallet: unknown | null;
  password_enabled: boolean;
  first_name: unknown | null;
  last_name: unknown | null;
  unsafe_metadata: unknown;
  public_metadata: unknown;
  custom_action: boolean;
  external_id: unknown;
  created_session_id: unknown | null;
  created_user_id: unknown | null;
  abandon_at: number;
};

type ClerkSignUpVerifications = {
  email_address: unknown | null;
  phone_number: unknown | null;
  web3_wallet: unknown | null;
  external_account: ClerkFactorVerification;
};
