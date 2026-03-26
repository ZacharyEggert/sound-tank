

/*

Find your Active Offers

curl -XGET 
-H "Content-Type: application/hal+json" 
-H "Accept: application/hal+json" 
-H "Accept-Version: 3.0" 
-H "Authorization: Bearer [personal_token]" 
https://api.reverb.com/api/my/listings/negotiations

 */

/*

Get the details of an individual Offer

curl -XGET 
-H "Content-Type: application/hal+json" 
-H "Accept: application/hal+json" 
-H "Accept-Version: 3.0" 
-H "Authorization: Bearer [personal_token]"
https://api.reverb.com/api/my/negotiations/[offer_id]

 */

import { HttpClient, HttpResponse } from '../../http';
import { ReverbConfig } from '../../config/ReverbConfig';
import { Negotiation, ListingWithNegotiations, PaginatedReverbResponse } from '../../types';
import { buildUrlWithQuery, buildUrl } from '../../utils';

export interface GetNegotiationsOptions {
	page?: number;
	perPage?: number;
	status?: 'active' | 'active_for_seller' | 'all';
	negotiation_type?: 'standard' | 'auto_push_offer';
}

export const getNegotiations = async (
	client: HttpClient,
	config: ReverbConfig,
	options: GetNegotiationsOptions,
): Promise<HttpResponse<PaginatedReverbResponse<{ listings: ListingWithNegotiations[] }>>> => {
	const { page, perPage, status, negotiation_type } = options;

	const url = buildUrlWithQuery(buildUrl(config.rootEndpoint, '/my/listings/negotiations'), {
		page,
		per_page: perPage,
		status,
		negotiation_type,
	});

	return client.get<PaginatedReverbResponse<{ listings: ListingWithNegotiations[] }>>(url, {
		headers: config.headers,
	});
};

export const getNegotiation = async (
	client: HttpClient,
	config: ReverbConfig,
	offerId: number,
): Promise<HttpResponse<Negotiation>> => {
	const url = buildUrl(config.rootEndpoint, `/my/negotiations/${offerId}`);

	return client.get<Negotiation>(url, {
		headers: config.headers,
	});
};
