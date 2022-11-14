import Text "mo:base/Text";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Nat16 "mo:base/Nat16";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import T "types";
import Source "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";
import Bool "mo:base/Bool";
import M "mo:base/HashMap";
import Principal "mo:base/Principal";

actor Emailer {
  private var userKeyMap = M.HashMap<Principal, Text>(10, Principal.equal, Principal.hash);

  public shared ({ caller }) func sendEmail(to : Text, title : Text, content : Text) : async {
    #Ok : Text;
    #Err : Text;
  } {

    var _courierApiKey = switch (userKeyMap.get(caller)) {
      case null {
        return #Err("Unable to find api key");
      };
      case (?e) e;
    };

    let g = Source.Source();
    let idempotencyKey = UUID.toText(await g.new());

    let request_headers = [
      { name = "User-Agent"; value = "exchange_rate_canister" },
      {
        name = "Authorization";
        value = "Bearer " # _courierApiKey;
      },
      {
        name = "Idempotency-Key";
        value = idempotencyKey;
      },
    ];
    let request : T.HttpRequest = {
      url = "https://api.courier.com/send";
      max_response_bytes = 1204;
      headers = request_headers;
      body = Blob.toArray(Text.encodeUtf8(buildBody(to, title, content)));
      method = #post;
      transform = #function(transform);
    };

    try {
      Cycles.add(220_000_000_000);
      let ic : T.IC = actor ("aaaaa-aa");
      let response = await ic.http_request(request);
      switch (Text.decodeUtf8(Blob.fromArray(response.body))) {
        case null {
          #Err("Remote response had no body.");
        };
        case (?body) {
          var headers : Text = "";
          for (header in response.headers.vals()) {
            headers := headers # header.name # ": " # header.value # ";";
          };
          if (response.status >= 200 and response.status <= 299) {
            #Ok("Body: " # body # "; Status: " # Nat.toText(response.status));
          } else {
            #Err("Invalid error status error: " # debug_show response.status # " body:" # body);
          }

        };
      };
    } catch (err) {
      #Err(Error.message(err));
    };
  };

  private func buildBody(to : Text, title : Text, content : Text) : Text {
    return "{\"message\": {\"to\": {\"email\":\"" # to # "\"},\"content\": {\"title\": \"" # title # "\",\"body\": \"" # content # "\"}}}";
  };

  private func transform(raw : T.CanisterHttpResponsePayload) : async T.CanisterHttpResponsePayload {
    let transformed : T.CanisterHttpResponsePayload = {
      status = raw.status;
      body = raw.body;
      headers = [];
    };
    transformed;
  };

  public query ({ caller }) func whoami() : async Principal {
    return caller;
  };

  public query ({ caller }) func hasKeyRegistered() : async Bool {
    switch (userKeyMap.get(caller)) {
      case null {
        return false;
      };
      case (?e) true;
    };
  };

  public shared ({ caller }) func registerKey(key : Text) : async () {
    Debug.print("Registering key: " # key # "with caller " # debug_show caller);
    userKeyMap.put(caller, key);
  };

  public shared ({ caller }) func removeKey() : async () {
    userKeyMap.delete(caller);
  };

};
