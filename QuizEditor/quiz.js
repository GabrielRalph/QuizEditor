import { getSummary } from "../Firebase/quizzes.js";

import { SvgPlus } from "../SvgPlus/4.js";
import { Icon, isIconName } from "../Utilities/icons.js";
import { PromiseChain } from "../Utilities/shared.js";
import { MarkdownElement } from "./markdown.js";
/**
 * @typedef {import("../Firebase/quizzes.js").Answer} Answer
 * @typedef {import("../Firebase/quizzes.js").Question} Question
 * @typedef {import("../Firebase/quizzes.js").Quiz} Quiz
 * @typedef {import("../Firebase/quizzes.js").Action} Action
 * @typedef {import("../Firebase/quizzes.js").QuizResults} QuizResults
 * @typedef {import("../Firebase/quizzes.js").AnswerResponse} AnswerResponse
 */


/**
 * @param {Array} choosen
 * @param {Array} correct
 * @param {number} total
 * 
 * @return {number}
 * 
 */
function computeScore(choosen, correct, total) {
    let score = 0;
    if (correct.length > 1) {
        let t_c = correct.length;
        let t_ic = total - t_c;

        
        correct = new Set(correct);
        let correctChoice = choosen.filter(i => correct.has(i));
        let c_c = correctChoice.length;
        let c_ic = choosen.length - c_c;


        score = c_c / t_c - (t_ic == 0 ? 0 : (c_ic / t_ic));
        if (score < 0) score = 0;
    } else if (correct.length = 0 || correct[0] == choosen[0]) {
        score = 1;
    } 
    return score
}


/** 
 * @param {Quiz} quiz 
 * @param {Array<number>[]} choosen
 * @param {Action[]} actions
 */
function createResults(quiz, choosen, actions) {
    let {questions} = quiz;
    let correct = questions.map(q => q.answers.map((...a) => a).filter(([a,i]) => a.correct).map(a=>a[1]));
    let answers = choosen.map((choosen, question) => {
        return {
            choosen, question,
            correct: correct[question],
            score: computeScore(choosen, correct[question], quiz.questions[question].answers.length)
        }
    })

    let cor = correct.map(a => a.length == 0 ? "-" : "[" + a + "]");
    let cho = choosen.map(a => a.length == 0 ? "-" : "[" + a + "]");
    let sel = actions.map(a => a.length == 0 ? "-" : "[" + a.answer + "]");

    let results_csv = cor.map((s, i) => `Q${i+1}, ${s}, ${cho[i]}`).join("\n");
    let actions_csv = actions.map((s,i) => `Q${s.question + 1}, ${s.type}, ${Math.round(s.duration / 10)/100}s, ${sel[i]}`).join("\n");
    let csv = `**Quiz Actions**\nquestion,action,response time (s), selected answers\n${actions_csv}\n\n**Quiz Results\nquestion, correct, choosen\n${results_csv}`;
    let total = answers.map(a=>a.score).reduce((a,b)=>a+b)
    return {actions, answers, csv, total};
}


const COLORS = [
    "light-red",
    "light-orange",
    "light-gold",
    "light-green",
    "light-teal",
    "light-blue",
    "light-indigo",
    "light-purple",
    "dark-red",
    "dark-orange",
    "dark-gold",
    "dark-green",
    "dark-teal",
    "dark-blue",
    "dark-indigo",
    "dark-purple"
]
let III = 0;

class AccessButton extends SvgPlus {
    constructor(group) {
        super("access-button");
        this.accessGroup = group;
        this.onclick = () => {
            const event = new Event("access-click");
            event.clickMode = "click";
            this.dispatchEvent(event);
        }
    }
}

class QuizIcon extends AccessButton {
    constructor(icon, group) {
        super("quiz-" + group);
        
        if (icon.color) this.setAttribute("color", icon.color)
        this.toggleAttribute("quiz-icon", true);
        let {title, subtitle, image} = icon;
        if (image) {
            if (isIconName(image)) {
                this.createChild(Icon, {}, image)
            } else {
                this.createChild("img", {src: image});
            }
        }
        this.createChild(MarkdownElement, {class: "title"}, "div", title);
        if (subtitle) {
            this.createChild(MarkdownElement, {class: "subtitle"}, "div", subtitle, true);
        }
    }
}

