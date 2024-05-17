import { InjectionKey, Ref, provide, inject } from 'vue';
import { Configuration } from '@viamedici-spc/configurator-ts';

// Define an injection key
export const ConfigurationContextKey: InjectionKey<Ref<Configuration | null>> = Symbol('ConfigurationContext');

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
