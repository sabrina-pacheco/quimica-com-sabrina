const byId = (id) => document.getElementById(id)
const format = (value, digits = 0) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: digits, maximumFractionDigits: digits
}).format(value).replace('-', '−')
const signed = (value, digits) => (value > 0 ? '+' : '') + format(value, digits)

const profiles = {
  exo: {
    title: 'A reação libera calor',
    description: 'O calor sai do sistema e vai para a vizinhança. Os produtos têm entalpia menor que a dos reagentes.',
    example: 'Exemplo: a combustão do amendoim.',
    start: 116, end: 181, curve: 'M65 116H130C171 116 175 43 225 43S269 181 323 181H365',
    sign: 'ΔH < 0', color: '#08734e'
  },
  endo: {
    title: 'A reação absorve calor',
    description: 'O calor vai da vizinhança para o sistema. Os produtos têm entalpia maior que a dos reagentes.',
    example: 'Exemplo: a decomposição térmica do carbonato de cálcio.',
    start: 181, end: 116, curve: 'M65 181H130C171 181 175 43 225 43S269 116 323 116H365',
    sign: 'ΔH > 0', color: '#a85025'
  }
}
function showProfile(key) {
  const p = profiles[key]
  document.querySelectorAll('[data-profile]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.profile === key))
  })
  byId('profile-copy').innerHTML = '<h3>' + p.title + '</h3><p>' + p.description
    + '</p><p class="concept-example">' + p.example + '</p>'
  byId('profile-curve').setAttribute('d', p.curve)
  byId('profile-curve').setAttribute('stroke', p.color)
  byId('profile-guide').setAttribute('d', 'M70 ' + p.start + 'H397M326 ' + p.end + 'H397')
  const direction = Math.sign(p.end - p.start)
  byId('profile-arrow').setAttribute('d', 'M393 ' + (p.start + direction * 5) + 'V' + (p.end - direction * 5))
  byId('profile-reactants').setAttribute('y', p.start - 12)
  byId('profile-products').setAttribute('y', p.end + 24)
  byId('profile-delta').setAttribute('x', '402')
  byId('profile-desc').textContent = p.description + ' ' + p.sign + '.'
}
document.querySelectorAll('[data-profile]').forEach((button) => {
  button.addEventListener('click', () => showProfile(button.dataset.profile))
})
showProfile('exo')

const carbon = 'C<small>(grafite)</small>'
const oxygen = 'O₂<small>(g)</small>'
const carbonDioxide = 'CO₂<small>(g)</small>'
const carbonMonoxide = 'CO<small>(g)</small>'
const originalA = { left: carbon + ' + ' + oxygen, right: carbonDioxide, heat: -393.5 }
const originalB = { left: '2 ' + carbonMonoxide + ' + ' + oxygen, right: '2 ' + carbonDioxide, heat: -566 }
const doubledA = { left: '2 ' + carbon + ' + 2 ' + oxygen, right: '2 ' + carbonDioxide, heat: 2 * originalA.heat }
const reversedB = { left: originalB.right, right: originalB.left, heat: -originalB.heat }
const totalHeat = doubledA.heat + reversedB.heat

function equation(label, reaction, animation = '') {
  const heat = reaction.heat === undefined ? ''
    : '<span class="equation-heat">ΔH° = ' + signed(reaction.heat, 1) + ' kJ</span>'
  return '<div class="equation-row ' + animation + '"><span class="equation-label">' + label
    + '</span><div class="chemical equation"><span class="reaction-side reactants">' + reaction.left
    + '</span><span class="reaction-arrow" aria-label="produz">→</span><span class="reaction-side products">'
    + reaction.right + '</span></div>' + heat + '</div>'
}
const summed = {
  left: '2 ' + carbon + ' + 2 ' + oxygen + ' + 2 ' + carbonDioxide,
  right: '2 ' + carbonDioxide + ' + 2 ' + carbonMonoxide + ' + ' + oxygen
}
const canceled = {
  left: '2 ' + carbon + ' + ' + oxygen + ' + <del aria-label="um O₂ cancelado">' + oxygen
    + '</del> + <del aria-label="dois CO₂ cancelados">2 ' + carbonDioxide + '</del>',
  right: '<del aria-label="dois CO₂ cancelados">2 ' + carbonDioxide + '</del> + 2 ' + carbonMonoxide
    + ' + <del aria-label="um O₂ cancelado">' + oxygen + '</del>'
}
const net = { left: '2 ' + carbon + ' + ' + oxygen, right: '2 ' + carbonMonoxide, heat: totalHeat }
const heatSum = '<div class="stage-math">ΔH°<sub>total</sub> = (' + signed(doubledA.heat, 1)
  + ') + (' + signed(reversedB.heat, 1) + ') = <strong>' + signed(totalHeat, 1) + ' kJ</strong></div>'
