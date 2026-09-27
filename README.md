# Base Pay Integration

A minimal crypto checkout page built with Next.js that accepts payments on [Base](https://www.base.org) (Coinbase's Ethereum L2) using the official [`@base-org/account`](https://www.npmjs.com/package/@base-org/account) SDK. The page initiates a payment and polls for its on-chain status, rendering idle → processing → completed / failed states with shadcn/ui components.

> **Demo only:** the recipient address (`0x749B7b7A6944d72266Be9500FC8C221B6A7554Ce`), amount (`1.00` USDC test value), and network flag are hard-coded in `app/page.tsx`. Replace them with your own before any real use.

## What it does

- Opens a **Base Pay** checkout via `pay({ amount, to, testnet })` from `@base-org/account`
- **Polls payment status** every 2 seconds with `getPaymentStatus({ id, testnet })` until `completed` or `failed`
- Shows clear UX states: idle checkout card, processing spinner, success check, and error alerts
- All logic runs client-side — the app is fully static-exportable and can be hosted on any static host (Cloudflare Pages, GitHub Pages, Vercel)

## Features

- Base Pay checkout with official `@base-org/account` SDK
- Payment status polling with graceful failure handling
- shadcn/ui checkout card (`Card`, `Alert`, `Button`)
- Responsive Tailwind layout with Geist font
- Dark/light theme support via `next-themes` `ThemeProvider`

## Tech stack

- **Next.js 14.2** (App Router, `output: "export"` static build)
- **React 18**, **TypeScript**
- **Tailwind CSS 3.4**, `tailwindcss-animate`
- **shadcn/ui** components, **Radix UI** primitives, **Lucide** icons
- **@base-org/account** — Coinbase Base Pay SDK
- **pnpm** (package manager)

## Quick start

```bash
# 1. Install dependencies (pnpm preferred; npm also works)
pnpm install

# 2. Run the dev server
pnpm dev
# → http://localhost:3000

# 3. Build a static export
pnpm build
# → static HTML in ./out
```

> pnpm note (containers without CAP_CHOWN): if `pnpm install` fails with `EPERM` on lockfile writes, edit `pnpm-lock.yaml` by hand and validate with `pnpm install --frozen-lockfile`.

## Project structure

```
base-pay-integration/
├── app/
│   ├── page.tsx            # Checkout page: Base Pay button + status polling
│   ├── layout.tsx          # Root layout, Geist font, ThemeProvider
│   └── globals.css
├── components/
│   ├── theme-provider.tsx
│   └── ui/                 # shadcn/ui primitives (alert, button, card, …)
├── lib/utils.ts            # cn() helper
├── next.config.mjs         # output: "export", unoptimized images
├── tailwind.config.ts
└── pnpm-lock.yaml
```

## Environment variables

None required. Configuration lives in constants at the top of `app/page.tsx`:

| Constant            | Default                                      | Meaning                       |
| ------------------- | -------------------------------------------- | ----------------------------- |
| `RECIPIENT_ADDRESS` | `0x749B…7554Ce`                              | Wallet receiving the payment  |
| `AMOUNT`            | `"1.00"`                                     | Amount to charge              |
| `TESTNET`           | `false`                                      | Set `true` to use Base Sepolia |

## Deployment notes

- Fully static: `pnpm build` emits `./out`, deployable to **Cloudflare Pages**, GitHub Pages, or any static host.
- No server components, no API routes, no secrets — the wallet interaction happens in the browser.
- Never commit real recipient addresses or private keys; keep test vs. mainnet flags explicit (`TESTNET`).

---

Built by Girish Lade — [ladestack.in](https://ladestack.in)
