import { config } from "dotenv";

// Scripts fora do Next (seed) não carregam .env.local sozinhos.
config({ path: ".env.local", quiet: true });
config({ quiet: true });
