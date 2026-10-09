import React from "react";
import { OnboardingStep } from "../../components/onboarding/OnboardingStep";
import {
    HISTORY_ILLUSTRATION_HEIGHT,
    HistoryHeroLines,
    HistoryIllustration,
} from "../../components/onboarding/HistoryIllustration";

export default function OnboardingHistoryScreen() {
    return (
        <OnboardingStep
            step={3}
            title="Keep track of every scan"
            description="Every product you scan is saved to your history. Mark the ones you check often as favorites."
            illustration={<HistoryIllustration />}
            illustrationHeight={HISTORY_ILLUSTRATION_HEIGHT}
            heroLines={<HistoryHeroLines />}
            showBack
        />
    );
}