const stages = [
  { name: 'Ler as equações', title: 'Conheça as duas equações parciais',
    description: 'Queremos 2 CO entre os produtos. Observe onde ele está na equação B.',
    rows: equation('A', originalA) + equation('B', originalB),
    note: 'Os valores de ΔH° em kJ se referem às quantidades indicadas pelos coeficientes de cada equação.' },
  { name: 'Multiplicar A', title: 'Multiplique a equação A por 2',
    description: 'A reação global consome 2 C. Dobre todos os coeficientes de A e o seu ΔH°.',
    rows: equation('2 × A', doubledA, 'scale-row') + equation('B', originalB),
    note: '2 × (−393,5 kJ) = −787,0 kJ.' },
  { name: 'Inverter B', title: 'Inverta a equação B',
    description: 'Troque reagentes e produtos de lugar para que 2 CO apareça do lado dos produtos. Troque também o sinal de ΔH°.',
    rows: equation('2 × A', doubledA) + equation('B invertida', reversedB, 'reverse-row'),
    note: 'O valor passa de −566,0 kJ para +566,0 kJ.' },
  { name: 'Somar os lados', title: 'Some reagentes e produtos',
    description: 'Reúna os termos da esquerda em um lado e os da direita no outro. Procure as espécies que aparecem dos dois lados.',
    rows: equation('Soma', summed, 'sum-row'),
    note: 'Os dois valores de ΔH° que entram na soma são −787,0 kJ e +566,0 kJ.' },
  { name: 'Cancelar espécies', title: 'Cancele o que está dos dois lados',
    description: 'Cancele 2 CO₂ em cada lado. Dos 2 O₂ à esquerda, cancele apenas 1 O₂ com o da direita. Sobra 1 O₂ à esquerda.',
    rows: equation('Cancelamento', canceled, 'cancel-row'),
    note: 'Só cancele a mesma espécie no mesmo estado físico e na quantidade comum aos dois lados.' },
  { name: 'Obter o ΔH total', title: 'Leia a equação global e some os ΔH°',
    description: 'A equação simplificada coincide com a reação global. Some os valores após as transformações.',
    rows: equation('Global', net, 'result-row') + heatSum,
    note: 'ΔH° é negativo. A reação global, como está escrita, libera 221,0 kJ para cada 2 mol de CO formados.' }
]
let step = 0
let playback = null
const stepList = byId('hess-steps')
stepList.innerHTML = stages.map((stage, index) =>
  '<li><button type="button" data-step="' + index + '"><span class="step-number">' + (index + 1)
  + '</span><span>' + stage.name + '</span></button></li>').join('')
const stepButtons = [...stepList.querySelectorAll('button')]
const prevStep = byId('hess-prev')
const nextStep = byId('hess-next')
const playStep = byId('hess-play')

