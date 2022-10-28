module {
    public type HeaderField = (Text, Text);

    public type HttpResponse = {
        status : Nat;
        headers : [HttpHeader];
        body : [Nat8];
    };

    public type HttpMethod = {
        #get;
        #post;
        #head;
    };

    public type HttpHeader = {
        name : Text;
        value : Text;
    };

    public type HttpRequest = {
        url : Text;
        headers : [HttpHeader];
        body : [Nat8];
        method : HttpMethod;
    };

    public type IC = actor {
        http_request : HttpRequest -> async HttpResponse;
    };

    public type CanisterHttpResponsePayload = {
        status : Nat;
        headers : [HttpHeader];
        body : Text;
    };

};
