/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app/views/**/*.tsx"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            "nord",
            "business",
        ],
        logs: false,
    },
}
