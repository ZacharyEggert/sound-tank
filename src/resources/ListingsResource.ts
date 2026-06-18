import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  getMyListings,
  getAllMyListings,
  streamAllMyListings,
  getOneListing,
  getDrafts,
  getAllDrafts,
  streamAllDrafts,
  GetMyListingsOptions,
  GetAllMyListingsOptions,
  GetOneListingOptions,
  GetDraftsOptions,
  GetAllDraftsOptions,
} from '~/methods/listings/getListings';
import { postListing } from '~/methods/listings/postListing';
import { updateListing } from '~/methods/listings/updateListing';
import { endListing, deleteListing } from '~/methods/listings/endListing';
import { ListingPostBody, ListingUpdateBody, EndListingReason } from '~/types';

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
    const response = await getOneListing(
      this.getClient(),
      this.getConfig(),
      options,
    );
    const photos =
      response.data?.photos?.map((photo) => photo._links.full.href) || [];
    return photos;
  }

  getAllMy(options: GetAllMyListingsOptions = {}) {
    return getAllMyListings(this.getClient(), this.getConfig(), options);
  }

  streamAllMy(options: GetAllMyListingsOptions = {}) {
    return streamAllMyListings(this.getClient(), this.getConfig(), options);
  }

  getDrafts(options: GetDraftsOptions = {}) {
    return getDrafts(this.getClient(), this.getConfig(), options);
  }

  getAllDrafts(options: GetAllDraftsOptions = {}) {
    return getAllDrafts(this.getClient(), this.getConfig(), options);
  }

  streamAllDrafts(options: GetAllDraftsOptions = {}) {
    return streamAllDrafts(this.getClient(), this.getConfig(), options);
  }

  create(body: ListingPostBody) {
    return postListing(this.getClient(), this.getConfig(), body);
  }

  update(id: string, body: ListingUpdateBody) {
    return updateListing(this.getClient(), this.getConfig(), id, body);
  }

  publish(id: string) {
    return updateListing(this.getClient(), this.getConfig(), id, {
      publish: true,
    });
  }

  end(id: string, reason: EndListingReason) {
    return endListing(this.getClient(), this.getConfig(), id, reason);
  }

  delete(id: string) {
    return deleteListing(this.getClient(), this.getConfig(), id);
  }
}
