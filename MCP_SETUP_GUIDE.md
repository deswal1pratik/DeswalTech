# MCP Setup Guide for DeswalTech

This document provides information about all the MCP (Model Context Protocol) servers configured in the DeswalTech project.

## Status

✅ **BrowserMCP has been removed** from the project configuration.

## Configured MCP Servers

### 1. Existing MCPs (Preserved)
- **Figma** - Design tool integration (`http://127.0.0.1:3845/mcp`)
- **shadcn** - UI component library
- **supabase** - Database integration (configured with project ref)
- **Ref** - Developer tools API
- **Exa** - Search capabilities (requires API key)

### 2. Newly Added MCPs

#### 🔵 Vercel MCP
- **Package**: `@vercel/mcp`
- **Purpose**: Integration with Vercel platform for deployment and project management
- **API Key Required**: Yes - `VERCEL_API_TOKEN`
- **Get API Key**: https://vercel.com/account/tokens

#### 🔵 21st.dev MCP
- **Package**: `@21st-dev/mcp`
- **Purpose**: Tools for vibe-crafting and enhancing user experiences
- **API Key Required**: No

#### 🔵 MagicUI MCP
- **Package**: `@magicuidesign/cli@latest`
- **Purpose**: React components and templates library
- **API Key Required**: No
- **Note**: Run `pnpm dlx @magicuidesign/cli@latest install cursor` for CLI integration

#### 🔵 Expo MCP
- **URL**: `https://mcp.expo.dev/mcp`
- **Purpose**: Enhanced AI-assisted tools for Expo projects
- **Authentication**: OAuth
- **Prerequisites**: 
  - Expo account with EAS paid plan
  - Expo SDK 54 or later

#### 🔵 Playwright MCP
- **Package**: `@modelcontextprotocol/server-playwright`
- **Purpose**: Browser automation and testing capabilities
- **API Key Required**: No

#### 🔵 Supadata MCP
- **Package**: `@supadata/mcp`
- **Purpose**: Web and video scraping capabilities
- **API Key Required**: Yes - `SUPADATA_API_KEY`
- **Get API Key**: https://supadata.ai

#### 🔵 Parallel.ai MCP
- **Package**: `@parallel-ai/mcp`
- **Purpose**: Parallel AI model integration
- **API Key Required**: Yes - `PARALLEL_API_KEY`
- **Get API Key**: https://parallel.ai

#### 🔵 SudoApp MCP
- **Package**: `@sudo-app/mcp`
- **Purpose**: Application development tools
- **API Key Required**: Yes - `SUDO_API_KEY`
- **Get API Key**: https://sudoapp.dev

#### 🔵 Perplexity MCP
- **Package**: `@perplexity-ai/mcp`
- **Purpose**: Advanced AI search and analysis
- **API Key Required**: Yes - `PERPLEXITY_API_KEY`
- **Get API Key**: https://perplexity.ai

#### 🔵 GitHub MCP
- **Package**: `@modelcontextprotocol/server-github`
- **Purpose**: GitHub repository and project management integration
- **API Key Required**: Yes - `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Get API Key**: https://github.com/settings/tokens
- **Permissions Needed**: repo, workflow, read:org

#### 🔵 Semgrep MCP
- **Package**: `@semgrep/mcp`
- **Purpose**: Static code analysis and security scanning
- **API Key Required**: Yes - `SEMGREP_API_KEY`
- **Get API Key**: https://semgrep.dev

#### 🔵 Linear MCP
- **Package**: `@linear/mcp`
- **Purpose**: Project management and issue tracking
- **API Key Required**: Yes - `LINEAR_API_KEY`
- **Get API Key**: https://linear.app/settings/api

#### 🔵 Pieces MCP
- **Package**: `@pieces-app/mcp`
- **Purpose**: Code snippet management and collaboration
- **API Key Required**: Yes - `PIECES_API_KEY`
- **Get API Key**: https://pieces.app

#### 🔵 Stripe MCP
- **Package**: `@stripe/mcp`
- **Purpose**: Payment processing and subscription management
- **API Key Required**: Yes - `STRIPE_SECRET_KEY`
- **Get API Key**: https://dashboard.stripe.com/apikeys
- **Documentation**: [Stripe MCP Docs](https://docs.stripe.com/mcp)
- **Tools Available**: Customers, Payments, Subscriptions, Invoices, Products, Coupons, Refunds, and more

## Setup Instructions

### For MCPs Requiring API Keys

1. Obtain your API key from the respective service
2. Open `mcp.json` in your project root
3. Replace the placeholder values:
   - `YOUR_VERCEL_API_TOKEN_HERE` → Your actual Vercel token
   - `YOUR_SUPADATA_API_KEY_HERE` → Your actual Supadata key
   - `YOUR_STRIPE_SECRET_KEY_HERE` → Your actual Stripe secret key
   - etc.

### For MCPs Using NPX Commands

These MCPs will be automatically installed when first accessed. The `-y` flag ensures non-interactive installation.

### For MagicUI CLI

If you want to use the CLI directly:
```bash
pnpm dlx @magicuidesign/cli@latest install cursor
```

## Verification

To verify that your MCPs are properly configured:

1. Restart your IDE (Cursor/VS Code/Claude Desktop)
2. Check the MCP connection status in your IDE
3. Look for any error messages related to missing API keys

## Troubleshooting

### Common Issues

1. **MCP Not Connecting**
   - Verify the API key is correct
   - Check if the service requires additional permissions
   - Ensure you have the required paid plan (e.g., Expo EAS)

2. **NPX Installation Fails**
   - Ensure you have Node.js and npm installed
   - Check your internet connection
   - Try clearing npm cache: `npm cache clean --force`

3. **API Key Issues**
   - Double-check the environment variable name matches exactly
   - Verify the API key hasn't expired
   - Ensure proper permissions are granted

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Cursor MCP Setup](https://cursor.sh/mcp)
- [Claude Desktop MCP Setup](https://claude.ai/mcp)

## Notes

- All MCPs are configured to use the latest versions via `@latest` or specific version tags
- BrowserMCP has been completely removed from the configuration
- Stripe MCP added for payment processing capabilities
- Existing MCPs (Figma, shadcn, supabase, Ref, Exa) remain unchanged
- API keys should be kept secure and never committed to version control
- Consider using environment variables or secrets management for API keys in production
- For Stripe, use test keys (sk_test_...) during development and live keys (sk_live_...) in production