function syncPlayback() {
  const playing = playback !== null
  playStep.innerHTML = playing ? '<span aria-hidden="true">Ⅱ</span> Pausar' : '<span aria-hidden="true">▷</span> Reproduzir'
  playStep.setAttribute('aria-label', playing ? 'Pausar reprodução' : 'Reproduzir etapas')
}
function pauseHess() {
  clearInterval(playback)
  playback = null
  syncPlayback()
}
function showStep(next) {
  step = next
  const stage = stages[step]
  stepButtons.forEach((button, index) => {
    if (index === step) button.setAttribute('aria-current', 'step')
    else button.removeAttribute('aria-current')
  })
  const atEnd = step === stages.length - 1
  byId('target-heat').textContent = 'ΔH° = ' + (atEnd ? signed(totalHeat, 1) + ' kJ' : '?')
  byId('hess-stage').innerHTML = '<div class="stage-content"><span class="tiny-label">ETAPA ' + (step + 1)
    + ' DE ' + stages.length + '</span><h3>' + stage.title + '</h3><p>' + stage.description
    + '</p><div class="equations">' + stage.rows + '</div><p class="stage-note">' + stage.note + '</p></div>'
  prevStep.disabled = step === 0
  nextStep.disabled = atEnd
  if (atEnd) pauseHess()
}
function goManually(next) {
  pauseHess()
  showStep(next)
}
stepButtons.forEach((button, index) => button.addEventListener('click', () => goManually(index)))
prevStep.addEventListener('click', () => goManually(step - 1))
nextStep.addEventListener('click', () => goManually(step + 1))
byId('hess-reset').addEventListener('click', () => goManually(0))
playStep.addEventListener('click', () => {
  if (playback !== null) {
    pauseHess()
    return
  }
  if (step === stages.length - 1) showStep(0)
  playback = setInterval(() => showStep(step + 1), 5200)
  syncPlayback()
})
showStep(0)

const waterSpecificHeat = 4.18
const heatKj = (mass, delta) => mass * waterSpecificHeat * delta / 1000
const calorInputs = ['water-mass', 'temp-start', 'temp-end'].map(byId)
function showCalor() {
  const [mass, initial, final] = calorInputs.map((input) => input.valueAsNumber)
  const delta = final - initial
  const heat = heatKj(mass, delta)
  byId('water-mass-label').value = format(mass) + ' g'
  byId('temp-start-label').value = format(initial) + ' °C'
  byId('temp-end-label').value = format(final) + ' °C'
  byId('calor-steps').textContent = 'ΔT = ' + format(final) + ' − ' + format(initial) + ' = ' + format(delta) + ' °C'
  byId('calor-substitution').textContent = 'Q = ' + format(mass) + ' × 4,18 × (' + format(delta) + ') J'
  byId('calor-value').value = signed(heat, 2) + ' kJ'
  byId('calor-sense').textContent = heat === 0 ? 'A temperatura ficou constante. Neste modelo, Q é zero.'
    : heat > 0 ? 'A água absorveu calor.' : 'A água cedeu calor.'
}
calorInputs.forEach((input) => input.addEventListener('input', showCalor))
showCalor()

const trials = [
  { water: 100, start: 22, end: 35, initial: 0.90, residue: 0.45 },
  { water: 80, start: 21, end: 39, initial: 1.05, residue: 0.51 },
  { water: 120, start: 23, end: 33, initial: 0.86, residue: 0.47 }
]
const trialSelect = byId('trial')
const trialAnswer = byId('trial-answer')
const trialFeedback = byId('trial-feedback')
function trialResult() {
  const trial = trials[Number(trialSelect.value)]
  const delta = trial.end - trial.start
  const consumed = trial.initial - trial.residue
  const heat = heatKj(trial.water, delta)
  return { trial, delta, consumed, heat, perGram: heat / consumed }
}
function showTrial() {
  const { trial, delta, consumed, heat, perGram } = trialResult()
  const entries = [
    ['Massa de água', format(trial.water) + ' g'],
    ['Temperatura inicial', format(trial.start) + ' °C'],
    ['Temperatura final', format(trial.end) + ' °C'],
    ['Massa inicial do amendoim', format(trial.initial, 2) + ' g'],
    ['Massa do resíduo', format(trial.residue, 2) + ' g']
  ]
  byId('measurements').innerHTML = entries.map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('')
  byId('trial-solution').textContent = 'ΔT = ' + format(delta) + ' °C. Q da água = '
    + format(trial.water) + ' × 4,18 × ' + format(delta) + ' J ≈ ' + format(heat, 2)
    + ' kJ. Massa consumida = ' + format(trial.initial, 2) + ' − ' + format(trial.residue, 2)
    + ' = ' + format(consumed, 2) + ' g. Dividindo o calor pela massa consumida, obtemos '
    + format(perGram, 1) + ' kJ/g.'
  trialAnswer.value = ''
  trialFeedback.hidden = true
  byId('trial-details').open = false
}
function feedback(element, kind, message) {
  element.className = 'feedback ' + kind
  element.hidden = false
  element.textContent = message
}
trialSelect.addEventListener('change', showTrial)
trialAnswer.addEventListener('input', () => { trialFeedback.hidden = true })
byId('trial-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const raw = trialAnswer.value.trim().replace('−', '-')
  if (!/^[+-]?(?:\d+(?:[,.]\d+)?|[,.]\d+)$/.test(raw)) {
    feedback(trialFeedback, 'try-again', 'Digite um número, como 12,3.')
    return
  }
  const answer = Number(raw.replace(',', '.'))
  const { perGram } = trialResult()
  if (Math.abs(answer - perGram) < 0.051) {
    feedback(trialFeedback, 'correct', 'Correto! A água recebeu cerca de ' + format(perGram, 1)
      + ' kJ por grama consumida neste ensaio.')
  } else {
    feedback(trialFeedback, 'try-again', 'Tente novamente. Subtraia a massa do resíduo da massa inicial e divida o calor da água em kJ por essa diferença.')
  }
})
showTrial()

