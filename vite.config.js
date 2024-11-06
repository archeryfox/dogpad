import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    plugins: [react()]
    // To access env vars here use process.env.TEST_VAR
  });
}