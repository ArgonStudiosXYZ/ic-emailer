# IC Emailer

This example showcases how you can use http outcalls to call a 3rd party provider [Courier](https://www.courier.com/docs/guides/getting-started/nodejs/).

**_Why Courier_**

Due to the implementation of [https outcalls](https://internetcomputer.org/docs/current/developer-docs/integrations/http_requests/) sending a request from each replica, idempotency was key to not sending duplicate emails. Courier provides an ability to pass an [idempotency key](https://www.courier.com/docs/reference/idempotent-requests/#:~:text=An%20idempotency%20key%20is%20a,enough%20entropy%20to%20avoid%20collisions.). Courier can connect to one of your email providers and send an email on your behalf.

To learn more before you start working with IC, see the following documentation available online:

**_How this example works_**
This example includes four containers:

- A frontend container containing a react application used to register api key and a form to send an email request to courier.
- Along side the front end canister an instance of the [internet identiy](https://github.com/dfinity/internet-identity) container is provided to authenticate against.
- A backend Motoko canister is included to handle registering an api key against a user, and calling the courier api.
- Another backend cansiter to demonstrate canister to canister calls

After authenticating with internet identity using [easy-to-use library (agent-js)](https://github.com/dfinity/agent-js), requests sent to the backend container can access the calling principal. Calling the `registerKey` function passing the courier api will extract the principal id and store it in a hashmap `userKeyMap` with the key `userId` => `courierApiKey`.

Using this [library](https://github.com/aviate-labs/uuid.mo) to generate a uuid to be used as an idempotency key sent to courier.

## Prerequisites

**DFX**
Version 12 is required for http outcalls

```bash
DFX_VERSION=0.12.0-beta.3 sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

```

**Vessel**
Vessel is a package manager for ic canisters.
Follow the instructions [here](https://github.com/dfinity/vessel) to install the vessel binary.

**Courier**
Sign up with courier and connect one of your email providers.

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Deploys your canisters to the replica and generates your candid interface
./scripts/deploy.sh local
```

Once the job completes, your application will be available at `http://localhost:8000?canisterId={asset_canister_id}`. There will be a link in the terminal to open the frontend canister.

### Steps to test flow

1. Press the `open with internet identity` button on the home page.
2. It should open a new tab pointing to `http://localhost:8000/?canisterId={ii_canister_id}#authorize`. This is the local II container we spun up.
3. Create a new anchor.
4. Authorize app with this new anchor id
5. Set the courier api key you fetched from [here](https://app.courier.com/settings/api-keys)
6. Send an email to a test address with a recipient, subject and body.

Additionally, if you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 8000.

### Example of canister to canister calls

This example includes a canister that demonstrates canister to canister calls.

1. Register the api key with:

```
dfx canister call canister_to_canister_backend registerKey '("key")'
```

It will the identity currently set in your local dfc installation

Check with

```
dfx identity whoami

```

If you want to try with a different user you can create a new identity

```
dfx identity create email_user
```

Set dfx to use this new user

```
dfx identity use email_user
```

2. Send an email

```
 dfx canister call canister_to_canister_backend sendEmail '("test@test.com", "cool subject", "this is the body")'
```
