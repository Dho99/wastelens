import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["phosphorescently-stretchier-sharyl.ngrok-free.dev"],
    logging: {
        fetches: {
            fullUrl: true,
        },
        browserToTerminal: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/9.x/initials/svg",
            },
        ],
    },
};

export default nextConfig;
