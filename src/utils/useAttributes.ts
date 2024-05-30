import {ComputedRef, computed, ref, watchEffect} from 'vue';
import {useConfigurationContext} from "./contexts";
import {
    Attribute,
    GlobalAttributeId,
    ConfigurationInterpreter,
    ExplainQuestion,
    ExplainQuestionType,
    WhyIsChoiceValueStateNotPossible,
    ChoiceAttribute,
    WhyIsStateNotPossible,
    ExplainQuestionParam,
    ExplainSolution,
    DecisionsExplainAnswer,
    ConstraintsExplainAnswer,
    FullExplainAnswer,
    ChoiceValueDecisionState,
    ChoiceValueId,
    ExplainQuestionSubject,
    AttributeType,
    ExplicitChoiceDecision,
    ExplicitDecision,
    SetManyMode,
    WhyIsComponentStateNotPossible,
    ComponentAttribute,
    ComponentDecisionState,
    ExplicitComponentDecision,
    WhyIsBooleanStateNotPossible,
    ExplicitBooleanDecision,
    BooleanAttribute,
    WhyIsNumericStateNotPossible,
    NumericAttribute,
    ExplicitNumericDecision
} from "@viamedici-spc/configurator-ts";
import {UseExplainResult} from '@viamedici-spc/configurator-react';
import {getChoiceAttributeResetDecisions} from '../internal/attributeHelper';
import {match} from 'ts-pattern';
import {useSessionContext} from './contexts';
import {getComponentSubtreeResetDecisions} from '../internal/attributeHelper';

function throwIfConfigurationIsNull(configuration: any) {
    if (configuration === null || configuration === undefined) {
        throw new Error('Configuration is null or undefined');
    }
}

// THIS FUNCTION CATCHES THE ATTRIBUTES IN OUR CONFIGURATION AND FILTERS THEM BASED ON OUR NEEDS.
export function useAttributes(attributes?: GlobalAttributeId[], ignoreMissingAttributes: boolean = false): readonly Attribute[] {

    const configuration = useConfigurationContext();

    throwIfConfigurationIsNull(configuration);

    const computedAttributes = computed<readonly Attribute[]>(() => {
        if (!attributes) return configuration.value?.attributes || [];
        if (!configuration.value) {
            return [];
        }
        return attributes
            .map(id => ConfigurationInterpreter.getAttribute(configuration.value!, id))
            .filter(attr => ignoreMissingAttributes ? attr !== null : true) as Attribute[];
    });

    return computedAttributes.value
}

export function useAttributesRef(attributes?: GlobalAttributeId[], ignoreMissingAttributes: boolean = false): ComputedRef<Attribute[]> {

    const configuration = useConfigurationContext();

    throwIfConfigurationIsNull(configuration);

    const computedAttributes = computed<readonly Attribute[]>(() => {
        if (!attributes) return configuration.value?.attributes || [];
        if (!configuration.value) {
            return [];
        }
        return attributes
            .map(id => ConfigurationInterpreter.getAttribute(configuration.value!, id))
            .filter(attr => ignoreMissingAttributes ? attr !== null : true) as Attribute[];
    });

    return computedAttributes as ComputedRef<Attribute[]>;
}

export type UseAttributeExplainResult<T extends WhyIsStateNotPossible> = {
    explain(question: ExplainQuestionParam, answerType: "decisions"): Promise<DecisionsExplainAnswer>,
    explain(question: ExplainQuestionParam, answerType: "constraints"): Promise<ConstraintsExplainAnswer>,
    explain(question: ExplainQuestionParam, answerType: "full"): Promise<FullExplainAnswer>,
    applySolution(solution: ExplainSolution): Promise<void>,
}

export type UseChoiceAttributeResult = UseAttributeExplainResult<WhyIsChoiceValueStateNotPossible> & {
    attribute: ChoiceAttribute,
    makeDecision: (ChoiceValueId: ChoiceValueId, state: ChoiceValueDecisionState | null | undefined) => Promise<void>,
    clearDecisions: () => Promise<void>
}


