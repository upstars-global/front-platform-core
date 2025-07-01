[Back](../readme.md)

# Getting Started with the Package

To begin working with this package, you need to install and configure it within the consuming project. Please refer to the following documentation for installation and setup instructions:

**Installation and Configuration:** [Link to installation and setup documentation](./installation.md)

## Local Development Using `yarn link`

If you intend to develop the package locally, follow these steps to link it with your project using `yarn link`:

1. Navigate to the root of this package in terminal
   
   ```bash
   cd /directory-with-package/front-platform-core
   yarn link
   ```

2. Go to the project where you want to use the linked package:

   ```bash
   cd /path/to/your/consuming-project
   yarn link "front-platform-core"
   ```

3. After linking, your project will use the local version of the package.

4. If needed, restart your development server to apply the changes.

Refer to the official Yarn documentation for additional details: https://classic.yarnpkg.com/en/docs/cli/link/

## FOR LOCAL DEVELOPMENT WITH PNP ENABLED

you can't use `yarn link` command with pnp because of node_modules not present in pnp mode,
instead of using `yarn link` you can use portal protocol in package.json https://yarnpkg.com/protocol/portal

in `package.json` where you use `front-platform-core` add dependency using portal protocol, example:


```json
{
   "dependencies": {
      "front-platform-core": "portal:../../../front-platform-core"
   }
}
```

path must be relative to the `package.json` directory