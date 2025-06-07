# src/assets

Any assets placed in src/assets will be bundled with application.

If you intend to reference static assets from your application code then they must be placed in this directory (or anywhere inside of the src directory).

## Current Structure:

- src/assets/images/
  - logo.png (Your Healer Logo)
  - hospital.png (Hospital building image for sign-in page)
  - placeholder.svg (Default avatar placeholder)

## Usage:

Import images in components:

```tsx
import logoImg from "@/assets/images/logo.png";
import hospitalImg from "@/assets/images/hospital.png";
```

Or use dynamic imports for better performance:

```tsx
const logoUrl = new URL("@/assets/images/logo.png", import.meta.url).href;
```
