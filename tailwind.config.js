/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app/views/**/*.tsx"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        logs: false,
    },
}