const questions = [
  { topic: 'Troca de calor', prompt: 'A água ao redor da reação esfria porque cede calor à reação. Como se classifica essa reação?',
    options: ['Exotérmica, com ΔH negativo.', 'Endotérmica, com ΔH positivo.', 'Exotérmica, com ΔH positivo.'], correct: 1,
    explanation: 'A água faz parte da vizinhança. Se ela cede calor à reação, o sistema absorve calor e, a pressão constante, ΔH é positivo.' },
  { topic: 'Entalpia', prompt: 'Na mesma escala de referência, os reagentes têm H = 120 kJ e os produtos têm H = 75 kJ. Qual é o ΔH?',
    options: ['−45 kJ.', '+45 kJ.', '+195 kJ.'], correct: 0,
    explanation: 'ΔH é a entalpia dos produtos menos a dos reagentes: 75 − 120 = −45 kJ.' },
  { topic: 'Calorimetria', prompt: 'Uma amostra de 50 g de água aquece de 20 °C a 30 °C. Use c = 4,18 J/(g·°C). Qual é o calor recebido?',
    options: ['+0,209 kJ.', '−2,09 kJ.', '+2,09 kJ.'], correct: 2,
    explanation: 'A água aqueceu 10 °C. Logo, Q = 50 × 4,18 × 10 = 2.090 J = +2,09 kJ.' },
  { topic: 'Lei de Hess', prompt: 'Uma reação tem ΔH = −40 kJ. Você inverte a equação e multiplica todos os coeficientes por 3. Qual é o novo ΔH?',
    options: ['−120 kJ.', '+120 kJ.', '+40 kJ.'], correct: 1,
    explanation: 'A inversão muda o sinal para +40 kJ. O fator 3 se aplica também ao ΔH, que fica +120 kJ.' },
  { topic: 'Lei de Hess', prompt: 'Qual é o ΔH° da reação global?',
    extra: '<p class="quiz-equations chemical"><strong>Global:</strong> N₂(g) + 2 O₂(g) → 2 NO₂(g)<br>A. N₂(g) + O₂(g) → 2 NO(g) <span>ΔH° = +180,6 kJ</span><br>B. 2 NO₂(g) → 2 NO(g) + O₂(g) <span>ΔH° = +114,2 kJ</span></p>',
    options: ['+294,8 kJ.', '−66,4 kJ.', '+66,4 kJ.'], correct: 2,
    explanation: 'Inverta B para ter NO₂ do lado dos produtos. Ao somar com A, cancele 2 NO e some +180,6 kJ com −114,2 kJ.' },
  { topic: 'Prática do amendoim', prompt: 'No experimento, por que o calor recebido pela água costuma ser menor que a energia da combustão completa?',
    options: ['Parte do calor aquece o recipiente e o ar, e a combustão pode ser incompleta.', 'A água sempre perde calor durante a queima.', 'A massa do amendoim aumenta durante a combustão.'], correct: 0,
    explanation: 'A água recebe apenas uma parte do calor. O recipiente e o ar também podem aquecer. A combustão incompleta ainda reduz a energia liberada.' }
]
const quizContent = byId('quiz-content')
const quizFeedback = byId('quiz-feedback')
const quizPrev = byId('quiz-prev')
const quizNext = byId('quiz-next')
const quizReset = byId('quiz-reset')
let questionIndex = 0
let answers = questions.map(() => null)

