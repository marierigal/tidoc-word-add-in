import type { TaggedControl } from './TaggedControl';

export interface GroupedTaggedControl {
  controls: TaggedControl[];
  hasData: boolean;
}

export type GroupedTaggedControls = Record<string, GroupedTaggedControl>;
