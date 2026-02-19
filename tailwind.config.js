/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}", // บรรทัดนี้ต้องมีเพื่อให้ครอบคลุมทุกไฟล์ใน src
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"LINE Seed Sans TH"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}