export function useChoiceAttributeRef(attributeId: GlobalAttributeId): ComputedRef<UseChoiceAttributeResult> {
    
    const configuration = useConfigurationContext();
    const session = useSessionContext();
    const makeDecision = (d: ExplicitDecision) => session.value?.makeDecision(d);
    const setManyDecision = (d: ReadonlyArray<ExplicitDecision>, m: SetManyMode) => session.value?.setMany(d, m);
    const attributeExplainResult = useAttributeExplain<WhyIsChoiceValueStateNotPossible>(attributeId, ExplainQuestionSubject.choiceValue);

    throwIfConfigurationIsNull(configuration);


    const result = computed(() => {
        // Configuration is already a reactive object so we don't need to make a ref to "attribute".
        const attribute = ConfigurationInterpreter.getChoiceAttribute(configuration.value!, attributeId);
        if (!attribute) return undefined;
        
        return {
            makeDecision: async (ChoiceValueId: ChoiceValueId, state: ChoiceValueDecisionState | null | undefined) => {
                await makeDecision({
                    type: AttributeType.Choice,
                    attributeId: attributeId,
                    choiceValueId: ChoiceValueId,
                    state: state,
                } as ExplicitChoiceDecision)
            },
            clearDecisions: async () => {
                const resetDecisions = attribute ? getChoiceAttributeResetDecisions(attribute) : [];
                if (resetDecisions.length > 0) await setManyDecision(resetDecisions, {
                    type: "Default"
                })
            },
            attribute: attribute,
            ...attributeExplainResult
        };
    });

    return result as ComputedRef<UseChoiceAttributeResult>;

}


export function useExplain(): UseExplainResult {

    const configurationSession = useSessionContext();
    if (!configurationSession) throw new Error("Connfiguration Session is not ready for use!");

    const explainAndApplySolution = computed(() => ({
        explain: (q: ExplainQuestion, a: "decisions" | "constraints" | "full"): Promise<any> => {
            switch (a) {
                case "decisions":
                    return configurationSession.value!.explain(q, a)
                case "constraints":
                    return configurationSession.value!.explain(q, a);
                case "full":
                    return configurationSession.value!.explain(q, a);
                default:
                    throw new Error(`Unknown type: ${a}`);
            }
        },
        applySolution: (s) => configurationSession.value!.applySolution(s)
    }) satisfies UseExplainResult);

    return explainAndApplySolution.value;
}

export function useAttributeExplain<T extends WhyIsStateNotPossible>(attributeId: GlobalAttributeId, whyIsStateNotPossibleSubject: T["subject"]): UseAttributeExplainResult<T> {
    const {
        explain,
        applySolution
    } = useExplain();

    const explainAndApplySolution = computed<UseAttributeExplainResult<T>>(() => ({
        explain: (question: ExplainQuestionParam<T>, answerType: "decisions" | "constraints" | "full"): Promise<any> => {
            const subject = match(question.question)
                .with(ExplainQuestionType.whyIsNotSatisfied, () => ExplainQuestionSubject.attribute)
                .otherwise(() => whyIsStateNotPossibleSubject);

            const explainQuestion = {
                ...question,
                subject: subject,
                attributeId: attributeId
            } as ExplainQuestion;


            return match(answerType)
                .with("decisions", a => explain(explainQuestion, a))
                .with("constraints", a => explain(explainQuestion, a))
                .with("full", a => explain(explainQuestion, a))
                .exhaustive();
        },
        applySolution: applySolution
    }));

    return explainAndApplySolution.value;
}


type UseComponentAttributeResult = UseAttributeExplainResult<WhyIsComponentStateNotPossible> & {
    attribute: ComponentAttribute,
    makeDecision: (state: ComponentDecisionState | null | undefined) => Promise<void>,
    clearSubtree: () => Promise<void>
};


