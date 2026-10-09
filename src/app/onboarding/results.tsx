import React from "react";
import { OnboardingStep } from "../../components/onboarding/OnboardingStep";
import {
    SEALS_ILLUSTRATION_HEIGHT,
    SealsHeroLines,
    SealsIllustration,
} from "../../components/onboarding/SealsIllustration";

export default function OnboardingResultsScreen() {
    return (
        <OnboardingStep
            step={2}
            title="See the warning seals"
            description="Find out which NOM-051 warnings apply: excess sugars, saturated fat, calories or sodium, plus caffeine and sweeteners."
            illustration={<SealsIllustration />}
            illustrationHeight={SEALS_ILLUSTRATION_HEIGHT}
            heroLines={<SealsHeroLines />}
            nextHref="/onboarding/history"
            showBack
        />
    );
}
