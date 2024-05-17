// useConfigurationManagement.ts
import { ref, provide, inject, reactive } from 'vue';
import { 
  ConfigurationInitialization,
  ConfigurationUpdating
} from './types';
import {
  IConfigurationSession,
  Configuration
} from '@viamedici-spc/configurator-ts';

const keys = {
  configurationSession: 'configurationSession',
  configurationInitialization: 'configurationInitialization',
  configurationUpdating: 'configurationUpdating',
  configuration: 'configuration'
};

export function provideConfigurationContexts(
  session: IConfigurationSession,
  initialization: ConfigurationInitialization,
  updating: ConfigurationUpdating,
  configuration: Configuration
) {
  provide(keys.configurationSession, reactive(session));
  provide(keys.configurationInitialization, reactive(initialization));
  provide(keys.configurationUpdating, reactive(updating));
  provide(keys.configuration, reactive(configuration));
}


export function useConfigurationSessionContext() {
  return inject(keys.configurationSession) as IConfigurationSession;
}

export function useConfigurationInitializationContext() {
  return inject(keys.configurationInitialization) as ConfigurationInitialization;
}

export function useConfigurationUpdatingContext() {
  return inject(keys.configurationUpdating) as ConfigurationUpdating;
}

export function useConfigurationContext() {
  return inject(keys.configuration) as Configuration;
}