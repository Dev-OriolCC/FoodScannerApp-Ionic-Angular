import React from "react";
import Svg, { Path } from "react-native-svg";

// Path data copied from Iconify (Material Symbols set, https://icon-sets.iconify.design/material-symbols/).
// Bundled locally so the tab bar never waits on the Iconify API.
const icons = {
    home: "M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75",
    history:
        "M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z",
    avatar:
        "M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1m3.663-5.113Q8.5 10.976 8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13t-2.488-1.012M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m2.5-2.387q1.175-.388 2.15-1.113q-.975-.725-2.15-1.112T12 17t-2.5.388T7.35 18.5q.975.725 2.15 1.113T12 20t2.5-.387m-1.425-9.038q.425-.425.425-1.075t-.425-1.075T12 8t-1.075.425T10.5 9.5t.425 1.075T12 11t1.075-.425M12 18.5",
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
    name: IconName;
    size?: number;
    color: string;
}

export function Icon({ name, size = 24, color }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d={icons[name]} fill={color} />
        </Svg>
    );
}
