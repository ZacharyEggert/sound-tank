export type Link = {
  href: string;
  method?: 'PUT' | 'POST' | 'GET' | Exclude<string, 'PUT' | 'POST' | 'GET'>;
};

export type ShippingRate = {
  region_code: string;
  rate: Price;
  carrier_calculated: boolean;
  regional: boolean;
  destination_postal_code_needed: boolean;
};

export type ListingStateSlug =
  | 'sold'
  | 'live'
  | Exclude<string, 'sold' | 'live'>;

export type ListingState = {
  slug: ListingStateSlug;
  description: string;
};

export type ListingStats = {
  views: number;
  watches: number;
};

export type ConditionDisplayName =
  | 'Excellent'
  | 'New'
  | 'B-Stock'
  | 'Very Good'
  | 'Good'
  | 'Fair'
  | 'Poor'
  | Exclude<
      string,
      'Excellent' | 'New' | 'B-Stock' | 'Very Good' | 'Good' | 'Fair' | 'Poor'
    >;

export type ListingCondition = {
  uuid: string;
  displayName: ConditionDisplayName;
};

export type ListingShipping = {
  local: boolean;
  rates: ShippingRate[];
  user_region_rate: ShippingRate;
  initial_offer_rate: ShippingRate;
};

export type ListingLinks = {
  photo: Link;
  self: Link;
  update: Link;
  end: Link;
  want: Link;
  unwant: Link;
  edit: Link;
  web: Link;
  make_offer: Link;
  cart: Link;
};

export type Category = {
  uuid: string;
  full_name: string;
};

export type CurrencyCode = string;
export type CurrencySymbol = '$' | Exclude<string, '$'>;

export type Price = {
  amount: `${number}.${number}` | `${number}`;
  amount_cents: number;
  currency: CurrencyCode;
  symbol: CurrencySymbol;
  display: string;
  tax_included_hint?: string;
  tax_included?: boolean;
  tax_included_rate?: number;
};

export type PhotoLinks = {
  large_crop: Link;
  small_crop: Link;
  full: Link;
  thumbnail: Link;
};

export type Listing = {
  id: number | string;
  make: string;
  model: string;
  finish: string;
  year: string;
  title: string;
  created_at: ReturnType<typeof Date.toString>;
  shop_name: string;
  description: string;
  condition: ListingCondition;
  price: Price;
  inventory: number;
  has_inventory: boolean;
  offers_enabled: boolean;
  auction: boolean;
  categories: Category[];
  listing_currency: string;
  published_at: ReturnType<typeof Date.toString>;
  buyer_price: Price;
  seller_price: Price;
  state: ListingState;
  shipping_profile_id: number;
  shipping: ListingShipping;
  stats: ListingStats;
  slug: string;
  photos: { _links: PhotoLinks }[];
  _links: ListingLinks;
};

export type ListingPostBody = {
  make: string;
  model: string;
  categories: {
    uuid: string; // get these values from /api/categories/flat
  }[];
  condition: {
    uuid: string; // get these from /api/listing_conditions
  };
  photos: string[];
  videos: [
    {
      link: string;
    },
  ];
  description: string;
  finish: string;
  price: {
    amount: string; // amount in XX.XX format
    currency: string; // USD, GBP, EUR, etc.
  };
  title: string;
  year: string;
  sku: string;
  upc: string; // this string value can also be an EAN
  upc_does_not_apply: `${boolean}`; // use 'true' in cases where the item does not come with a UPC
  has_inventory: boolean;
  inventory: number;
  offers_enabled: boolean; // can be either true or false
  handmade: boolean;
  shipping_profile_id?: string; // enter your shipping profile here instead of shipping rates if applicable
  shipping?: {
    // only use this if not using shipping profiles
    rates: {
      rate: {
        amount: string;
        currency: string;
      };
      region_code: string; // Continental US
    }[];
    // {
    //   rate: {
    //     amount: string;
    //     currency: string;
    //   };
    //   region_code: 'XX'; // Everywhere Else
    // },
    local: boolean;
  };
};

