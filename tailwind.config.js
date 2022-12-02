const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    debugScreens: {
      position: ["top", "left"],
    },
    extend: {
      flexGrow: {
        '2': 2,
        '3': 3,
      },
      height: {
        nav: '15vh',
        mobileNav: '10vh',
      },
      screens: {
        "3xl": "2000px",
        "4xl": "2750px",
      },
      colors: {
        "myDarkBlue": "#006BD1",
        "myBlue": "#00C6FF",
        "myLightBlue": "#00BAE2",
        "myGreen": "#009700",
        "myDarkGreen": "#006100",
        "myRed": "#FF0000",
        "myDarkRed": "#B10000",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-debug-screens"), require('@shrutibalasa/tailwind-grid-auto-fit'), function ({ addComponents, addVariant }) {
    addComponents({
      ".myContainer": {
        minHeight: "90vh",
        "@screen lg": {
          minHeight: "85vh",
        },
      },
      ".myContainerFixed": {
        height: "90vh",
        "@screen lg": {
          height: "85vh",
        },
      },
    });
    // @todo add to blog
    addVariant('myFocus', ['&:focus-visible', '&:focus-within', '&:focus']);
  }],
}
