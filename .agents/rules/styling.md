# Styling Guidelines

- Do **NOT** insert inline `style={{ ... }}` objects directly into JSX / TSX code files.
- All component styles must be written in dedicated **CSS Module** files (`*.module.css`) and imported as class names (e.g. `import styles from './Navbar.module.css'`).
