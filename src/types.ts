export type Link = {
  href: string;
  method?: 'PUT' | 'POST' | 'GET' | Exclude<string, 'PUT' | 'POST' | 'GET'>;
};

type ShippingRate = {
  region_code: string;
  rate: Price;
  carrier_calculated: boolean;
  regional: boolean;
  destination_postal_code_needed: boolean;
};

type ListingStateSlug = 'sold' | 'live' | Exclude<string, 'sold' | 'live'>;

type ListingState = {
  slug: ListingStateSlug;
  description: string;
};

type ListingStats = {
  views: number;
  watches: number;
};

type ConditionDisplayName =
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

type ListingCondition = {
  uuid: string;
  displayName: ConditionDisplayName;
};

type ListingShipping = {
  local: boolean;
  rates: ShippingRate[];
  user_region_rate: ShippingRate;
  initial_offer_rate: ShippingRate;
};

type ListingLinks = {
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

type Category = {
  uuid: string;
  full_name: string;
};

type CurrencyCode = string;
type CurrencySymbol = '$' | Exclude<string, '$'>;

type Price = {
  amount: `${number}.${number}` | `${number}`;
  amount_cents: number;
  currency: CurrencyCode;
  symbol: CurrencySymbol;
  display: string;
  tax_included_hint?: string;
  tax_included?: boolean;
  tax_included_rate?: number;
};

type PhotoLinks = {
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
