import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { getMyOrders, GetMyOrdersOptions } from '~/methods/orders/getOrders';

export class OrdersResource {
  constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

  getMy(options: GetMyOrdersOptions = {}) {
    return getMyOrders(this.getClient(), this.getConfig(), options);
  }
}
