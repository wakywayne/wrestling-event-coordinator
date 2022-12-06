### I learned how to make the rems adjust based on viewport
- This often mens that text will have two breakpoints
    - default which will be larger (*xl*)
    - and xl: base or lg
    - This also works with other sizes that use rem so keep that in mind

### I learned that making a container class that will be set to the exact inverse of what the navbar should be works really well 
- Most of the time you will make this be position relative and w-full
    - This can then be used to set percentage widths and exc

### Amazing form for create Event *both styles and functional error handling
- we use zod and react hook form
- build a grid with the exact cols and forms we need in our css file
- and make flex box form groups

### How to handle focus 
- Make a custom hover property in tailwind config 
- Then you must get rid of the other default styles if it is a form 
- only certain elements can be focused like buttons and inputs by default

## How I modified my tailwind config file:
```javascript
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
        '4':4,
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
```


### Next thing
