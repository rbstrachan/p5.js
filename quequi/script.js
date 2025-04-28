const sentences = [
    {
        sentence: "L'homme (...) parle est mon voisin.",
        answer: "qui",
    },
    {
        sentence: "La femme (...) travaille ici est médecin.",
        answer: "qui",
    },
    {
        sentence: "L'enfant (...) joue est très intelligent.",
        answer: "qui",
    },
    {
        sentence: "Le livre (...) je lis est passionnant.",
        answer: "que",
    },
    {
        sentence: "La chanson (...) j'écoute est magnifique.",
        answer: "que",
    },
    {
        sentence: "Le cadeau (...) j'ai reçu était surprenant.",
        answer: "que",
    },
    {
        sentence: "La personne (...) je respecte le plus est ma grand-mère.",
        answer: "que",
    },
    {
        sentence: "Voici l'ami (...) m'a aidé pendant mes études.",
        answer: "qui",
    },
    {
        sentence: "Le problème (...) nous discutons est complexe.",
        answer: "que",
    },
    {
        sentence: "La maison (...) je pense acheter est près du parc.",
        answer: "que",
    },
    {
        sentence: "L'étudiant (...) parle souvent est très intelligent.",
        answer: "qui",
    },
    {
        sentence: "La solution (...) on pense résoudra le problème.",
        answer: "que",
    },
    {
        sentence: "La décision (...) il a prise était courageuse.",
        answer: "que",
    },
    { sentence: `Le livre (...) je lis est passionnant.`, answer: 'que' },
    { sentence: `La chanson (...) j'écoute est magnifique.`, answer: 'que' },
    { sentence: `Le cadeau (...) j'ai reçu était surprenant.`, answer: 'que' },
    { sentence: `L'ami (...) je rencontre souvent est sympathique.`, answer: 'que' },
    { sentence: `La ville (...) je visite est belle.`, answer: 'que' },
    { sentence: `Le film (...) nous regardons est interessant.`, answer: 'que' },
    { sentence: `Les devoirs (...) je fais sont difficiles.`, answer: 'que' },
    { sentence: `La photo (...) j'ai prise est floue.`, answer: 'que' },
    { sentence: `Le repas (...) je prépare sera délicieux.`, answer: 'que' },
    { sentence: `L'exercice (...) je fais est important.`, answer: 'que' },
    { sentence: `La lettre (...) j'ai écrite était longue.`, answer: 'que' },
    { sentence: `Le problème (...) nous résolvons est complexe.`, answer: 'que' },
    { sentence: `La musique (...) j'aime est variée.`, answer: 'que' },
    { sentence: `Le cours (...) je suis m'intéresse.`, answer: 'que' },
    { sentence: `Les moments (...) je partage sont précieux.`, answer: 'que' },
    { sentence: `L'homme (...) je respecte est intelligent.`, answer: 'que' },
    { sentence: `La voiture (...) tu conduis est rapide.`, answer: 'que' },
    { sentence: `Le projet (...) nous développons est innovant.`, answer: 'que' },
    { sentence: `L'idée (...) j'ai eue était brillante.`, answer: 'que' },
    { sentence: `La personne (...) tu cherches n'est pas là.`, answer: 'que' },
    { sentence: `Le moment (...) nous attendions est arrivé.`, answer: 'que' },
    { sentence: `L'école (...) je fréquente est moderne.`, answer: 'que' },
    { sentence: `Le chemin (...) tu prends est difficile.`, answer: 'que' },
    { sentence: `La décision (...) il a prise était courageuse.`, answer: 'que' },
    { sentence: `L'aventure (...) nous vivons est extraordinaire.`, answer: 'que' },
    { sentence: `Le temps (...) je perds me fait réfléchir.`, answer: 'que' },
    { sentence: `La surprise (...) tu me prépares est excitante.`, answer: 'que' },
    { sentence: `L'histoire (...) je raconte est vraie.`, answer: 'que' },
    { sentence: `Le secret (...) je garde est important.`, answer: 'que' },
    { sentence: `La chance (...) j'ai eue était incroyable.`, answer: 'que' },
    { sentence: `Le livre (...) j'ai lu pendant mes vacances était passionnant.`, answer: 'que' },
    { sentence: `La personne (...) tu m'as présentée hier travaille dans mon domaine.`, answer: 'que' },
    { sentence: `Le problème (...) nous discutons depuis des heures n'a pas de solution simple.`, answer: 'que' },
    { sentence: `L'opportunité (...) je cherche depuis longtemps s'est finalement présentée.`, answer: 'que' },
    { sentence: `Le talent (...) tu développes mérite d'être reconnu.`, answer: 'que' },
    { sentence: `La région (...) nous visitons a des paysages magnifiques.`, answer: 'que' },
    { sentence: `L'équipe (...) je soutiens depuis mon enfance a gagné le championnat.`, answer: 'que' },
    { sentence: `Le rêve (...) je poursuis me motive chaque jour.`, answer: 'que' },
    { sentence: `La passion (...) tu partages est contagieuse.`, answer: 'que' },
    { sentence: `Le moment (...) nous partageons ensemble est précieux.`, answer: 'que' },
    { sentence: `L'histoire (...) tu me racontes me rappelle un souvenir d'enfance.`, answer: 'que' },
    { sentence: `Le défi (...) nous relevons ensemble nous rend plus forts.`, answer: 'que' },
    { sentence: `La transformation (...) je vis actuellement est profonde.`, answer: 'que' },
    { sentence: `L'émotion (...) je ressens est difficile à expliquer.`, answer: 'que' },
    { sentence: `Le chemin (...) tu as tracé est remarquable.`, answer: 'que' },
    { sentence: `La surprise (...) tu me prépares me fait sourire.`, answer: 'que' },
    { sentence: `Le mystère (...) j'essaie de résoudre est complexe.`, answer: 'que' },
    { sentence: `L'aventure (...) nous vivons dépasse nos attentes.`, answer: 'que' },
    { sentence: `La leçon (...) j'apprends aujourd'hui sera importante demain.`, answer: 'que' },
    { sentence: `Le moment (...) nous traversons est unique.`, answer: 'que' },
    { sentence: `Le chien (...) aboie fort est dans le jardin.`, answer: 'qui' },
    { sentence: `La fille (...) chante a une belle voix.`, answer: 'qui' },
    { sentence: `Le professeur (...) explique est très patient.`, answer: 'qui' },
    { sentence: `Les étudiants (...) étudient sont motivés.`, answer: 'qui' },
    { sentence: `Le garçon (...) court vite gagne toujours.`, answer: 'qui' },
    { sentence: `La personne (...) sourit est heureuse.`, answer: 'qui' },
    { sentence: `Le chat (...) dort sur le canapé est noir.`, answer: 'qui' },
    { sentence: `Les oiseaux (...) volent sont libres.`, answer: 'qui' },
    { sentence: `L'équipe (...) gagne sera récompensée.`, answer: 'qui' },
    { sentence: `Le musicien (...) joue du piano est talentueux.`, answer: 'qui' },
    { sentence: `La voiture (...) roule vite est dangereuse.`, answer: 'qui' },
    { sentence: `Les personnes (...) travaillent dur réussissent.`, answer: 'qui' },
    { sentence: `Le professeur (...) explique le concept est très patient.`, answer: 'qui' },
    { sentence: `Les étudiants (...) étudient sont motivés.`, answer: 'qui' },
    { sentence: `Le garçon (...) court vite gagne toujours.`, answer: 'qui' },
    { sentence: `La personne (...) sourit est heureuse.`, answer: 'qui' },
    { sentence: `Le chat (...) dort sur le canapé est noir.`, answer: 'qui' },
    { sentence: `Le scientifique (...) recherche une solution est brillant.`, answer: 'qui' },
    { sentence: `L'artiste (...) expose ses œuvres est talentueux.`, answer: 'qui' },
    { sentence: `L'entrepreneur (...) lance sa startup est courageux.`, answer: 'qui' },
    { sentence: `L'étudiant (...) pose des questions apprend vite.`, answer: 'qui' },
    { sentence: `Le chercheur (...) publie ses résultats est respecté.`, answer: 'qui' },
    { sentence: `Les oiseaux (...) volent sont libres.`, answer: 'qui' },
    { sentence: `La plante (...) pousse dans mon jardin est magnifique.`, answer: 'qui' },
    { sentence: `Le soleil (...) brille illumine la journée.`, answer: 'qui' },
    { sentence: `La rivière (...) coule est paisible.`, answer: 'qui' },
    { sentence: `Les arbres (...) résistent à l'hiver sont remarquables.`, answer: 'qui' },
    { sentence: `La personne (...) m'écoute vraiment est rare.`, answer: 'qui' },
    { sentence: `L'ami (...) me comprend est précieux.`, answer: 'qui' },
    { sentence: `Le collègue (...) m'aide toujours est formidable.`, answer: 'qui' },
    { sentence: `La famille (...) me soutient est ma force.`, answer: 'qui' },
    { sentence: `L'individu (...) reste positif inspire les autres.`, answer: 'qui' },
    { sentence: `Le musicien (...) joue du piano est talentueux.`, answer: 'qui' },
    { sentence: `La danseuse (...) se déplace avec grâce est impressionnante.`, answer: 'qui' },
    { sentence: `Le coureur (...) termine le marathon est un héros.`, answer: 'qui' },
    { sentence: `L'acteur (...) joue ce rôle est extraordinaire.`, answer: 'qui' },
    { sentence: `Le chef (...) cuisine ce repas est un artiste.`, answer: 'qui' },
    { sentence: `L'entreprise (...) innove constamment reste compétitive.`, answer: 'qui' },
    { sentence: `Le système (...) fonctionne parfaitement mérite d'être étudié.`, answer: 'qui' },
    { sentence: `La méthode (...) produit des résultats devient populaire.`, answer: 'qui' },
    { sentence: `Le projet (...) progresse rapidement attire des investisseurs.`, answer: 'qui' },
    { sentence: `L'équipe (...) collabore efficacement réussit toujours.`, answer: 'qui' },
    { sentence: `La pensée (...) libère l'esprit est puissante.`, answer: 'qui' },
    { sentence: `Le concept (...) bouleverse nos certitudes est révolutionnaire.`, answer: 'qui' },
    { sentence: `L'idée (...) germe dans notre esprit peut changer le monde.`, answer: 'qui' },
    { sentence: `La vision (...) nous guide détermine notre destin.`, answer: 'qui' },
    { sentence: `Le principe (...) nous anime nous définit.`, answer: 'qui' },
    { sentence: `Le rêve (...) m'habite me fait avancer.`, answer: 'qui' },
    { sentence: `L'imagination (...) me guide est ma plus grande force.`, answer: 'qui' },
    { sentence: `Le sourire (...) illumine un visage transforme une journée.`, answer: 'qui' },
    { sentence: `Le moment (...) nous traversons est unique.`, answer: 'qui' },
    { sentence: `L'émotion (...) nous traverse nous rend vivants.`, answer: 'qui' },
    { sentence: `L'individu (...) apprend de ses erreurs grandit.`, answer: 'qui' },
    { sentence: `La communauté (...) se serre les coudes surmonte les défis.`, answer: 'qui' },
    { sentence: `Le leader (...) inspire ses équipes crée le changement.`, answer: 'qui' },
    { sentence: `L'innovation (...) répond aux besoins réels réussit.`, answer: 'qui' },
    { sentence: `La pensée (...) ose être différente progresse.`, answer: 'qui' }
];

