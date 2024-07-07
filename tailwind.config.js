/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        qgray: "#F0F3F9",
        qblack: "#4F5976",
        qpurple: "#7A99F8",
        qred: "#DB4533",
      },
      textColor: {
        qgray: "#F0F3F9",
        qblack: "#4F5976",
        qpurple: "#7A99F8",
        qblue: "#4F71BE",
        qred: "#DB4533",
      },
      borderColor: {
        qred: "#DB4533",
        qblue: "#4F71BE",
        qpurple: "#7A99F8",
      },
      outlineColor: {
        qred: "#DB4533",
        qblue: "#4F71BE",
        qpurple: "#7A99F8",
      },
    },
  },
  plugins: [],
};
