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

    const contentByCourse = {
        'quimica-1': '#topic-content',
        'quimica-2': '#quimica-2-content'
    };
    const hasTopics = Boolean(contentByCourse[id]);

    Object.values(contentByCourse).forEach(selector => {
        document.querySelector(selector).hidden = selector !== contentByCourse[id];
    });
    document.querySelector('#course-empty').hidden = hasTopics;
    document.querySelector('#course-status').textContent =
        id === 'quimica-1' ? '11 temas' : id === 'quimica-2' ? '8 temas' : 'Em preparação';
}

// Abre um tema quando a URL termina com, por exemplo, #quimica-1-tema-09.
function topicFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const topic = document.getElementById(id);

    return topic?.matches('.topic-card') ? topic : null;
}

function openTopicFromHash() {
    const topic = topicFromHash();

    if (!topic) return;

    selectCourse(topic.dataset.course || 'quimica-1');
    topic.querySelector('details')?.setAttribute('open', '');

    requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        topic.scrollIntoView({
            behavior: reduceMotion ? 'instant' : 'smooth',
            block: 'start'
        });
    });
}

function topicUrl(topic) {
    return `${window.location.origin}${window.location.pathname}#${topic.id}`;
}

function goToTopic(topic) {
    if (window.location.hash === `#${topic.id}`) openTopicFromHash();
    else window.location.hash = topic.id;
}

async function copyTopicUrl(button) {
    const topic = button.closest('.topic-card');
    const url = topicUrl(topic);

    try {
        await navigator.clipboard.writeText(url);
        button.textContent = 'Link copiado';
    } catch {
        window.prompt('Copie o link deste tema:', url);
    }

    window.setTimeout(() => {
        button.textContent = 'Copiar link do tema';
    }, 2200);
}

document.querySelectorAll('.topic-card').forEach(topic => {
    topic.setAttribute('tabindex', '-1');

    const linkButton = document.createElement('button');
    linkButton.type = 'button';
    linkButton.className = 'topic-link';
    linkButton.textContent = 'Copiar link do tema';
    linkButton.setAttribute(
        'aria-label',
        `Copiar link direto para ${topic.querySelector('h4').textContent}`
    );
    linkButton.addEventListener('click', () => copyTopicUrl(linkButton));
    topic.querySelector('.topic-top').append(linkButton);

    topic.addEventListener('click', event => {
        if (event.target.closest('button, a, summary, details')) return;
        goToTopic(topic);
    });
});

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

openTopicFromHash();
window.addEventListener('hashchange', openTopicFromHash);

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
