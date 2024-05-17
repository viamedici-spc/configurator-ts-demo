// useConfigurationManagement.ts
import { ref, provide, inject, reactive } from 'vue';

import {
  Configuration
} from '@viamedici-spc/configurator-ts';

const keys = {

  configuration: 'configuration'
};

export function provideConfigurationContexts(

  configuration: Configuration
) {
  provide(keys.configuration, reactive(configuration));
}

export function useConfigurationContext() {
  return inject(keys.configuration) as Configuration;
}