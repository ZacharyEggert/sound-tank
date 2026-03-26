import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import {
  getNegotiation,
  getNegotiations,
	GetNegotiationsOptions
} from '../methods/negotiations/getNegotiations';

export class NegotiationsResource {
	constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

	getNegotiations(options: GetNegotiationsOptions) {
		return getNegotiations(this.getClient(), this.getConfig(), options);
	}

	getNegotiation(offerId: number) {
		return getNegotiation(this.getClient(), this.getConfig(), offerId);
	}
}
