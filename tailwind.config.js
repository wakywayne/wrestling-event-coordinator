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
      screens: {
        "3xl": "2000px",
        "4xl": "2750px",
      },
      colors: {
        "myDarkBlue": "#5486E5",
        "myBlue": "#00C6FF",
        "myLightBlue": "#0FFCF7",
        "myDarkPurple": "#933A90",
        "myGreen": "#009700",
        "myPink": "#FFB3FF",
        "myTan": "#BEA6A0",
        "myBrown": "#56423D",
        "myRed": "#FF0000",
      },
    },
  },
  plugins: [require("tailwindcss-debug-screens"),],
}
