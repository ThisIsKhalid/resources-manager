# Resources Manager

A lightning-fast, beautifully designed Next.js application for curating, organizing, and serving raw HTML educational resources and interactive components.

## Features

- **Isolated HTML Rendering:** Serves static `.html` files securely through an iframe and API route to prevent conflicts with the main application's Next.js layouts and styles.
- **Native Tailwind CSS v4:** Any standard Tailwind utility classes written directly inside your raw HTML documents will be automatically detected, compiled, and applied. No build step required for your documents!
- **Zero-Config Folder Routing:** Simply drop HTML files into `src/resources/`. The system automatically builds the navigation, routes, and clean URLs (`/your-folder/your-file`).
- **Category Grouping:** Organizes resources based on their parent folder inside the `src/resources` directory (e.g., placing a file in `src/resources/Frontend/` automatically groups it under "Frontend" in the UI).
- **Metadata Extraction:** Embed a hidden JSON comment at the top of your HTML files to give them rich titles and descriptions:
  ```html
  <!-- { "title": "Advanced React Patterns", "description": "A comprehensive guide to custom hooks." } -->
  ```
- **Real-Time Search & Filtering:** Instantly find what you need using the search bar on the homepage or the navigation modal.
- **Favorites System:** "Star" your most used resources to pin them to the top of your workspace. Favorites are stored persistently in your browser's local storage.
- **Premium Dark Aesthetics:** A sleek, modern user interface built with deep teals, indigo accents, and glassmorphism effects.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Add Resources

1. Navigate to the `src/resources` directory.
2. (Optional) Create subdirectories to act as categories (e.g., `src/resources/Backend/`).
3. Add your standard `.html` files. They can include their own `<html>`, `<head>`, `<style>`, and scripts.
4. Add Tailwind classes directly to your HTML tags.
5. (Optional) Add metadata to the very top of your HTML file for better presentation:
   ```html
   <!-- { "title": "My Beautiful Guide", "description": "This is a short description for the card." } -->
   <html>...</html>
   ```

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** React Icons (`react-icons`)
- **Language:** TypeScript

## Folder Structure

- `src/app/[[...slug]]/`: The catch-all dynamic route that renders either the Homepage Grid or the requested HTML resource inside an iframe.
- `src/app/api/html/[[...slug]]/`: The API endpoint that reads files from the file system and serves them as raw `text/html`.
- `src/components/`: Reusable React components (Navbar, HomepageGrid, etc.).
- `src/lib/resources.ts`: The core server-side utility that traverses the file system, extracts metadata, and maps out the available resources.
- `src/resources/`: The directory where all user-provided HTML content lives.
