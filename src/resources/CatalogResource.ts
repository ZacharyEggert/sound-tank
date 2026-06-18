import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  getCategories,
  getConditions,
  getShippingRegions,
  getCurrencies,
} from '~/methods/catalog/getCatalog';

export class CatalogResource {
  constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

  getCategories() {
    return getCategories(this.getClient(), this.getConfig());
  }

  getConditions() {
    return getConditions(this.getClient(), this.getConfig());
  }

  getShippingRegions() {
    return getShippingRegions(this.getClient(), this.getConfig());
  }

  getCurrencies() {
    return getCurrencies(this.getClient(), this.getConfig());
  }
}
