import type { ContentControlType } from './ContentControlType';

export interface TaggedControl {
  id: number;
  type: ContentControlType;
  tag: string;
  data: string;
}
