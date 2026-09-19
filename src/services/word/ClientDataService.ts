import { type Client, ClientType } from '../../types/Client';
import type { TaggedControl } from '../../types/TaggedControl';

export class ClientDataService {
  private static readonly PLACEHOLDERS: Record<string, (client: Client) => string> = {
    reference: client => client.reference,
    type: client => client.type,
    name: client => {
      if (client.type === ClientType.PROFESSIONAL) {
        return client.company;
      } else if (client.firstName) {
        return `${client.firstName} ${client.lastName}`;
      } else {
        return client.lastName;
      }
    },
    company: client => (client.type === ClientType.PROFESSIONAL ? client.company : ''),
    siret: client => (client.type === ClientType.PROFESSIONAL ? client.siret : ''),
    firstName: client => client.firstName ?? '',
    lastName: client => client.lastName ?? '',
    email: client => client.email ?? '',
    phone: client => client.phone ?? '',
    address: client => client.address ?? '',
    cp: client => client.cp ?? '',
    city: client => client.city ?? '',
    note: client => client.note ?? '',
    accountantId: client => client.accountantId ?? '',
  };

  public static async insertClientData(controls: TaggedControl[], client: Client): Promise<void> {
    await Word.run(async context => {
      for (const control of controls) {
        const contentControl = context.document.contentControls.getById(control.id);
        const placeholder = ClientDataService.PLACEHOLDERS[control.data];

        if (!placeholder) {
          console.warn(`No placeholder found for data key ${control.data}`);
        }

        contentControl.insertText(placeholder(client) ?? ' ', Word.InsertLocation.replace);
      }

      await context.sync();
    });
  }
}
