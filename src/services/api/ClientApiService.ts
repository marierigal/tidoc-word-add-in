import { type Client } from '../../types/Client';

export class ClientApiService {
  static baseURL = 'https://localhost:4321';
  public static async isHealthy(): Promise<boolean> {
    const response = await fetch(`${ClientApiService.baseURL}/health`);
    return response.ok;
  }

  public static async getLastSyncDate(): Promise<Date | null> {
    const response = await fetch(`${ClientApiService.baseURL}/sync/status`);
    if (!response.ok) return null;

    const content = await response.json();
    return content.lastSyncDate ? new Date(content.lastSyncDate) : null;
  }

  public static async search(query: string): Promise<Client[]> {
    const response = await fetch(`${ClientApiService.baseURL}/clients/search?q=${query}`);
    return response.ok ? response.json() : [];
  }
}
