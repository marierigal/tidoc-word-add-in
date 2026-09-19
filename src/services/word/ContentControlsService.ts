import type { ContentControlType } from '../../types/ContentControlType';
import type { GroupedTaggedControls } from '../../types/GroupedTaggedControl';
import type { TaggedControl } from '../../types/TaggedControl';

export class ContentControlsService {
  private static readonly TAG_SEPARATOR = ':';

  public static async create(
    tag: string,
    data: { label: string; value: string } | null,
    type: ContentControlType = Word.ContentControlType.richText,
    items: string[] = []
  ): Promise<void> {
    await Word.run(async context => {
      const range = context.document.getSelection();
      const contentControl = range.insertContentControl(type);

      contentControl.tag = tag;
      contentControl.title = tag;
      contentControl.placeholderText = tag;

      if (type === Word.ContentControlType.richText && !!tag && !!data) {
        contentControl.tag = `${tag}${ContentControlsService.TAG_SEPARATOR}${data.value}`;
        contentControl.title = `${tag} (${data.label})`;
        contentControl.placeholderText = `${tag} (${data.label})`;
      } else if (type === Word.ContentControlType.dropDownList) {
        for (const item of items) {
          contentControl.dropDownListContentControl.addListItem(item);
        }
      } else if (type === Word.ContentControlType.checkBox) {
        contentControl.appearance = Word.ContentControlAppearance.hidden;
      }

      await context.sync();
    });
  }

  public static async getRichTextTaggedControls(): Promise<TaggedControl[]> {
    return await Word.run(async context => {
      const contentControls = context.document.contentControls;
      contentControls.load('items/id,items/tag,items/type');
      await context.sync();

      return contentControls.items
        .map(cc => {
          if (!cc.tag || cc.type !== Word.ContentControlType.richText) return null;
          const [tag = '', data = ''] = cc.tag.split(ContentControlsService.TAG_SEPARATOR);
          return { id: cc.id, type: cc.type, tag, data };
        })
        .filter(cc => cc !== null);
    });
  }

  public static groupByTag(controls: TaggedControl[]): GroupedTaggedControls {
    return controls.reduce((groups, cc) => {
      (groups[cc.tag] ??= { controls: [], hasData: cc.data !== '' }).controls.push(cc);
      return groups;
    }, {} as GroupedTaggedControls);
  }

  public static async scrollTo(id: number): Promise<void> {
    await Word.run(async context => {
      const contentControl = context.document.contentControls.getById(id);
      contentControl.select(); // selects the control's content AND scrolls it into view
      await context.sync();
    });
  }

  public static async setText(id: number, data: string): Promise<void> {
    await Word.run(async context => {
      const contentControl = context.document.contentControls.getById(id);
      contentControl.insertText(data, Word.InsertLocation.replace);
      await context.sync();
    });
  }

  public static async getText(id: number): Promise<string> {
    return await Word.run(async context => {
      const contentControl = context.document.contentControls.getById(id);
      const range = contentControl.getRange();
      range.load('text');
      await context.sync();

      return range.text;
    });
  }
}