export type OrderStatus =
  | 'unpaid'
  | 'awaiting_shipment'
  | 'shipped'
  | Exclude<string, 'unpaid' | 'awaiting_shipment' | 'shipped'>;

export type ShippingProvider =
  | 'UPS'
  | 'USPS'
  | 'FedEx'
  | 'DHL Deutschland'
  | 'DHLExpress'
  | 'DHLGlobalMail'
  | 'DHL'
  | 'Canada Post'
  | 'CanPar'
  | 'Royal Mail'
  | 'PostNL'
  | 'Australia Post'
  | 'EMS'
  | 'La Poste - Colissimo'
  | 'China Post'
  | 'GLS'
  | 'Parcelforce'
  | 'Purolator'
  | 'Interlogistica'
  | 'Correos España'
  | 'Ukraine Post'
  | 'DPD Germany'
  | 'DPD UK'
  | 'DPD France'
  | 'Hermes'
  | 'TNT'
  | 'Other';

export type OrderTaxResponsibleParty = 'reverb' | Exclude<string, 'reverb'>;
export type OrderShippingMethod = 'shipped' | Exclude<string, 'shipped'>;
export type OrderShipmentStatus = 'in_transit' | Exclude<string, 'in_transit'>;
export type OrderType = 'offer' | Exclude<string, 'offer'>;
export type OrderSource = 'reverb' | Exclude<string, 'reverb'>;

export type Order = {
  amount_product: Price;
  presentment_amount_product: Price;
  amount_product_subtotal: Price;
  presentment_amount_product_subtotal: Price;
  shipping: Price;
  presentment_amount_shipping: Price;
  amount_tax: Price;
  presentment_amount_tax: Price;
  total: Price;
  presentment_amount_total: Price;
  shipping_taxed: boolean;
  buyer_name: string;
  buyer_first_name: string;
  buyer_email: string;
  buyer_last_name: string;
  buyer_id: number | string;
  created_at: ReturnType<typeof Date.toString>;
  order_number: number | string;
  tax_rate: number;
  order_source: OrderSource;
  needs_feedback_for_buyer: boolean;
  needs_feedback_for_seller: boolean;
  order_type: OrderType;
  paid_at: ReturnType<typeof Date.toString>;
  quantity: number;
  shipping_address: ShippingAddress;
  shipping_date: ReturnType<typeof Date.toString>;
  shipped_at: ReturnType<typeof Date.toString>;
  shipping_provider: ShippingProvider;
  shipping_code: string;
  shipping_method: OrderShippingMethod;
  shipment_status: OrderShipmentStatus;
  local_pickup: boolean;
  shop_name: string;
  status: OrderStatus;
  title: string;
  updated_at: ReturnType<typeof Date.toString>;
  payment_method: string;
  order_bundle_id: number | string;
  product_id: number | string;
  uuid: string;
  photos: { _links: PhotoLinks }[];
  selling_fee: Price;
  bump_fee: Price;
  direct_checkout_fee: Price;
  tax_on_fees: Price;
  tax_responsible_party: OrderTaxResponsibleParty;
  direct_checkout_payout: Price;
  order_notes: any[];
  _links: OrderLinks;
};

export type OrderLinks = {
  photo: Link;
  feedback_for_buyer: Link;
  feedback_for_seller: Link;
  listing: Link;
  start_conversation: Link;
  web_tracking: Link;
  web: Link;
  web_listing: Link;
  self: Link;
  mark_picked_up: Link;
  payments: Link;
  contact_buyer: { web: Link };
};

export type ShippingAddress = {
  region: string;
  locality: string;
  country_code: string;
  display_location: string;
  id: number | string;
  primary: boolean;
  name: string;
  street_address: string;
  extended_address: string;
  postal_code: string;
  phone: string;
  unformatted_phone: string;
  complete_shipping_address: boolean;
  _links: { self: Link };
};
