import Text "mo:base/Text";
// import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Nat16 "mo:base/Nat16";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import T "types";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/Source";
import XorShift "mo:rand/XorShift";
actor class Emailer(courierApiKey : Text) {
  private var _courierApiKey = courierApiKey;

  public func sendEmail(to : Text, title : Text, content : Text) : async {
    #Ok : Text;
    #Err : Text;
  } {
    let rr = XorShift.toReader(XorShift.XorShift64(null));
	  let c : [Nat8] = [0, 0, 0, 0, 0, 0]; // Replace with identifier of canister f.e.et g = Source.Source();
    let g = Source.Source(rr, c);
    let id = g.new();
    Debug.print(UUID.toText(id));
    Debug.print(_courierApiKey);
    let request_headers = [
      { name = "User-Agent"; value = "exchange_rate_canister" },
      {
        name = "Authorization";
        value = "Bearer " # _courierApiKey;
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
      // Cycles.add(250_126_800_000);
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

  public query func transform(raw : T.CanisterHttpResponsePayload) : async T.CanisterHttpResponsePayload {
    let transformed : T.CanisterHttpResponsePayload = {
      status = raw.status;
      body = raw.body;
      headers = [];
    };
    transformed;
  };

};
