#!/bin/bash

# Call the script with deploy.sh {network}
if [[ $# -lt 2 ]]; then
    echo "Number of arguments supplied not correct. Call this script: \
    ./deploy.sh {env} {courierApiKey} \
    env should be one of the networks configured in dfx.json."
    exit 1
fi


ENV=$1
COURIER_API_KEY=$2

bash ./scripts/cleanup.sh $ENV

npm install

if [[ $ENV == "local" ]]; then

    # Check DFX version
    version=$(dfx -V | sed 's/dfx\ //g' | sed 's/-.*$//g')
    if [[ "$version" < "0.12.0" ]]; then
        echo "dfx 0.12.0 or above required. Please do: dfx upgrade"
        exit 1
    fi
    
    # Start local replica
    dfx start --background
fi

# Deploy exchange_rate and exchange_rate_assets
dfx deploy  --argument "(\"${COURIER_API_KEY}\")" --network "$ENV"
