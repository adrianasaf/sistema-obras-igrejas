import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A página /historico lê docs/10-HISTORICO-DESENVOLVIMENTO.md em tempo de
  // execução; garante que o arquivo seja incluído no deploy (Vercel).
  outputFileTracingIncludes: {
    "/historico": ["./docs/10-HISTORICO-DESENVOLVIMENTO.md"],
  },
};

export default nextConfig;
