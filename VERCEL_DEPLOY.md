# Vercel Deployment Guide

This project contains a Next.js application within a subdirectory (`video-call-next`). To ensure a successful deployment on Vercel and avoid 404 errors, please follow these configuration steps.

## Critical Configuration

1.  **Import Project**: Import the repository into Vercel.
2.  **Framework Preset**: Select **Next.js**.
3.  **Root Directory**:
    *   **IMPORTANT**: You MUST change the **Root Directory** setting from `/` to `video-call-next`.
    *   Click "Edit" next to Root Directory and select the `video-call-next` folder.

## Why is this needed?

The root of this repository contains a custom Node.js server (`server.js`) and other configuration files that are separate from the frontend Next.js application. Vercel expects to build the frontend application, so directing it to the `video-call-next` folder ensures it finds the correct `package.json` and `next.config.ts`.
