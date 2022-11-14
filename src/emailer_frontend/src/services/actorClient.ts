/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the whoami canister to check the user's principal.
 */
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { createActor } from "../../../declarations/emailer_backend";
import { _SERVICE as Emailer } from "../../../declarations/emailer_backend/emailer_backend.did";
import { authManager } from "./authClient";

export class ActorClient {
  private webapp: Emailer;

  private authenticate() {
    if(!this.webapp) {
        // At this point we're authenticated, and we can get the identity from the auth client:
        const identity = authManager.getIdentity();

        console.log({identity})
        // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
        const agent = new HttpAgent({ identity });
      
        this.webapp = createActor(process.env.REACT_APP_EMAILER_BACKEND_CANISTER_ID, {
          agent
        } as any) // this type seems to be broken
    }
  }

  public async whoami() {
    await this.authenticate();
    return this.webapp.whoami();
  }

  public async hasKeyRegistered() {
    await this.authenticate();
    return this.webapp.hasKeyRegistered();
  }

  public async registerKey(key: string) {
    await this.authenticate();
    return this.webapp.registerKey(key);
  }

  public async sendEmail(recipent: string, subject: string, body: string) {
    await this.authenticate();
    return this.webapp.sendEmail(recipent,subject, body);
  }

  public async removeKey() {
    await this.authenticate();
    return this.webapp.removeKey();
  }
}

export const actorClient = new ActorClient();