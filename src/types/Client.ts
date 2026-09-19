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
