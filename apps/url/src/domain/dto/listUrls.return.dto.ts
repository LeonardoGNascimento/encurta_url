import { Url } from '../entity/url.entity';

export interface ListUrlsReturnDto extends Omit<Url, 'clicks'> {
  totalClicks: number;
}
