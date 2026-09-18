/* global Word, Office, Blob, URL, document console */

export async function tagSelection(
  tag: string,
  data: { label: string; value: string } | null,
  type: string = Word.ContentControlType.richText,
  items: string[] = []
) {
  await Word.run(async context => {
    const range = context.document.getSelection();
    const contentControl = range.insertContentControl(type as any);

    contentControl.tag = tag;
    contentControl.title = tag;
    contentControl.placeholderText = tag;

    if (type === Word.ContentControlType.richText && !!tag && !!data) {
      contentControl.tag = `${tag}${TAGGED_CONTROL_SEPARATOR}${data.value}`;
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

export async function getRichTextTaggedControls(): Promise<TaggedControl[]> {
  try {
    return await Word.run(async context => {
      const contentControls = context.document.contentControls;
      contentControls.load('items/id,items/tag,items/type');
      await context.sync();

      return contentControls.items
        .map(cc => {
          if (!cc.tag || cc.type !== Word.ContentControlType.richText) return null;
          const [tag = '', data = ''] = cc.tag.split(TAGGED_CONTROL_SEPARATOR);
          return { id: cc.id, type: cc.type, tag, data };
        })
        .filter(Boolean);
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function groupByTag(controls: TaggedControl[]): GroupedTaggedControls {
  return controls.reduce(
    (groups, cc) => {
      (groups[cc.tag] ??= { controls: [], hasData: cc.data !== '' }).controls.push(cc);
      return groups;
    },
    {} as Record<string, { controls: TaggedControl[]; hasData: boolean }>
  );
}

export async function insertClientData(controls: TaggedControl[], client: Client) {
  await Word.run(async context => {
    for (const control of controls) {
      const contentControl = context.document.contentControls.getById(control.id);
      contentControl.insertText(
        clientPlaceholders[control.data](client) ?? ' ',
        Word.InsertLocation.replace
      );
    }
  });
}

export async function scrollToContentControl(id: number) {
  await Word.run(async context => {
    const cc = context.document.contentControls.getById(id);
    cc.select(); // selects the control's content AND scrolls it into view
    await context.sync();
  });
}

export async function updateContentControlText(id: number, data: string) {
  await Word.run(async context => {
    const control = context.document.contentControls.getById(id);
    control.insertText(data, Word.InsertLocation.replace);
  });
}

export async function getContentControlText(id: number): Promise<string> {
  try {
    return await Word.run(async context => {
      const control = context.document.contentControls.getById(id);
      const range = control.getRange();
      range.load('text');
      await context.sync();

      return range.text;
    });
  } catch (e) {
    console.error(e);
    return '';
  }
}

function getPdfAsBase64(): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 65536 }, result => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        reject(result.error);
        return;
      }

      const file = result.value;
      const sliceCount = file.sliceCount;
      const slices: number[][] = new Array(sliceCount);
      let receivedCount = 0;

      for (let i = 0; i < sliceCount; i++) {
        file.getSliceAsync(i, sliceResult => {
          if (sliceResult.status !== Office.AsyncResultStatus.Succeeded) {
            file.closeAsync();
            reject(sliceResult.error);
            return;
          }

          slices[sliceResult.value.index] = sliceResult.value.data;
          receivedCount++;

          if (receivedCount === sliceCount) {
            file.closeAsync();
            const merged = slices.flat();
            resolve(new Uint8Array(merged));
          }
        });
      }
    });
  });
}

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function exportToPdf() {
  const bytes = await getPdfAsBase64();
  downloadPdf(bytes, 'document.pdf');
}

/**
 * Client
 */
export enum ClientType {
  PROFESSIONAL = 'Professionnel',
  INDIVIDUAL = 'Particulier',
}

export type ClientInfo = {
  reference: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  cp?: string;
  city?: string;
  note?: string;
  accountantId?: string;
};

export type ProfessionalClient = ClientInfo & {
  type: ClientType.PROFESSIONAL;
  company: string;
  siret?: string;
};

export type IndividualClient = ClientInfo & {
  type: ClientType.INDIVIDUAL;
  lastName: string;
};

export type Client = ProfessionalClient | IndividualClient;

export const clientPlaceholders: Record<string, (client: Client) => string> = {
  reference: (client: Client) => client.reference,
  type: (client: Client) => client.type,
  name: (client: Client) => {
    if (client.type === ClientType.PROFESSIONAL) {
      return client.company;
    } else if (client.firstName) {
      return `${client.firstName} ${client.lastName}`;
    } else {
      return client.lastName;
    }
  },
  company: (client: Client) => (client.type === ClientType.PROFESSIONAL ? client.company : ''),
  siret: (client: Client) => (client.type === ClientType.PROFESSIONAL ? client.siret : ''),
  firstName: (client: Client) => client.firstName,
  lastName: (client: Client) => client.lastName,
  email: (client: Client) => client.email,
  phone: (client: Client) => client.phone,
  address: (client: Client) => client.address,
  cp: (client: Client) => client.cp,
  city: (client: Client) => client.city,
  note: (client: Client) => client.note,
  accountantId: (client: Client) => client.accountantId,
};

/**
 * TaggedControl
 */
export interface TaggedControl {
  id: number;
  type: string;
  tag: string;
  data: string;
}

export const TAGGED_CONTROL_SEPARATOR = ':';

export type GroupedTaggedControls = Record<string, { controls: TaggedControl[]; hasData: boolean }>;
