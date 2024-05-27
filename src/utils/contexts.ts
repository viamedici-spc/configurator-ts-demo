import { InjectionKey, Ref, provide, inject } from 'vue';
import { Configuration, IConfigurationSession } from '@viamedici-spc/configurator-ts';
import { ConfigurationInitialization, ConfigurationUpdating } from './types';
// Define injection keys
export const ConfigurationContextKey: InjectionKey<Ref<Configuration | null>> = Symbol('ConfigurationContext');
export const SessionContextKey: InjectionKey<Ref<IConfigurationSession | null>> = Symbol('SessionContext');
export const ConfigurationInitializationContextKey: InjectionKey<Ref<ConfigurationInitialization | null>> = Symbol('ConfigurationInitializationContext');
export const ConfigurationUpdatingContextKey: InjectionKey<Ref<ConfigurationUpdating | null>> = Symbol('ConfigurationUpdatingContext');

// Utility to provide ConfigurationContext
export function provideConfigurationContext(configuration: Ref<Configuration | null>) {
  provide(ConfigurationContextKey, configuration);
}

// Utility to use ConfigurationContext
export function useConfigurationContext(): Ref<Configuration | null> {
  const context = inject(ConfigurationContextKey);
  if (!context) {
    throw new Error('useConfigurationContext must be used within a provider with ConfigurationContextKey');
  }
  return context;
}

// Utility to provide SessionContext
export function provideSessionContext(session: Ref<IConfigurationSession | null>) {
  provide(SessionContextKey, session);
}

// Utility to use SessionContext
export function useSessionContext(): Ref<IConfigurationSession | null> {
  const context = inject(SessionContextKey);
  if (!context) {
    throw new Error('useSessionContext must be used within a provider with SessionContextKey');
  }
  return context;
}


