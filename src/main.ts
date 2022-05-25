import init, { greet } from '../game-of-life/pkg/game_of_life';
import './style.scss';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<h1>Hello Vite!</h1>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;

const button = document.querySelector<HTMLButtonElement>('#button')!;

init().then(() => {
    console.log('init wasm-pack');
    greet('from vite!');


    button.addEventListener('click', () => {
        console.log('click');
        greet('Andreas');
    });
});
