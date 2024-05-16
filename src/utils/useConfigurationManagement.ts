// useConfigurationManagement.ts
import { ref, provide, inject, reactive } from 'vue';
import {
  IConfiguratorClient,
  ConfigurationModelSource,
  AttributeRelations,
  AllowedInExplain,
  ConfigurationInitialization,
  ConfigurationUpdating,
  IConfigurationSession,
  Configuration
} from '@viamedici-spc/configurator-ts';

export function useConfigurationManagement(props) {
  const configurationInitialization = reactive<ConfigurationInitialization>({});
  const configurationUpdating = reactive<ConfigurationUpdating>({});
  const session = reactive<IConfigurationSession>({});
  const configuration = reactive<Configuration>({});

  // Your logic to handle configuration management

  provide('configurationInitialization', configurationInitialization);
  provide('configurationUpdating', configurationUpdating);
  provide('session', session);
  provide('configuration', configuration);

  return {
    configurationInitialization,
    configurationUpdating,
    session,
    configuration
  };
}

// Custom hooks to use the provided context
export function useConfigurationInitializationContext() {
  return inject('configurationInitialization') as ConfigurationInitialization;
}

export function useConfigurationUpdatingContext() {
  return inject('configurationUpdating') as ConfigurationUpdating;
}

export function useConfigurationSessionContext() {
  return inject('session') as IConfigurationSession;
}

export function useConfigurationContext() {
  return inject('configuration') as Configuration;
}
