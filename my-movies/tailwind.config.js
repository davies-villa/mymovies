module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'], 
      },
      boxShadow: {
        'custom-black': '2px 2px 5px rgba(0, 0, 0, 0.3)', 
      },
      fontWeight: {
        extraBold: 800,
        semiBold: 600,
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.9))',
        'card-bg': "url('https://i.ibb.co/M9LB3Kq/Glassmorphism-Background.png')", 
      },
      colors: {
      },
    },
  },
  plugins: [],
}
