/* global Word console */

import { type Client, clientPlaceholders } from '../types/Client';

export async function tagSelection(
  tag: string,
  type: string = Word.ContentControlType.richText,
  items: string[] = []
) {
  await Word.run(async (context) => {

    console.log({tag, type, items});

    const range = context.document.getSelection();
    const contentControl = range.insertContentControl(type as any);

    contentControl.tag = tag;
    contentControl.title = tag;

    if (type === Word.ContentControlType.dropDownList) {
      for (const item of items) {
        contentControl.dropDownListContentControl.addListItem(item)
      }
    } else if (type === Word.ContentControlType.checkBox) {
      contentControl.appearance = Word.ContentControlAppearance.hidden;
    }

    await context.sync();
  });
}

export interface TaggedControl {
  id: number;
  tag: string;
}

export async function getRichTextTaggedControls(): Promise<TaggedControl[]> {
  return await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load("items/id,items/tag,items/type");
    await context.sync();

    return contentControls.items
      .filter(cc => cc.type === Word.ContentControlType.richText && cc.tag)
      .map(cc => ({ id: cc.id, tag: cc.tag }));
  });
}

export function groupByTag(controls: TaggedControl[]): Record<string, TaggedControl[]> {
  return controls.reduce((groups, cc) => {
    (groups[cc.tag] ??= []).push(cc);
    return groups;
  }, {} as Record<string, TaggedControl[]>);
}

export async function insertClientData(contentControlTag: string, client: Client) {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls.getByTag(contentControlTag);

    contentControls.load("items")
    await context.sync();

    for (let contentControl of contentControls.items) {
      const range = contentControl.getRange();

      // Search for each placeholder and replace it in place, so the paragraph
      // keeps its existing style (we're not deleting/recreating paragraphs)
      for (const [placeholder, replacer] of Object.entries(clientPlaceholders)) {
        const results = range.search(placeholder, { matchCase: false });
        results.load("items");
        await context.sync();

        results.items.forEach((found) => {
          found.insertText(replacer(client), Word.InsertLocation.replace);
        });
      }
    }
    await context.sync();
  });
}
