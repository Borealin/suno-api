import { CLERK_ENVIROMENT_PATH } from './net.js';
type Enviroment = {
  auth_config: AuthConfig;
  display_config: DisplayConfig;
  user_settings: UserSettings;
  organization_settings: OrganizationSettings;
};

type AuthConfig = {
  object: 'auth_config';
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  username: string;
  password: string;
  identification_requirements: string[][];
  identification_strategies: string[];
  first_factors: string[];
  second_factors: string[];
  email_address_verification_strategies: string[];
  single_session_mode: boolean;
  enhanced_email_deliverability: boolean;
  test_mode: boolean;
  cookieless_dev: boolean;
  url_based_session_syncing: boolean;
  demo: boolean;
};

type DisplayConfig = {
  object: 'display_config';
  id: string;
  instance_environment_type: string;
  application_name: string;
  theme: {
    buttons: {
      font_color: string;
      font_family: string;
      font_weight: string;
    };
    general: {
      color: string;
      padding: string;
      box_shadow: string;
      font_color: string;
      font_family: string;
      border_radius: string;
      background_color: string;
      label_font_weight: string;
    };
    accounts: {
      background_color: string;
    };
  };
  preferred_sign_in_strategy: string;
  logo_image_url: string;
  favicon_image_url: string;
  home_url: string;
  sign_in_url: string;
  sign_up_url: string;
  user_profile_url: string;
  after_sign_in_url: string;
  after_sign_up_url: string;
  after_sign_out_one_url: string;
  after_sign_out_all_url: string;
  after_switch_session_url: string;
  organization_profile_url: string;
  create_organization_url: string;
  after_leave_organization_url: string;
  after_create_organization_url: string;
  logo_link_url: string;
  support_email: string;
  branded: boolean;
  experimental_force_oauth_first: boolean;
  clerk_js_version: string;
  captcha_public_key: string;
  logo_url: string;
  favicon_url: string;
  logo_image: Image;
  favicon_image: Image;
};

type Image = {
  object: 'image';
  id: string;
  public_url: string;
};

type UserSettings = {
  attributes: Record<string, Attribute>;
  social: Record<string, Social>;
  saml: {
    enabled: boolean;
  };
  sign_in: {
    second_factor: {
      required: boolean;
    };
  };
  sign_up: {
    captcha_enabled: boolean;
    custom_action_required: boolean;
    progressive: boolean;
  };
  restrictions: {
    allowlist: {
      enabled: boolean;
    };
    blocklist: {
      enabled: boolean;
    };
    block_email_subaddresses: {
      enabled: boolean;
    };
    block_disposable_email_domains: {
      enabled: boolean;
    };
  };
  actions: {
    delete_self: boolean;
    create_organization: boolean;
  };
  attack_protection: {
    user_lockout: {
      enabled: boolean;
      max_attempts: number;
      duration_in_minutes: number;
    };
    pii: {
      enabled: boolean;
    };
  };
  passkey_settings: {
    allow_autofill: boolean;
    show_sign_in_button: boolean;
  };
  password_settings: {
    disable_hibp: boolean;
    min_length: number;
    max_length: number;
    require_special_char: boolean;
    require_numbers: boolean;
    require_uppercase: boolean;
    require_lowercase: boolean;
    show_zxcvbn: boolean;
    min_zxcvbn_strength: number;
    enforce_hibp_on_sign_in: boolean;
    allowed_special_characters: string;
  };
};

type Attribute = {
  enabled: boolean;
  required: boolean;
  used_for_first_factor: boolean;
  first_factors: string[];
  used_for_second_factor: boolean;
  second_factors: string[];
  verifications: string[];
  verify_at_sign_up: boolean;
};

type Social = {
  enabled: boolean;
  required: boolean;
  authenticatable: boolean;
  block_email_subaddresses: boolean;
  strategy: string;
  not_selectable: boolean;
  deprecated: boolean;
};

type OrganizationSettings = {
  enabled: boolean;
  max_allowed_memberships: number;
  actions: {
    admin_delete: boolean;
  };
  domains: {
    enabled: boolean;
    enrollment_modes: string[];
    default_role: string;
  };
  creator_role: string;
};

let _environment: Enviroment | null = null;

export const getEnvironment = async (): Promise<Enviroment | null> => {
  try {
    if (!_environment) {
      const response = await fetch(CLERK_ENVIROMENT_PATH, { method: 'GET' });
      _environment = (await response.json()) as Enviroment;
    }
    return _environment;
  } catch (error) {
    console.error('Error getting environment:', error);
    return null;
  }
};
