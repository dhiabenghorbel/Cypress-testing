// Define an interface for the environment variables

export type SupportedLanguages = "en" | "fr" | "es" | "it" | "de" | "ne" | "be";
export type LoginModules = "ldapLoginModule" | "standardLoginModule";

interface Env {
  CYPRESS_AUTH_USERNAME: string;
  CYPRESS_AUTH_PASSWORD: string;
  CYPRESS_LANGUAGE: SupportedLanguages;
  CYPRESS_LOGIN_MODULE: LoginModules;
  CYPRESS_API_BASE_URL: string;
}

// Retrieve the environment variables from the .env file
const env: Env = Cypress.env() as any;


// Export the environment variables object
export { env };
