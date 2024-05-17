// import { inject } from "vue";
// import { ConfigurationInitializationKey, ConfigurationUpdatingKey } from "./contexts";
// import { ConfigurationInitialization, ConfigurationUpdating} from "./types"

// export function useConfigurationInitialization(): ConfigurationInitialization {
//     const context = inject(ConfigurationInitializationKey);
//     if (!context) {
//         throw new Error('useConfigurationInitialization must be used within a provider with ConfigurationInitializationKey');
//     }
//     return context.value;
// }


// export function useConfigurationUpdating(): ConfigurationUpdating {
//     const context = inject(ConfigurationUpdatingKey);
//     if (!context) {
//         throw new Error('useConfigurationUpdating must be used within a provider with ConfigurationUpdatingKey');
//     }
//     return context.value;
// }