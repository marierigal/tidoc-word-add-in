import { type Client, ClientType } from '../../types/Client';

const clients: Client[] = [
  {
    reference: 'C0001',
    type: ClientType.PROFESSIONAL,
    company: 'Atelier Vermont',
    email: 'atelier.vermont@example.com',
    address: '12 rue des Lilas',
    cp: '75015',
    city: 'Paris',
  },
  {
    reference: 'C0002',
    type: ClientType.PROFESSIONAL,
    company: 'Boulangerie Gauthier & Fils',
    address: '48 avenue Jean Jaurès',
    cp: '69007',
    city: 'Lyon',
  },
  {
    reference: 'C0003',
    type: ClientType.INDIVIDUAL,
    lastName: 'Lemaire',
    firstName: 'Pascal',
    address: '3 place de la Bourse',
    cp: '33000',
    city: 'Bordeaux',
  },
  {
    reference: 'C0004',
    type: ClientType.PROFESSIONAL,
    company: 'Delmas Logistique',
    address: '17 zone industrielle du Port',
    cp: '44600',
    city: 'Saint-Nazaire',
  },
  {
    reference: 'C0005',
    type: ClientType.INDIVIDUAL,
    lastName: 'Dubreuil',
    address: '9 quai Saint-Antoine',
    cp: '69002',
    city: 'Lyon',
  },
  {
    reference: 'C0006',
    type: ClientType.PROFESSIONAL,
    company: 'Fontaine Architecture',
    address: '22 boulevard Victor Hugo',
    cp: '06000',
    city: 'Nice',
  },
  {
    reference: 'C0007',
    type: ClientType.PROFESSIONAL,
    company: 'Groupe Solaris Énergie',
    address: '5 allée des Cèdres',
    cp: '31000',
    city: 'Toulouse',
  },
  {
    reference: 'C0008',
    type: ClientType.INDIVIDUAL,
    lastName: 'Rivoire',
    firstName: 'Jean',
    address: '74 rue de la Soie',
    cp: '42000',
    city: 'Saint-Étienne',
  },
  {
    reference: 'C0009',
    type: ClientType.PROFESSIONAL,
    company: 'Novatek Systèmes',
    address: '1 parc technologique',
    cp: '38000',
    city: 'Grenoble',
  },
  {
    reference: 'C0010',
    type: ClientType.PROFESSIONAL,
    company: 'Verrerie du Nord',
    address: '60 rue des Fonderies',
    cp: '59000',
    city: 'Lille',
  },
];

export class ClientApiService {
  public static async search(query: string): Promise<Client[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const normalized = query.toLowerCase();
        resolve(
          clients.filter(result => {
            if (result.type === ClientType.PROFESSIONAL) {
              return (
                result.reference.toLowerCase().includes(normalized) ||
                result.company.toLowerCase().includes(normalized) ||
                result.email?.toLowerCase().includes(normalized)
              );
            } else {
              return (
                result.reference.toLowerCase().includes(normalized) ||
                result.lastName.toLowerCase().includes(normalized) ||
                result.firstName?.toLowerCase().includes(normalized) ||
                result.email?.toLowerCase().includes(normalized)
              );
            }
          })
        );
      }, 500);
    });
  }
}