const answers_templates = [
    [],["1fr", "1fr"],
    [ "repeat(2, 1fr)", "calc(100%)" ],
    [ "repeat(3, 1fr)", "calc(100%)" ],
    [ "repeat(2, 1fr)", "repeat(2, calc((100% - 0.5em) / 2))" ],
    [ "repeat(5, 1fr)", "1fr" ],
    [ "repeat(3, 1fr)", "repeat(2, calc((100% - 0.5em) / 2))" ],
    [ "repeat(4, 1fr)", "repeat(2, calc((100% - 0.5em) / 2))" ],
    [ "repeat(4, 1fr)", "repeat(2, calc((100% - 0.5em) / 2))" ],
    [ "repeat(3, 1fr)", "repeat(3, calc((100% - 2 * 0.5em) / 3))" ],
    [ "repeat(5, 1fr)", "repeat(2, calc((100% - 0.5em) / 2))" ],

];

const special_layout = {
    // 5: [[[1,4],1], [[4,7],1], [[1,3],2], [[3,5],2], [[5,7],2]],
    // 7: [[[1,5],1], [[5,9],1], [[9,13],1], [[1,4],2], [[4,7],2], [[7,10],2], [[10,13],2]],
    // 8: [[[1,4],1], [[4,7],1], [[1,3],2], [[3,5],2], [[5,7],2], [[1,3],3], [[3,5],3], [[5,7],3]],

}
class Answers extends SvgPlus {
    selectedAnswers = new Set();

    /** @param {Answer[]} answers*/
    constructor(answers){
        super("div");
        this.class = "answers";

        let n = answers.length;
        this.styles = {
            "grid-template-rows": answers_templates[n][1],
            "grid-template-columns": answers_templates[n][0],
        }
        let slayout = special_layout[n];
        let i = 0;
        this.isMulti = answers.filter(a => a.correct).length > 1;
        for (let answer of answers) {
            let j = i;
            let el = this.createChild(QuizIcon, {events: {
                "access-click": () => {
                    this.selectAnswer(j);
                    const event = new Event("answer", {bubbles: true});
                    event.answer = answer;
                    event.answerIndex = j;
                    this.dispatchEvent(event);
                }
            }}, answer);
            el.toggleAttribute("correct", answer.correct)
            if (slayout) {
                let [cols, rows] = slayout[i];
                
                for (let [k,l] of [["column", cols], ["row", rows]]) {
                    let s;
                    if (Array.isArray(l)) s = {[`grid-${k}-start`]:l[0], [`grid-${k}-end`]:l[1]};
                    else s = {[`grid-${k}`]:l};
                    el.styles = s;
                    
                }
            }
            i++;
        }
    }

    /**  Returns selected answers
     * @returns {number[]} 
     * */
    get selected(){
        return [...this.selectedAnswers];
    }

    /** 
     * @param {number[]} selected answers to select
     * */
    set selected(selected){
        this.selectedAnswers = new Set();
        for (let i of selected) this.selectAnswer(i);
    }

    /** 
     * @param {number} j answer to select 
     * @param {boolean} isMulti whether to allow multiple selections
     * */
    selectAnswer(j, isMulti = this.isMulti) {

        if (this.selectedAnswers.has(j)) {
            this.selectedAnswers.delete(j);
        } else {
            if (!isMulti && this.selectedAnswers.size > 0) {
                this.selectedAnswers = new Set();
            }
            this.selectedAnswers.add(j);
        }


        [...this.children].map((c, i) => c.toggleAttribute("selected", this.selectedAnswers.has(i)))
    }
}

class QuestionInfo extends SvgPlus {
    /**
     * @param {Question} question
     * @param {number[]}
     */
    constructor(question, [i, max]) {
        super("div");
        this.class = "question-info";

        this.createChild("div", {class: "title", content: "Question " + (i+1)});

        let main = this.createChild("div", {class: "main"});

        if (question.image !== null) {
            main.createChild("div", {class: "img-container", style: {
                "background-image": `url(${question.image})`
            }})
        }

        main.createChild(MarkdownElement, {class: "content"}, "div", question.question, true)

        this.createChild("div", {class: "progress", style: {"--progress": (i+1)/max}})
    }
}

