# Security Notice

## Environment Variables

This project uses environment variables to store sensitive information like API keys and database credentials.

### Setup

1. Copy `.env.example` to `.env`
2. Fill in your actual credentials
3. **NEVER commit `.env` files to git**

### Files to Keep Secret

- `.env`
- `.env.local`
- Any file containing:
  - Supabase keys
  - Database passwords
  - API secrets
  - JWT secrets

### What's Safe to Commit

- `.env.example` (template with no real values)
- Configuration files without secrets
- Code that references environment variables

### If You Accidentally Committed Secrets

1. **Immediately rotate/regenerate** all exposed credentials in Supabase dashboard
2. Remove the file from git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/secret/file" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if allowed):
   ```bash
   git push origin --force --all
   ```

### Current Protection

- `.gitignore` is configured to ignore all `.env*` files
- GitHub push protection will block commits with secrets
