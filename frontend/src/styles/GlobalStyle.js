// frontend/src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    :root {
        /* Colors - will be overridden by theme provider */
        --color-primary: #6A82FB;
        --color-secondary: #FC5C7D;
        --color-background-light: #F0F2F5; /* Light grey background */
        --color-background-dark: #2C3E50; /* Dark blue background */
        --color-text-dark: #333333;
        --color-text-light: #666666;
        --color-white: #FFFFFF;
        --color-black: #000000;

        /* Gradients */
        --gradient-primary: linear-gradient(to right, #6A82FB, #FC5C7D); /* Blue to Pink */
        --gradient-secondary: linear-gradient(to right, #FC5C7D, #6A82FB); /* Pink to Blue */

        /* Shadows */
        --shadow-light: 0 2px 5px rgba(0, 0, 0, 0.08);
        --shadow-medium: 0 5px 15px rgba(0, 0, 0, 0.1);
        --shadow-strong: 0 10px 30px rgba(0, 0, 0, 0.2);

        /* Borders */
        --border-radius-soft: 12px;
        --border-radius-round: 9999px; /* For pill-shaped buttons */

        /* Transitions */
        --transition-speed: 0.3s ease-in-out;
    }

    /* Basic Reset */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html, body, #root {
        height: 100%;
        width: 100%;
        font-family: 'Inter', sans-serif;
        color: var(--color-text-dark); /* Default text color, overridden by theme */
        background-color: var(--color-background-light); /* Default background, overridden by theme */
    }

    body {
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button, input, textarea {
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-bottom: 0.5em;
        font-weight: 700;
    }

    p {
        margin-bottom: 1em;
    }
`;

export default GlobalStyle;