function showQuiz(focusHeading = false) {
  const question = questions[questionIndex]
  const correctCount = answers.filter((answer, index) => answer === questions[index].correct).length
  const answeredCount = answers.filter((answer) => answer !== null).length
  const finished = !question
  byId('quiz-counter').textContent = finished ? 'RESULTADO' : 'QUESTÃO ' + (questionIndex + 1) + ' DE ' + questions.length
  byId('quiz-progress').innerHTML = questions.map((item, index) =>
    '<span class="' + (index === questionIndex ? 'current ' : '') + (answers[index] !== null ? 'answered' : '')
    + '" title="Questão ' + (index + 1) + (answers[index] === null ? ': pendente' : ': respondida') + '"></span>').join('')
  byId('quiz-score').textContent = correctCount + ' de ' + answeredCount + ' corretas'
  quizFeedback.hidden = true
  byId('quiz-controls').hidden = finished
  quizReset.hidden = !finished
  if (finished) {
    quizContent.innerHTML = '<h3 tabindex="-1" id="quiz-question">Você acertou ' + correctCount
      + ' de ' + questions.length + '.</h3><p>' + (correctCount === questions.length
        ? 'Você completou a revisão de Termoquímica.'
        : 'Volte às questões para rever as explicações ou refaça a sequência.') + '</p>'
      + '<button type="button" id="quiz-review" class="button outline">Rever questões</button>'
    byId('quiz-review').addEventListener('click', () => {
      questionIndex = 0
      showQuiz(true)
    })
  } else {
    quizContent.innerHTML = '<p class="topic">' + question.topic + '</p><h3 tabindex="-1" id="quiz-question">'
      + question.prompt + '</h3>' + (question.extra ?? '')
      + '<div class="quiz-options" role="group" aria-labelledby="quiz-question">' + question.options.map((option, index) =>
        '<button type="button" data-answer="' + index + '" aria-pressed="false"><span class="choice-letter">'
        + 'ABC'[index] + '</span><span>' + option + '</span></button>').join('') + '</div>'
    const buttons = [...quizContent.querySelectorAll('[data-answer]')]
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      answers[questionIndex] = index
      markAnswer(buttons)
    }))
    quizPrev.disabled = questionIndex === 0
    quizNext.textContent = questionIndex === questions.length - 1 ? 'Ver resultado →' : 'Próxima →'
    markAnswer(buttons)
  }
  if (focusHeading) byId('quiz-question').focus({ preventScroll: true })
}
function markAnswer(buttons) {
  const question = questions[questionIndex]
  const selected = answers[questionIndex]
  quizNext.disabled = selected === null
  buttons.forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === selected))
    button.classList.toggle('choice-right', selected !== null && index === question.correct)
    button.classList.toggle('choice-wrong', index === selected && selected !== question.correct)
  })
  if (selected !== null) {
    const correct = selected === question.correct
    feedback(quizFeedback, correct ? 'correct' : 'try-again', (correct ? 'Correto! ' : 'Revise esta resposta. ') + question.explanation)
  }
  const correctCount = answers.filter((answer, index) => answer === questions[index].correct).length
  const answeredCount = answers.filter((answer) => answer !== null).length
  byId('quiz-score').textContent = correctCount + ' de ' + answeredCount + ' corretas'
  byId('quiz-progress').children[questionIndex].classList.toggle('answered', selected !== null)
}
quizPrev.addEventListener('click', () => { questionIndex--; showQuiz(true) })
quizNext.addEventListener('click', () => { questionIndex++; showQuiz(true) })
quizReset.addEventListener('click', () => {
  answers = questions.map(() => null)
  questionIndex = 0
  showQuiz(true)
})
showQuiz()
