/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the whoami canister to check the user's principal.
 */
import { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

export class AuthManager {
  private authClient: AuthClient;
  private iiUrl;

  constructor() {
    if (process.env.REACT_APP_DFX_NETWORK === "local") {
      this.iiUrl = `http://localhost:8000/?canisterId=${process.env.REACT_APP_INTERNET_IDENTITY_CANISTER_ID}`;
    } else if (process.env.REACT_APP_DFX_NETWORK === "ic") {
      this.iiUrl = `https://${process.env.REACT_APP_INTERNET_IDENTITY_CANISTER_ID}.ic0.app`;
    } else {
      this.iiUrl = `https://${process.env.REACT_APP_INTERNET_IDENTITY_CANISTER_ID}.dfinity.network`;
    }
  }

  public async login() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
  
    try {
      return this.authClient.login({
        identityProvider: this.iiUrl,
      });
    } catch (error) {
      console.error(error)
    }
  }

  public async logout() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }

    try {
      return this.authClient.logout();
    } catch (error) {
      console.error(error)
    }
  }


  public async getIdentity(): Promise<Identity> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
    console.log(await this.authClient.getIdentity());
    return this.authClient.getIdentity();

    
  }

}

export const authManager = new AuthManager();

