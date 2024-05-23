import {
    ConstraintsExplainAnswer,
    DecisionsExplainAnswer, ExplainQuestionParam, ExplainSolution,
    FullExplainAnswer
} from "@viamedici-spc/configurator-ts";

export type UseExplainResult = {
    explain(question: ExplainQuestionParam, answerType: "decisions"): Promise<DecisionsExplainAnswer>,
    explain(question: ExplainQuestionParam, answerType: "constraints"): Promise<ConstraintsExplainAnswer>,
    explain(question: ExplainQuestionParam, answerType: "full"): Promise<FullExplainAnswer>,
    applySolution(solution: ExplainSolution): Promise<void>,
}