export function useComponentAttributeRef(attributeId: GlobalAttributeId): ComputedRef<UseComponentAttributeResult> {

    const configuration = useConfigurationContext();
    const session = ref(useSessionContext());
    const makeDecision = (d: ExplicitDecision) => session.value?.makeDecision(d);
    const setManyDecision = (d: ReadonlyArray<ExplicitDecision>, m: SetManyMode) => session.value?.setMany(d, m);
    const attributeExplainResult = useAttributeExplain<WhyIsComponentStateNotPossible>(attributeId, ExplainQuestionSubject.component);

    throwIfConfigurationIsNull(configuration);

    const attributes = configuration.value?.attributes;

    const results = computed(() => {

        const attribute = ConfigurationInterpreter.getComponentAttribute(configuration.value!, attributeId);
        if (!attribute) return undefined;

        return {
            makeDecision: async (state: ComponentDecisionState | null | undefined) => await makeDecision({
                type: AttributeType.Component,
                attributeId: attributeId,
                state: state
            } as ExplicitComponentDecision),

            clearSubtree: async () => {
                const resetDecisions = attribute ? getComponentSubtreeResetDecisions(attributeId, attributes!) : [];
                if (resetDecisions.length > 0) await setManyDecision(resetDecisions, {
                    type: "Default"
                })
            },
            attribute: attribute!,
            ...attributeExplainResult
        }
    })


    return results as ComputedRef<UseComponentAttributeResult>;
}

export type UseBooleanAttributeResult = UseAttributeExplainResult<WhyIsBooleanStateNotPossible> & {
    attribute: BooleanAttribute,
    makeDecision: (state: boolean | null | undefined) => Promise<void>
};

export function useBooleanAttributeRef(attributeId: GlobalAttributeId): ComputedRef<UseBooleanAttributeResult> {

    const configuration = useConfigurationContext();
    const session = ref(useSessionContext());
    const makeDecision = (d: ExplicitDecision) => session.value?.makeDecision(d);

    const attributeExplainResult = useAttributeExplain<WhyIsBooleanStateNotPossible>(attributeId, ExplainQuestionSubject.boolean);

    throwIfConfigurationIsNull(configuration);

    const results = computed(() => {
        const attribute = ConfigurationInterpreter.getBooleanAttribute(configuration.value!, attributeId);
        if(!attribute) return undefined;
        return {
            makeDecision: async (state: boolean | null | undefined) => makeDecision({
                type: AttributeType.Boolean,
                attributeId: attributeId,
                state: state
            } as ExplicitBooleanDecision),
            attribute: attribute!,
            ...attributeExplainResult
        }
    });

    return results as ComputedRef<UseBooleanAttributeResult>;
}


export type UseNumericAttributeResult = UseAttributeExplainResult<WhyIsNumericStateNotPossible> & {
    attribute: NumericAttribute,
    makeDecision: (state: number | null | undefined) => Promise<void>,

};

export function useNumericAttributeRef(attributeId: GlobalAttributeId): ComputedRef<UseNumericAttributeResult> {

    const configuration = useConfigurationContext();
    const session = useSessionContext();

    const makeDecision = async (state: number | null | undefined) => {
        if (state !== null && state !== undefined) {
            await session.value?.makeDecision({
                type: AttributeType.Numeric,
                attributeId: attributeId,
                state: state
            } as ExplicitNumericDecision);
        }
    };

    const attributeExplainResult = useAttributeExplain<WhyIsNumericStateNotPossible>(attributeId, ExplainQuestionSubject.numeric);

    throwIfConfigurationIsNull(configuration);

    const results = computed(() => {

        const attribute = ConfigurationInterpreter.getNumericAttribute(configuration.value!, attributeId);
        if(!attribute) return undefined;

        return {
            makeDecision: makeDecision,
            attribute: attribute,
            ...attributeExplainResult
        }
    });

    return results as ComputedRef<UseNumericAttributeResult>;
}