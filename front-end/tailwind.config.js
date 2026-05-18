/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],

  theme: {
    extend: {
      colors: {
        "on-secondary": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed-dim": "#95d4b3",
        "inverse-surface": "#2e3131",
        "on-primary-fixed": "#002114",
        "on-primary-container": "#a8e7c5",
        "on-secondary-fixed": "#092012",
        "on-tertiary-fixed-variant": "#005236",
        "on-surface-variant": "#404943",
        "surface-container-low": "#f2f4f3",
        "on-secondary-container": "#506856",
        "on-primary-fixed-variant": "#0e5138",
        "error": "#ba1a1a",
        "secondary-container": "#cce6d0",
        "on-background": "#191c1c",
        "tertiary-fixed-dim": "#86d7ad",
        "inverse-on-surface": "#eff1f0",
        "tertiary-fixed": "#a1f4c8",
        "primary": "#0f5238",
        "background": "#f8faf9",
        "surface-container-high": "#e6e9e8",
        "on-surface": "#191c1c",
        "on-secondary-fixed-variant": "#354c3b",
        "secondary": "#4c6452",
        "surface-container": "#eceeed",
        "secondary-fixed": "#cee9d3",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "surface-variant": "#e1e3e2",
        "secondary-fixed-dim": "#b3cdb7",
        "primary-container": "#2d6a4f",
        "outline-variant": "#bfc9c1",
        "outline": "#707973",
        "primary-fixed": "#b1f0ce",
        "on-tertiary-container": "#98eabf",
        "tertiary-container": "#116c4a",
        "surface": "#f8faf9",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e1e3e2",
        "inverse-primary": "#95d4b3",
        "surface-bright": "#f8faf9",
        "tertiary": "#005236",
        "surface-dim": "#d8dada",
        "surface-tint": "#2c694e",
        "on-tertiary-fixed": "#002113"
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },

      spacing: {
        "margin-mobile": "16px",
        "unit": "8px",
        "margin-desktop": "40px",
        "container-max-width": "1280px",
        "gutter": "24px"
      },

      fontFamily: {
        "headline-md": ["Manrope"],
        "body-md": ["Inter"],
        "headline-lg": ["Manrope"],
        "body-lg": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg-mobile": ["Manrope"],
        "body-sm": ["Inter"],
        "headline-xl": ["Manrope"]
      },

      fontSize: {
        "headline-md": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "600"
          }
        ],

        "body-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400"
          }
        ],

        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600"
          }
        ]
      }
    }
  },

  plugins: [],
}