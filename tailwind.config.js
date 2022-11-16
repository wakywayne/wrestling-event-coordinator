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
    height: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      full: '100%',
      screen: '85vh',
      nav: '15vh',
      fullScreen: '100vh',
    }),
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
  plugins: [require("tailwindcss-debug-screens"), require('@shrutibalasa/tailwind-grid-auto-fit')],
}
