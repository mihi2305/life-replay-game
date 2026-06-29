const fs = require("fs");
const path = require("path");

const config = {
  url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ""
};

const output = `window.LIFE_REPLAY_SUPABASE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
const outputPath = path.join(__dirname, "..", "supabaseConfig.js");

fs.writeFileSync(outputPath, output);

const mode = config.url && config.anonKey ? "configured" : "localStorage fallback";
console.log(`Generated supabaseConfig.js (${mode})`);
