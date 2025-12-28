import { api } from "@/lib/api";

export interface Configuration {
  key: string;
  value: string;
  type: string;
  description?: string;
  updated_at?: string;
}

export interface ConfigurationMap {
  [key: string]: string;
}

export const configurationService = {
  getPublicConfigurations: async (): Promise<ConfigurationMap> => {
    const response = await api.get<ConfigurationMap>("/configurations");
    return response.data || {};
  },

  getAllConfigurations: async (): Promise<Configuration[]> => {
    const response = await api.get<Configuration[]>("/admin/configurations");
    return response.data || [];
  },

  updateConfigurations: async (configs: ConfigurationMap): Promise<void> => {
    await api.put("/admin/configurations", { configs });
  },
};
