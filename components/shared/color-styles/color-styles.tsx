import colors from "@/styles/colors.json";

const TYPED_COLORS = colors as unknown as Record<
  string,
  Record<"hex" | "p3", string>
>;

// Dark mode color mappings
const darkModeOverrides: Record<string, { hex: string; p3?: string }> = {
  // Background colors
  "background-base": { hex: "#0a0a0a", p3: "0.039216 0.039216 0.039216 / 1.000000" },
  "background-lighter": { hex: "#121212", p3: "0.070588 0.070588 0.070588 / 1.000000" },
  
  // Accent colors
  "accent-black": { hex: "#f5f5f5", p3: "0.960784 0.960784 0.960784 / 1.000000" },
  "accent-white": { hex: "#0a0a0a", p3: "0.039216 0.039216 0.039216 / 1.000000" },
  
  // Border colors
  "border-faint": { hex: "#1f1f1f", p3: "0.121569 0.121569 0.121569 / 1.000000" },
  "border-muted": { hex: "#262626", p3: "0.149020 0.149020 0.149020 / 1.000000" },
  "border-loud": { hex: "#333333", p3: "0.200000 0.200000 0.200000 / 1.000000" },
  
  // Illustration colors
  "illustrations-faint": { hex: "#1a1a1a", p3: "0.101961 0.101961 0.101961 / 1.000000" },
  "illustrations-muted": { hex: "#262626", p3: "0.149020 0.149020 0.149020 / 1.000000" },
  "illustrations-default": { hex: "#333333", p3: "0.200000 0.200000 0.200000 / 1.000000" },
  
  // Black alpha (inverted to white alpha in dark mode)
  "black-alpha-1": { hex: "#ffffff03", p3: "1.000000 1.000000 1.000000 / 0.011765" },
  "black-alpha-2": { hex: "#ffffff05", p3: "1.000000 1.000000 1.000000 / 0.019608" },
  "black-alpha-3": { hex: "#ffffff08", p3: "1.000000 1.000000 1.000000 / 0.031373" },
  "black-alpha-4": { hex: "#ffffff0a", p3: "1.000000 1.000000 1.000000 / 0.039216" },
  "black-alpha-5": { hex: "#ffffff0d", p3: "1.000000 1.000000 1.000000 / 0.050980" },
  "black-alpha-6": { hex: "#ffffff0f", p3: "1.000000 1.000000 1.000000 / 0.058824" },
  "black-alpha-7": { hex: "#ffffff12", p3: "1.000000 1.000000 1.000000 / 0.070588" },
  "black-alpha-8": { hex: "#ffffff14", p3: "1.000000 1.000000 1.000000 / 0.078431" },
  "black-alpha-10": { hex: "#ffffff1a", p3: "1.000000 1.000000 1.000000 / 0.101961" },
  "black-alpha-12": { hex: "#ffffff1f", p3: "1.000000 1.000000 1.000000 / 0.121569" },
  "black-alpha-16": { hex: "#ffffff29", p3: "1.000000 1.000000 1.000000 / 0.160784" },
  "black-alpha-20": { hex: "#ffffff33", p3: "1.000000 1.000000 1.000000 / 0.200000" },
  "black-alpha-24": { hex: "#ffffff3d", p3: "1.000000 1.000000 1.000000 / 0.239216" },
  "black-alpha-32": { hex: "#e5e5e552", p3: "0.898039 0.898039 0.898039 / 0.321569" },
  "black-alpha-40": { hex: "#e5e5e566", p3: "0.898039 0.898039 0.898039 / 0.400000" },
  "black-alpha-48": { hex: "#e5e5e57a", p3: "0.898039 0.898039 0.898039 / 0.478431" },
  "black-alpha-56": { hex: "#e5e5e58f", p3: "0.898039 0.898039 0.898039 / 0.560784" },
  "black-alpha-64": { hex: "#e5e5e5a3", p3: "0.898039 0.898039 0.898039 / 0.639216" },
  "black-alpha-72": { hex: "#e5e5e5b8", p3: "0.898039 0.898039 0.898039 / 0.721569" },
  "black-alpha-88": { hex: "#e5e5e5e0", p3: "0.898039 0.898039 0.898039 / 0.878431" },
  
  // White alpha (inverted to black alpha in dark mode)
  "white-alpha-56": { hex: "#0a0a0a8f", p3: "0.039216 0.039216 0.039216 / 0.560784" },
  "white-alpha-72": { hex: "#0a0a0ab8", p3: "0.039216 0.039216 0.039216 / 0.721569" },
};

const hslValues = Object.entries(TYPED_COLORS).map(([key, value]) => {
  const hexValue = value.hex.startsWith("#") ? value.hex : `#${value.hex}`;
  return `--${key}: ${hexValue}`;
});

const p3Values = Object.entries(TYPED_COLORS)
  .filter(([, value]) => value.p3)
  .map(([key, value]) => `--${key}: color(display-p3 ${value.p3})`);

// Dark mode hex values
const darkHslValues = Object.entries(TYPED_COLORS).map(([key, value]) => {
  const override = darkModeOverrides[key];
  if (override) {
    return `--${key}: ${override.hex}`;
  }
  const hexValue = value.hex.startsWith("#") ? value.hex : `#${value.hex}`;
  return `--${key}: ${hexValue}`;
});

// Dark mode P3 values
const darkP3Values = Object.entries(TYPED_COLORS)
  .filter(([, value]) => value.p3)
  .map(([key, value]) => {
    const override = darkModeOverrides[key];
    if (override?.p3) {
      return `--${key}: color(display-p3 ${override.p3})`;
    }
    return `--${key}: color(display-p3 ${value.p3})`;
  });

const colorsStyle = `
:root {
  ${hslValues.join(";\n  ")}
}

@supports (color: color(display-p3 1 1 1)) {
  :root {
    ${p3Values.join(";\n    ")}
  }
}

.dark {
  ${darkHslValues.join(";\n  ")}
}

@supports (color: color(display-p3 1 1 1)) {
  .dark {
    ${darkP3Values.join(";\n    ")}
  }
}`;

export default function ColorStyles() {
  return <style dangerouslySetInnerHTML={{ __html: colorsStyle }} />;
}
