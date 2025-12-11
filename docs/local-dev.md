[Back](../readme.md)

# Getting Started with the Package

To begin working with this package, you need to install and configure it within the consuming project. Please refer to the following documentation for installation and setup instructions:

**Installation and Configuration:** [Link to installation and setup documentation](./installation.md)

## Local Development

For local development, you can use the `link:` protocol in package.json to link your local version of the package. This provides real-time updates without needing to rebuild the package.

In `package.json` where you use `front-platform-core`, add dependency using the `link:` protocol:
```json
{
   "dependencies": {
      "front-platform-core": "link:../../../front-platform-core"
   }
}
```

Path must be relative to the `package.json` directory.

After modifying the dependency, run:
```bash
pnpm install
```

### Benefits of `link:` Protocol

- **Instant updates:** Changes in the linked package are immediately available
- **No rebuild required:** Points directly to source code
- **Faster development:** Perfect for active development on both packages

### Removing Local Link

To switch back to the published version:

1. Update `package.json`:
```json
   {
      "dependencies": {
         "front-platform-core": "^1.0.0"
      }
   }
```

2. Reinstall dependencies:
```bash
   pnpm install
```