export class QuizView extends SvgPlus {
    transitionTime = 0.5;
    transitionBuffer = new PromiseChain();
    constructor() {
        super("quiz-view");
        this.close = this.createChild(QuizIcon, {
            colorf: "red",
            events: {
                "access-click": () => {
                    if (this.onInteraction instanceof Function) this.onInteraction("close");
            }
        }}, {title: "Close", image: "close"}, 0);

        this.back = this.createChild(QuizIcon, {
            colorf: "light-blue",
            events: {
                "access-click": () => {
                    if (this.onInteraction instanceof Function) this.onInteraction("back");
            }
        }}, {title: "Back", image: "back"}, 0)

        this.info = this.createChild("div", {class: "quiz-info"});

        this.next = this.createChild(QuizIcon, {
            colorf: "light-blue",
            events: {
                "access-click": () => {
                    if (this.onInteraction instanceof Function) this.onInteraction("next");
            }
        }}, {title: "Next", image: "next"}, 0)


        this.main = this.createChild("div", {class: "main-quiz", events: {
            "answer": (e) => {
                if (this.onInteraction instanceof Function) this.onInteraction("answer", e.answerIndex);
            }
        }})
    }


    /** @param {boolean} */
    set disabled(bool) {
        this.styles = {
            filter: bool === true ? "blur(5px)" : null,
            "pointer-events": bool ? "none" : null
        }
    }

    setQuestionInfo(...args) {
        this.info.innerHTML = "";
        this.questionIndex = args[1][0];
        this.info.createChild(QuestionInfo, {}, ...args)
    }

    async waitForInteraction(){
        let t0 = performance.now();
        let [type, answer] = await new Promise((r) => {
            this.onInteraction = (...args) => r(args)
        })
        let duration = performance.now() - t0;
        return {type, duration, answer}
    }

    showQuiz(quiz) {
        let {questions} = quiz;
        let i = 0;
        this.answers = questions[i];
        this.setQuestionInfo(questions[i], [i, questions.length]);

        this.onInteraction = (type, answer) => {
            if (type == "next") {
                if (i < questions.length-1) i++;
                this.transitionAnswers(questions[i], true)
            } else if (type == "back") {
                if (i > 0) i--;
                this.transitionAnswers(questions[i], false)
            }
        }
    }

    /** @param {Quiz} quiz */
    async loadAndStartQuiz(quiz){
        let {questions} = quiz;
        let actions = [];
        let choosen = new Array(questions.length).fill(0).map(a=>[]);
        // load images and display initial message
        this.answers = [{title: quiz.name, subtitle: "Click here to begin"}]

        // wait for click
        let r;
        do { r = await this.waitForInteraction();} while (r.type == "back")
        

        let i = 0;
        let dir = true;
        while (i < questions.length) {
            if (dir !== null) {
                console.log(dir, questions, i);
    
                this.setQuestionInfo(questions[i], [i, questions.length])
    
                // display question
                await this.transitionAnswers(questions[i].answers, dir, choosen[i]);
            }

            let response = await this.waitForInteraction();
            response.question = i;
            switch (response.type) {
                case "next":
                    i++;
                    dir = true;
                    break;
                case "answer": 
                    dir = null;
                    choosen[i] = this.answerBoard.selected;
                    break;
                case "back":
                    if (i > 0) {
                        i--;
                        dir = false;
                    } else {
                        dir = null;
                    }
                    break;
            }
            response.answer = this.answerBoard.selected;
            actions.push(response);
        }

        let results = createResults(quiz, choosen, actions);
        console.log(results);
        
        let summary = await getSummary(results.csv);
        results.summary = summary.data.result;
    }


    /** @param {Answer[]} answers*/
    set answers(answers){
        this.main.innerHTML = "";
        this.answerBoard = this.main.createChild(Answers, {}, answers);
    }

    async transitionAnswers(answers, direction = false, correct){
        await this.transitionBuffer.addPromise(async () => {
            let time = this.transitionTime;
            let newAnswers = new Answers(answers);
            if (correct instanceof Array) {
                for (let item of correct) newAnswers.selectAnswer(item);
            }
            let oldAnswers = this.answerBoard;
    
            if (oldAnswers) {
                this.answerBoard.styles = {
                    transition: `transform ${time}s var(--wave)`
                }
            }
            newAnswers.styles = {
                transition: `transform ${time}s var(--wave)`,
                transform: `translateX(calc(${direction?1:-1}*(1em + 100%))`
            }
    
            this.main.appendChild(newAnswers)
    
            await new Promise(r => window.requestAnimationFrame(r));
    
            if (oldAnswers) oldAnswers.styles = {transform: `translateX(calc(${direction?-1:1} * (1em + 100%))`}
            newAnswers.styles = {transform: "translateX(0%"}
    
            this.answerBoard = newAnswers;
    
            await new Promise(r => setTimeout(r, time * 1000));
            if (oldAnswers) oldAnswers.remove();
        });
    }
}