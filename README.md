# Vercel Clipboard

Vercel Clipboard is a simple web-based application that allows you to share text and files across multiple devices.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgacfox%2Fvercel-clipboard)

## Screenshots

![](doc/screenshot.webp)

## Requirements

Before deploying the project to Vercel, make sure to create following necessary resources in your Vercel account and link them to your environment.

- **Blob Store**: For uploading and downloading files
- **Upstash for Redis**: For caching session data
- **Neon**: For persisting structured data
- **Edge Config Store**: For storing configuration settings

Tips: If you deploy before creating storages and encounter application errors such as `vercel kv invocation failed`, try redeploying by clicking `Deployments -> Redeploy` button after creating and linking these storages.

## Local Development

To set up the project locally, follow these steps:

1. Fork and clone this repository.
2. Create a new Vercel project, link it to your database, and connect it to your project.
3. Once everything is set up, run the following commands:

```bash
npm install && npx vercel env pull .env.development.local && npm run dev
```

## Configurations

This project is designed for multiple users. If you'd like to allow others to register, enable the registration page by setting `allowRegister` to `true` in the Edge Config Store.
