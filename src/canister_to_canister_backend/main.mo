import Emailer "canister:emailer_backend"

actor CanisterToCanister {

    public shared func registerKey(key : Text) : async () {
        return await Emailer.registerKey(key);
    };

    public shared func sendEmail(to : Text, title : Text, content : Text) : async {
        #Ok : Text;
        #Err : Text;
    } {
        return await Emailer.sendEmail(to, title, content);
    };

};
