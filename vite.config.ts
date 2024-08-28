import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import checker from "vite-plugin-checker";

export default defineConfig({
    base: "",
    server: {
        port: 3000
    },
    plugins: [
        vue(),
        checker({vueTsc: true})
    ],
})
