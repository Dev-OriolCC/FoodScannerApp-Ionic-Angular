import React from "react";
import { OnboardingStep } from "../../components/onboarding/OnboardingStep";
import { ScanIllustration } from "../../components/onboarding/ScanIllustration";

export default function OnboardingScanScreen() {
    return (
        <OnboardingStep
            step={1}
            title="Scan any packaged food"
            description="Point your camera at the barcode. Sellómetro reads it in seconds and looks up the product for you."
            illustration={<ScanIllustration />}
            nextHref="/onboarding/results"
        />
    );
}
