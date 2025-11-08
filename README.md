# GALACTICTHUNDER - 3D Editor# React + TypeScript + Vite



A web-based 3D editor/renderer built with React, TypeScript, and Three.js, inspired by 3ds Max and Blender.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## FeaturesCurrently, two official plugins are available:



- **4 Viewport Layout**: Front, Left, Top, and Perspective views- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Primitive Creation**: Add cubes and spheres to the 3D space- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Scene Hierarchy**: View and manage all objects in the scene

- **Interactive Controls**: Orbit camera in perspective view## React Compiler

- **Real-time Rendering**: All viewports update simultaneously

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Tech Stack

## Expanding the ESLint configuration

- **React** - UI framework

- **TypeScript** - Type safetyIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Three.js** - 3D rendering engine

- **Vite** - Fast development build tool```js

export default defineConfig([

## Getting Started  globalIgnores(['dist']),

  {

### Prerequisites    files: ['**/*.{ts,tsx}'],

    extends: [

- Node.js (v16 or higher)      // Other configs...

- npm or yarn

      // Remove tseslint.configs.recommended and replace with this

### Installation      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

Dependencies are already installed. To reinstall:      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

```bash      tseslint.configs.stylisticTypeChecked,

npm install

```      // Other configs...

    ],

### Running the Development Server    languageOptions: {

      parserOptions: {

The dev server is currently running. To start it manually:        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

```bash      },

npm run dev      // other options...

```    },

  },

Then open [http://localhost:5173](http://localhost:5173) in your browser.])

```

### Building for Production

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```bash

npm run build```js

```// eslint.config.js

import reactX from 'eslint-plugin-react-x'

## Project Structureimport reactDom from 'eslint-plugin-react-dom'



```export default defineConfig([

src/  globalIgnores(['dist']),

├── components/  {

│   ├── Viewport.tsx          # Individual viewport component    files: ['**/*.{ts,tsx}'],

│   ├── ViewportGrid.tsx      # 4-panel viewport layout    extends: [

│   ├── Toolbar.tsx           # Toolbar with add object buttons      // Other configs...

│   └── SceneHierarchy.tsx    # Scene object list panel      // Enable lint rules for React

├── scene/      reactX.configs['recommended-typescript'],

│   └── SceneManager.ts       # Scene and object management      // Enable lint rules for React DOM

├── types/      reactDom.configs.recommended,

│   └── types.ts              # TypeScript type definitions    ],

├── App.tsx                   # Main application component    languageOptions: {

└── main.tsx                  # Application entry point      parserOptions: {

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

## Usage      },

      // other options...

1. **Add Objects**: Click "Add Cube" or "Add Sphere" buttons in the toolbar    },

2. **Navigate**: Use mouse to orbit in the perspective view  },

3. **Manage Objects**: View all scene objects in the right panel])

4. **Delete Objects**: Click the "Delete" button next to any object```


## Future Enhancements

- Object selection and manipulation
- Transform tools (move, rotate, scale)
- Material editor
- Import/export functionality
- More primitive types
- Undo/redo system
- Camera controls for orthographic views

## License

MIT
