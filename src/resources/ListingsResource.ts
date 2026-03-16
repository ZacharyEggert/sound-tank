import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  getMyListings,
  getAllMyListings,
  getOneListing,
  GetMyListingsOptions,
  GetAllMyListingsOptions,
  GetOneListingOptions,
} from '~/methods/listings/getListings';
import { postListing } from '~/methods/listings/postListing';
import { ListingPostBody } from '~/types';

export class ListingsResource {
  constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

  getMy(options: GetMyListingsOptions = {}) {
    return getMyListings(this.getClient(), this.getConfig(), options);
  }

  getOne(options: GetOneListingOptions) {
    return getOneListing(this.getClient(), this.getConfig(), options);
  }

	async getPhotos(options: GetOneListingOptions) {
		const response = await getOneListing(this.getClient(), this.getConfig(), options);
		const photos = response.data?.photos?.map(photo => photo._links.full.href) || [];
		return photos;
	}


  getAllMy(options: GetAllMyListingsOptions = {}) {
    return getAllMyListings(this.getClient(), this.getConfig(), options);
  }

  create(body: ListingPostBody) {
    return postListing(this.getClient(), this.getConfig(), body);
  }
}
