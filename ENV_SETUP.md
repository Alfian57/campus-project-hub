# Environment Variables Setup

Before running the application, you need to set up the following environment variables.

## Creating .env.local

Create a file named `.env.local` in the root directory with the following content:

```bash
# Midtrans Configuration (Sandbox)
# Get your keys from: https://dashboard.midtrans.com
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_IS_PRODUCTION=false
```

## Getting Midtrans Credentials

1. Go to [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Sign up or log in
3. Navigate to Settings → Access Keys
4. Copy your **Sandbox** credentials:
   - Client Key (starts with `SB-Mid-client-`)
   - Server Key (starts with `SB-Mid-server-`)
5. Paste them into your `.env.local` file
6. Restart your dev server after adding the variables

## Important Notes

- Keep `.env.local` secure and never commit it to git
- For production, use Production credentials and set `MIDTRANS_IS_PRODUCTION=true`
- The `NEXT_PUBLIC_` prefix makes the variable available to the client side
