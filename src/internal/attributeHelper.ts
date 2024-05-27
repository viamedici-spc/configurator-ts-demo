import { ChoiceAttribute, ExplicitDecision, Decision, DecisionKind, ExplicitChoiceDecision, AttributeType, ChoiceValue, ComponentAttribute, ExplicitComponentDecision, Attribute, ExplicitNumericDecision, ExplicitBooleanDecision, GlobalAttributeId, BooleanAttribute, NumericAttribute } from "@viamedici-spc/configurator-ts";


function choiceAttributeRefinement(attribute: Attribute): attribute is ChoiceAttribute {
  return attribute.type === AttributeType.Choice;
}

function numericAttributeRefinement(attribute: Attribute): attribute is NumericAttribute {
  return attribute.type === AttributeType.Numeric;
}

function booleanAttributeRefinement(attribute: Attribute): attribute is BooleanAttribute {
  return attribute.type === AttributeType.Boolean;
}

function componentAttributeRefinement(attribute: Attribute): attribute is ComponentAttribute {
  return attribute.type === AttributeType.Component;
}

function choiceHasExplicitResettableDecision(value: ChoiceValue): boolean {
    return value.decision != null && value.decision.kind === DecisionKind.Explicit;
}

function componentHasExplicitResettableDecision(value: ComponentAttribute): boolean {
  return value.decision != null && value.decision.kind === DecisionKind.Explicit;
}

function booleanHasExplicitResettableDecision(value: BooleanAttribute): boolean {
  return value.decision != null && value.decision.kind === DecisionKind.Explicit;
}

function numericHasExplicitResettableDecision(value: NumericAttribute): boolean {
  return value.decision != null && value.decision.kind === DecisionKind.Explicit;
}

export function getChoiceAttributeResetDecisions(attribute: ChoiceAttribute): ReadonlyArray<ExplicitDecision> {
    if (!attribute.values) {
      return [];
    }
  
    return attribute.values
      .filter(choiceHasExplicitResettableDecision)
      .map((v) => ({
        type: AttributeType.Choice,
        attributeId: attribute.id,
        choiceValueId: v.id,
        state: null,
      } as ExplicitChoiceDecision));
  }



export function getComponentResetDecision(attribute: ComponentAttribute): ExplicitComponentDecision | null {
    if (componentHasExplicitResettableDecision(attribute)) {
      return {
        type: AttributeType.Component,
        attributeId: attribute.id,
        state: null
      } as ExplicitComponentDecision;
    }
    return null;
  }

export  function getBooleanResetDecision(attribute: BooleanAttribute): ExplicitBooleanDecision | null {
    if (booleanHasExplicitResettableDecision(attribute)) {
      return {
        type: AttributeType.Boolean,
        attributeId: attribute.id,
        state: null
      } as ExplicitBooleanDecision;
    }
    return null;
  }

export  function getNumericResetDecision(attribute: NumericAttribute): ExplicitNumericDecision | null {
    if (numericHasExplicitResettableDecision(attribute)) {
      return {
        type: AttributeType.Numeric,
        attributeId: attribute.id,
        state: null
      } as ExplicitNumericDecision;
    }
    return null;
  }



  function filterAttributesOfComponent(
    attributes: ReadonlyArray<Attribute>, 
    attributeId: GlobalAttributeId, 
    includeSubcomponents: boolean
  ): ReadonlyArray<Attribute> {
    // Implement the filtering logic here
    return attributes.filter(attr => attr.id === attributeId); // Placeholder, replace with actual logic
  }
  
  // Refactored function
  export function getComponentSubtreeResetDecisions(
    attributeId: GlobalAttributeId, 
    attributes: ReadonlyArray<Attribute>
  ): ReadonlyArray<ExplicitDecision> {
    const filteredAttributes = filterAttributesOfComponent(attributes, attributeId, true);
  
    const choiceDecisions = filteredAttributes
      .filter(choiceAttributeRefinement)
      .flatMap(getChoiceAttributeResetDecisions);
  
    const numericDecisions = filteredAttributes
      .filter(numericAttributeRefinement)
      .map(getNumericResetDecision)
      .filter((decision): decision is ExplicitNumericDecision => decision !== null);
  
    const booleanDecisions = filteredAttributes
      .filter(booleanAttributeRefinement)
      .map(getBooleanResetDecision)
      .filter((decision): decision is ExplicitBooleanDecision => decision !== null);
  
    const componentDecisions = filteredAttributes
      .filter(componentAttributeRefinement)
      .map(getComponentResetDecision)
      .filter((decision): decision is ExplicitComponentDecision => decision !== null);
  
    return [
      ...choiceDecisions,
      ...numericDecisions,
      ...booleanDecisions,
      ...componentDecisions,
    ];
  }