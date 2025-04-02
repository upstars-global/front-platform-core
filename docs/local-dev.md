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