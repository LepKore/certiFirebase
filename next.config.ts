import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "export",
    experimental: {
        agentFeedback: true,
    },
    // cacheComponents (PPR) no es compatible con output: "export".
    // Descomentar solo si dejas de usar export y sirves desde un runtime Node.
    // cacheComponents: true,
    // partialPrefetching: true,
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;
