import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config(); // Load the environment variables from .env

export default defineConfig({
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL
    ),
    "import.meta.env.VITE_SUPABASE_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_KEY
    ),
  },
});
