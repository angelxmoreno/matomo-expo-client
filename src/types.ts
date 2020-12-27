// @SuppressWarnings("SpellCheckingInspection")

export type RequiredParams = {
    idsite: number;
    rec: 1;
};

export interface RecommendedParams {
    // The title of the action being tracked. It is possible to use slashes / to set one or several categories for this
    // action. For example, Help / Feedback will create the Action Feedback in the category Help.
    action_name?: string;
    url?: string;

    // The unique visitor ID, must be a 16 characters hexadecimal string. Every unique visitor must be assigned a
    // different ID and this ID must not change after it is assigned.
    _id?: number | string;

    // Meant to hold a random value that is generated before each request. Using it helps avoid the tracking request
    // being cached by the browser or a proxy.
    rand?: string;
    apiv?: 1;
}

export type UserParams = {
    urlref?: string;

    // Visit scope custom variables. This is a JSON encoded string of the custom variable array
    /*
    {"1":["OS","iphone 5.0"],"2":["Matomo Mobile Version","1.6.2"],"3":["Locale","en::en"],"4":["Num Accounts","2"]}
     */
    _cvar?: Record<string, unknown>;

    // the current count of visits for this visitor.
    _idvc?: number;

    // The UNIX timestamp of this visitor's previous visit
    _viewts?: Date;

    // The UNIX timestamp of this visitor's first visit
    _idts?: Date;

    // The Campaign name
    _rcn?: string;

    // The Campaign Keyword
    _rck?: string;

    // The resolution of the device the visitor is using, eg 1280x1024
    res?: string;

    // The current hour (local time)
    h?: number;

    // The current minute (local time)
    m?: number;

    // The current seconds (local time)
    s?: number;

    // An override value for the User-Agent HTTP header field. The user agent is used to detect the operating system and browser used.
    ua?: string;

    // An override value for the Accept-Language HTTP header field
    lang?: string;

    // the User ID for this request
    uid?: string;

    // visitor ID for this request
    cid?: string;
};

export type ActionParams = {
    // Page scope custom variables. This is a JSON encoded string of the custom variable array
    /*
   {"1":["OS","iphone 5.0"],"2":["Matomo Mobile Version","1.6.2"],"3":["Locale","en::en"],"4":["Num Accounts","2"]}
    */
    cvar?: Record<string, unknown>;

    // The Site Search keyword. When specified, the request will not be tracked as a normal pageview but will instead be
    // tracked as a Site Search request.
    search?: string;

    // when search is specified, a search category with this parameter.
    search_cat?: string;

    // when search is specified, the number of search results displayed on the results page
    search_count?: string;

    // Accepts a six character unique ID that identifies which actions were performed on a specific page view. When a
    // page was viewed, all following tracking requests (such as events) during that page view should use the same
    // pageview ID. Once another page was viewed a new unique ID should be generated. Use [0-9a-Z] as possible
    // characters for the unique ID.
    pv_id?: string;

    // If specified, the tracking request will trigger a conversion for the goal of the website being tracked with this
    // ID
    idgoal?: string;

    //  A monetary value that was generated as revenue by this goal conversion. Only used if idgoal is specified in the
    //  request.
    revenue?: number;

    // The amount of time it took the server to generate this action, in milliseconds.
    gt_ms?: number;

    // The charset of the page being tracked
    cs?: string;
};

export type EventTrackingParams = {
    // The event category
    e_c: string;

    // The event action
    e_a: string;

    // The event name
    e_n?: string;

    // the event value
    e_v?: number;
};

export type ContentTrackingParams = {
    // The name of the content
    c_n: string;

    // The actual content piece
    c_p?: string;

    // The target of the content
    c_t?: string;

    // The name of the interaction with the content
    c_i?: string;
};

export type EcommerceItem = {
    sku?: string;
    name?: string;
    category?: string;
    price?: string;
    quantity?: string;
};

export interface EcommerceParams {
    idgoal: 0;
    ec_id?: string;
    ec_items?: EcommerceItem[];
    revenue?: number;
    ec_st?: number;
    ec_tx?: number;
    ec_sh?: number;
    ec_dt?: number;
    _ects?: string;
}

export interface EcommerceOrderParams extends EcommerceParams {
    ec_id?: string;
    ec_items: EcommerceItem[];
    revenue: number;
}

interface RequestParams extends RequiredParams, RecommendedParams, UserParams {}

export interface ActionRequestParams extends RequestParams, ActionParams {}

export interface EventRequestParams extends RequestParams, EventTrackingParams {}

export interface ContentRequestParams extends RequestParams, ContentTrackingParams {}

export interface EcommerceRequestParams extends RequestParams, EcommerceParams {}

export interface EcommerceOrderRequestParams extends RequestParams, EcommerceOrderParams {}

export type ValidRequestParams =
    | ActionRequestParams
    | EventRequestParams
    | ContentRequestParams
    | EcommerceRequestParams
    | EcommerceOrderRequestParams;

export interface BaseMatomoExpoParams {
    idsite: number;
    serverUrl: string;
    enabled: boolean;
    log: boolean;
    userParams?: UserParams;
}
