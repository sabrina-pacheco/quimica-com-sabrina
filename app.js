const names = {
    'quimica-1': 'Química I',
    'biotecnologia': 'Química para Biotecnologia',
    'quimica-2': 'Química II'
};

const tabs = [...document.querySelectorAll('[data-tab]')];
const panel = document.querySelector('#course-panel');

// Seleciona a disciplina e mostra seu conteúdo.
function selectCourse(id, focusTab = false) {
    if (!names[id]) return;

    tabs.forEach(tab => {
        const active = tab.dataset.tab === id;

        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;

        if (active && focusTab) {
            tab.focus();
        }
    });

    document.querySelector('#selected-name').textContent = names[id];
    panel.setAttribute('aria-labelledby', `tab-${id}`);

    const hasTopics = id === 'quimica-1';

    document.querySelector('#topic-content').hidden = !hasTopics;
    document.querySelector('#course-empty').hidden = hasTopics;
    document.querySelector('#course-status').textContent =
        hasTopics ? '11 temas' : 'Em preparação';
}

// Permite selecionar as abas pelo mouse ou pelo teclado.
tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        selectCourse(tab.dataset.tab);
    });

    tab.addEventListener('keydown', event => {
        const offsets = {
            ArrowRight: 1,
            ArrowLeft: -1
        };

        let target;

        if (event.key in offsets) {
            target = (index + offsets[event.key] + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
            target = 0;
        } else if (event.key === 'End') {
            target = tabs.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        selectCourse(tabs[target].dataset.tab, true);
    });
});

// Conecta os cards das disciplinas à área de conteúdos.
document.querySelectorAll('[data-course]').forEach(button => {
    button.addEventListener('click', () => {
        selectCourse(button.dataset.course);

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        document.querySelector('#conteudos').scrollIntoView({
            behavior: reduceMotion ? 'instant' : 'smooth'
        });

        panel.focus({ preventScroll: true });
    });
});

// Alterna entre os modos claro e escuro.
const themeButton = document.querySelector('#theme-toggle');

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);

    themeButton.setAttribute(
        'aria-label',
        dark ? 'Ativar modo claro' : 'Ativar modo escuro'
    );

    themeButton.setAttribute('aria-pressed', String(dark));

    document.querySelector('meta[name="theme-color"]').content =
        dark ? '#15221e' : '#0d6355';
}

// Recupera a preferência de tema salva no navegador.
try {
    setTheme(localStorage.getItem('quimica-theme') === 'dark');
} catch {
    setTheme(false);
}

themeButton.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');

    setTheme(dark);

    try {
        localStorage.setItem('quimica-theme', dark ? 'dark' : 'light');
    } catch {
        /* O tema continua funcionando sem armazenamento. */
    }
});

// Abre e fecha a janela "Sobre o espaço".
const dialog = document.querySelector('#about-dialog');

document.querySelector('#about-open').addEventListener('click', () => {
    dialog.showModal();
});

document.querySelector('#about-close').addEventListener('click', () => {
    dialog.close();
});

document.querySelector('#about-done').addEventListener('click', () => {
    dialog.close();
    document.querySelector('#disciplinas').scrollIntoView();
});

// Fecha a janela ao clicar fora dela.
dialog.addEventListener('click', event => {
    if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();

        const clicouFora =
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom;

        if (clicouFora) {
            dialog.close();
        }
    }
});