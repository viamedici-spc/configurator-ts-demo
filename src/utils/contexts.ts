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

// Utility to provide ConfigurationInitializationContext
export function provideConfigurationInitializationContext(initialization: Ref<ConfigurationInitialization | null>) {
  provide(ConfigurationInitializationContextKey, initialization);
}

// Utility to use ConfigurationInitializationContext
export function useConfigurationInitializationContext(): ConfigurationInitialization {
  const context = inject(ConfigurationInitializationContextKey);
  if (!context) {
    throw new Error('useConfigurationInitializationContext must be used within a provider with ConfigurationInitializationContextKey');
  }
  return {
    isInitializing:context.value?.isInitializing! ,
    isInitializingPromise: context.value?.isInitializingPromise!,
    error:context.value?.error!
  }
}

// Utility to provide ConfigurationUpdatingContext
export function provideConfigurationUpdatingContext(updating: Ref<ConfigurationUpdating | null>) {
  provide(ConfigurationUpdatingContextKey, updating);
}

// Utility to use ConfigurationUpdatingContext
export function useConfigurationUpdatingContext(): ConfigurationUpdating {
  const context = inject(ConfigurationUpdatingContextKey);
  if (!context) {
    throw new Error('useConfigurationUpdatingContext must be used within a provider with ConfigurationUpdatingContextKey');
  }
  return {
    isUpdating:context.value?.isUpdating!,
    error: context.value?.error!
  }
}