let order = [];
let current = 0;
function shuffle(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function init() {
    order = shuffle(sentences.length);
    current = 0;
    render();
}

function render() {
    const idx = order[current];
    const sentence = sentences[idx];

    const sentEl = document.getElementById('sentence');
    const progEl = document.getElementById('progress');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const optsEls = document.querySelectorAll('.option');
    const radios = document.querySelectorAll('input[name="pronoun"]');

    sentEl.textContent = sentence.sentence

    if (progEl) {
        progEl.textContent = `Phrase ${current + 1} / ${sentences.length}`;
    }

    feedbackEl.textContent = '';
    feedbackEl.className = '';
    nextBtn.disabled = true;
    checkBtn.disabled = false;

    radios.forEach(r => r.checked = false);
    optsEls.forEach(el => {
        el.classList.remove('selected', 'correct', 'incorrect');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const optsEls = document.querySelectorAll('.option');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');

    optsEls.forEach(label => {
        label.addEventListener('click', () => {
            optsEls.forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            label.querySelector('input').checked = true;
        });
    });

    checkBtn.addEventListener('click', () => {
        const idx = order[current];
        const sentence = sentences[idx];
        const choice = document.querySelector('input[name="pronoun"]:checked');
        const feedbackEl = document.getElementById('feedback');
        const optsEls = document.querySelectorAll('.option');
        const nextBtn = document.getElementById('next-btn');
        if (!choice) return;
        checkBtn.disabled = true;

        optsEls.forEach(label => {
            const val = label.querySelector('input').value;
            if (val === sentence.answer) {
                label.classList.add('correct');
            } else if (label.querySelector('input').checked) {
                label.classList.add('incorrect');
            }
        });

        if (choice.value === sentence.answer) {
            feedbackEl.textContent = "✅ Correct !";
            feedbackEl.classList.add('correct');

            setTimeout(() => {
                current++;
                if (current >= sentences.length) {
                    endGame();
                } else {
                    render();
                }
            }, 1000);
        } else {
            feedbackEl.textContent = `❌ Faux. Explication : ${sentence.explanation || 'Pas d\'explication disponible.'}`;
            feedbackEl.classList.add('incorrect');
            nextBtn.disabled = false;
        }
    });

    nextBtn.addEventListener('click', () => {
        current++;
        if (current >= sentences.length) {
            endGame();
        } else {
            render();
        }
    });

    init();
});

function endGame() {
    const sentEl = document.getElementById('sentence');
    const feedbackEl = document.getElementById('feedback');
    const progEl = document.getElementById('progress');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const optsEls = document.querySelectorAll('.option');

    sentEl.textContent = "🎉 Bravo ! Vous avez terminé.";
    feedbackEl.textContent = "";

    if (progEl) progEl.textContent = "";
    checkBtn.disabled = true;
    nextBtn.disabled = true;
    optsEls.forEach(el => el.style.pointerEvents = 'none');
}