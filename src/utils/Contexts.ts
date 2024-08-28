import {InjectionKey, Ref, provide, inject, ShallowRef} from "vue";
import {Configuration, GlobalAttributeId, IConfigurationSession} from "@viamedici-spc/configurator-ts";

const configurationContextKey: InjectionKey<Ref<Configuration>> = Symbol("ConfigurationContext");
const sessionContextKey: InjectionKey<Readonly<IConfigurationSession>> = Symbol("SessionContext");
const activeAttributeContextKey: InjectionKey<Ref<GlobalAttributeId>> = Symbol("ActiveAttributeContext");

export function provideConfiguration(configuration: Ref<Configuration>) {
    provide(configurationContextKey, configuration);
}

export function useConfiguration(): ShallowRef<Configuration> {
    const context = inject(configurationContextKey);
    if (!context) {
        throw new Error("useConfiguration must be used within the context ConfigurationContext");
    }
    return context;
}

export function provideSession(session: Readonly<IConfigurationSession>) {
    provide(sessionContextKey, session);
}

export function useSession(): Readonly<IConfigurationSession> {
    const context = inject(sessionContextKey);

    if (!context) {
        throw new Error("useSession must be used within the context SessionContext");
    }

    return context;
}

export function provideActiveAttribute(attribute: Ref<GlobalAttributeId>) {
    provide(activeAttributeContextKey, attribute);
}

export function useActiveAttribute(): Ref<GlobalAttributeId> {
    const context = inject(activeAttributeContextKey);

    if (!context) {
        throw new Error("useActiveAttribute must be used within the context ActiveAttributeContext");
    }

    return context;
}