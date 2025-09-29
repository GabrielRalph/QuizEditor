import { SvgPlus } from "../SvgPlus/4.js";
import { parseText, PopupPromt, WBInputs, WBlock } from "../Utilities/shared.js";
import { QuizView } from "./quiz.js";
import { Icon } from "../Utilities/icons.js";
import { SearchWidget } from "./symbol-search.js";

import { getEmptyAnswer, getEmptyQuestion, saveQuiz, initialise, addQuizUpdateListener, getAllQuizes, getQuiz, getEmptyQuiz, deleteQuiz} from "../Firebase/quizzes.js";

/**
 * @typedef {import("../Firebase/quizzes.js").Answer} Answer
 * @typedef {import("../Firebase/quizzes.js").Question} Question
 * @typedef {import("../Firebase/quizzes.js").Quiz} Quiz
 * @typedef {import("../Firebase/quizzes.js").Action} Action
 * @typedef {import("../Firebase/quizzes.js").QuizResults} QuizResults
 * @typedef {import("../Firebase/quizzes.js").AnswerResponse} AnswerResponse
 * @typedef {import("../SvgPlus/4.js").SvgPlusClass} SvgPlusClass
 * @typedef {import("../SvgPlus/4.js").Props} Props
 * @typedef {import("../SvgPlus/4.js").SvgPlusClass} SvgPlusClass
 */


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
    "dark-purple",
    "white"
]
const MAX_QUESTION_LENGTH = 20;
const LAYOUTS = {
    answer: [
        {
            name: "Title",
            type: "text",
            defaultValue: "A",
            parser: parseText
        },
        {
            name: "Subtitle",
            rows: 3,
            type: "multiline",
            defaultValue: "",
            parser: parseText
        },
        {
            name: "Correct",
            type: "toggle",
            defaultValue: false,
        },
        {
            name: "Image",
            type: "imageSelect",
            defaultValue: null,
        },
        {
            name: "Color",
            type: "selection-radio",
            defaultValue: "white",
            options: COLORS,
            makeItemElement: (value) => {
                let el = new SvgPlus("div");
                el.props = {class: "color-icon", color: value}
                return el;
            }
        }
    ],
    question: [
        {
            name: "Question",
            type: "multiline",
            defaultValue: "",
            rows: 3,
            parser: parseText
        },
        {
            name: "Image",
            type: "imageSelect",
            defaultValue: null,
        },
        {
            name: "Answers",
            type: "orderedList",
            defaultValue: [],
            maxItems: 10,
            minItems: 2,
            generator: (value) => getEmptyAnswer(value.length),
            serialiser: (o) => 
                (o.title.length > MAX_QUESTION_LENGTH + 3 ? o.title.slice(0, MAX_QUESTION_LENGTH) + "..." : o.title) + (o.correct ? "<div class = 'correct-icon'><div>" : "")
        },
    ],
    quiz: [
        {
            name: "Quiz Name",
            type: "text",
            key: "name",
            defaultValue: "",
            parser: parseText
        },
        {
            name: "Public",
            type: "toggle",
            defaultValue: false,
        },
        {
            name: "Questions",
            type: "orderedList",
            defaultValue: [],
            maxItems: 50,
            minItems: 1,
            generator: (value) => getEmptyQuestion(value.length),
            serialiser: (o) => 
                o.question.length > MAX_QUESTION_LENGTH + 3 ? o.question.slice(0, MAX_QUESTION_LENGTH) + "..." : o.question,
        },
    ]
}

/**
 * @typedef {[[SvgPlusClass, Props, ...any], ChildStructure, string]} ChildStructure
 */
/**
 * @param {ChildStructure}
 */
function createChildren(struc, root, refs = {}) {
    if (Array.isArray(struc)) {
        for (let [args, substruc, key] of struc) {
            let el = root.createChild(...args);
            createChildren(substruc, el, refs);
            if (typeof key === "string" || typeof key === "number") refs[key] = el;
        }
    }
    return refs;
}


class QuizesList extends WBlock {
    selected = null;
    constructor(){
        super();
        createChildren([
            [["div", {class: "row"}], [
                [["div", {content: "Quizzes"}]],
                [[Icon, {events: {click: () => this.dispatchEvent(new Event("quiz-add"))}}, "add"]]
            ]],
            [["div", {class: "row search"}], [
                [["input", {events: {
                    input: (e) => {
                        this.filterQuizes(e.target.value)
                    }
                }}]],
            ]]
        ], this.head)
        

        addQuizUpdateListener(() => {
            this.quizes = getAllQuizes();
            if (this.selected) {
                this.selectQuiz(this.selected);
            }
        })
    }   


    filterQuizes(str) {
        str = str.trim().toLowerCase();
        if (str.length == 0) {
            [...this.main.children].forEach(c => c.toggleAttribute("hide", false))
        } else {
            [...this.main.children].forEach(c => {
                let {name, ownerName} = c.value;
                name = name.trim().toLowerCase();
                ownerName = ownerName.trim().toLowerCase();

                c.toggleAttribute("hide", ![
                    name.indexOf(str) !== -1,
                    str.indexOf(name) !== -1,
                    ownerName.indexOf(str) !== -1,
                    str.indexOf(ownerName) !== -1,
                ].reduce((a,b)=>a||b));
            })
        }
    }

    selectQuizByQID(qid) {
        let i = null;
        [...this.main.children].forEach((e, i0) => {
            if (e.value.qid === qid)  i = i0;
        });
        this.selectQuiz(i, null);
        
    }

    selectQuiz(i, mode = "select") {
        this.selected = i;
        
        [...this.main.children].forEach((e, i0) => e.toggleAttribute("selected", i===i0));
        if (mode != null && i !== null && i >= 0 && i < this.main.children.length) {
            const event = new Event("quiz-"+mode);
            event.qid = this.main.children[i].value.qid;
            this.dispatchEvent(event)
        }
    }

   


    /** @param {Object<string, Quiz>} quizes*/
    set quizes(quizes){
       
        this.main.innerHTML = "";
        quizes = Object.values(quizes)
        let r = createChildren(quizes.map((q, i) => [
            ["div", {class: "row quiz-item", events: {
                click: () => this.selectQuiz(i)
            }}], [
                [["div"], [
                    [["div", {class: "bold",content: q.name}]],
                    [["div", {class: "i",content: q.ownerName}]],
                ]],
                [["div", {class: "row-g"}], [
                    [["div", {class: "indicator public", on: q.public}]],
                    [[Icon, {events: {
                        /** @param {Event} e */
                        click: (e) => {
                            e.stopImmediatePropagation();
                            this.selectQuiz(i, "delete")
                        }
                    }}, "trash"]],
                    [[Icon, {events: {
                        /** @param {Event} e */
                        click: (e) => {
                            e.stopImmediatePropagation();
                            this.selectQuiz(i, "edit")
                        }
                    }}, "edit"]],
                ]]
            ], i
        ]), this.main);
        
        quizes.forEach((q, i) => {
            r[i].value = q;
        });
    }

}

export class QuizEditorPanel extends SvgPlus {
    /** @type {Quiz} */
    quiz = null;

    constructor() {
        super("quiz-editor");
        this.quizColumn = this.createChild("div", {class: "column quiz"});
        this.questionColumn = this.createChild("div", {class: "column question"})
        this.answerColumn = this.createChild("div", {class: "column answer"})
        this.createInputs();

    }

    /** @return {?HTMLElement} */
    get selectedQuestion(){
        return this.quizInput?.inputs?.questions?.input?.selected;
    }
     /** @param {number} number*/
     set questionSelectedIndex(number) {
        let question = this.quizInput?.inputs?.questions?.input;
        question.selected = question.children[number];
    }

    /** @return {?HTMLElement} */
    get selectedAnswer(){
        return this.questionInput?.inputs?.answers?.input?.selected;
    }
    /** @param {number} number*/
    set answerSelectedIndex(number) {
        let answers = this.questionInput?.inputs?.answers?.input;
        answers.selected = answers.children[number];
    }

    /**
     * @return {number[]}
     */
    get path(){
        let path = [];
        if (this.selectedQuestion){
            path.push(this.selectedQuestion.index);
            if (this.selectedAnswer) path.push(this.selectedAnswer.index);
        } 
        return path;
    }

    /**
     * @param {number[]}
     */
    set path(path){
        this.updatePath(path);
    }

    dispatchChange(e) {
        if (!e.bubbles) {
            const event = new Event("change");
            this.dispatchEvent(event);
        }
    }

    dispatchPathChange(){
        const event = new Event("pathchange");
        event.path = this.path;
        this.dispatchEvent(event);
    }


    updatePath(path = this.path){
        this.setAttribute("path-depth", path.length)
        let keys = [["quiz", "question"], ["question", "answer"]];

        // Deselect all ordered list inputs
        keys.forEach(([k0, k1]) => this[k0+"Input"].inputs[k1+"s"].input.selected = null);

        let quiz = this.quiz;
        this["quizInput"].value = quiz;
        path.forEach((i, j) => {
                try {
                    let [key0, key] = keys[j]
                    this[key0+"Input"].inputs[key+"s"].input.selected = i;
                    quiz = quiz[key+'s'][i];
                    this[key+"Input"].value = quiz;
                } catch (e) {
                    console.log("error setting path", e);
                    
                }
            })
    }

    setValueAtPath(path, value) {
        try {
            if (path == null || path.length == 0) {
                this.quiz = value;
            } else if (path.length == 1) {
                this.quiz.questions[path[0]] = value;
            } else if (path.length == 2) {
                this.quiz.questions[path[0]].answers[path[1]] = value;
            }
        } catch (e) {console.log("error setting value at path", e);}
    }

    createInputs(){
        ["quiz", "question", "answer"].forEach((key, i) => {
            let column = this[key+"Column"]
            column.innerHTML = "";
            // Create inputs for the category
            this[key+"Input"]  = column.createChild(WBInputs, {events: {
                select: (e) => {
                    if (e.input == "answers" || e.input == "questions") {
                        this.updatePath();
                        this.dispatchPathChange();                            
                    }                     
                },
                change: (e) => {
                    let newValue = this[key+"Input"].value;
                    let path = this.path.slice(0, i)
                    this.setValueAtPath(path, newValue);
                    this.updatePath();
                    this.dispatchChange(e);
                }
            }}, LAYOUTS[key]);
        })
    }


    /**
     * @param {Quiz} quiz
     */
    set value(quiz){
        this.quiz = quiz;
        this.quizInput.value = quiz;
        this.updatePath();
    }

    /** @return {Quiz} */
    get value(){
        return this.quiz;
    }
   
    clear() {
        for (let key in LAYOUTS) {
            this[key+"Column"].innerHTML = "";
            this[key+"Input"] = null;
        }
    }
}

export class QuizEditorApp extends SvgPlus {
    /** @type {QuizEditorPanel} */
    editor = null; 

    /** @type {SearchWidget} */
    symbols = null;

    /** @type {QuizView} */
    quizView = null;

    /** @type {?number} */
    lastQuestion = null;

    /** @type {QuizesList} */
    quizList = null;

    /** @type {PopupPromt} */
    popup = null;


    constructor(el = "quiz-editor-app"){
        super(el);

        const resize = new ResizeObserver(() => {
            this.styles = {
                "--vh": (this.clientHeight/100)+ "px",
                "--vw": (this.clientWidth/100) + "px",
            }
        })
        resize.observe(this);
        // this.setAttribute("edit", true)
        this.quizList = this.createChild("div", {class: "quizes-list"})
            .createChild(QuizesList, { events: {
                "quiz-edit": (e) => {
                    this.selectQuiz(e.qid)
                    this.editMode(true)
                },
                "quiz-select": (e) => {
                    this.selectQuiz(e.qid)
                },
                "quiz-add": (e) => {
                    this.editMode(true)
                    this.selectQuiz(null);
                },
                "quiz-delete": async (e) => {
                    let q = getQuiz(e.qid);
                    let res = await this.popup.promt(`Are you sure you would like to </br> delete ${q.name}`);
                    if (res) {
                        await deleteQuiz(e.qid);
                        this.selectQuiz(getAllQuizes()[0].qid);
                    }
                },
            }})

        let col = this.createChild("div", {class: "col main-editor"});
        let buttons = col.createChild("div", {class: "buttons row"})
        this.editor = col.createChild(QuizEditorPanel, {
            events: {
                pathchange: (e) => {
                    this.displayQuestion(this.editor.path)
                },
                change: () => this.onQuizUpdate()
            }
        });
        buttons.createChild("button", {
            content: "Save",
            events: {
                click: async () => {
                    this.disabled = true;
                    let {value} = this.editor;
                    let qid = this.selectedQID;
                    if (typeof qid !== "string") {
                        qid = null;
                    }
                    try {
                        qid = await saveQuiz(qid, value);
                    } catch (e) {
                        const event = new Event("error");
                        event.error = e;
                        this.dispatchEvent(event);
                    }
                    this.disabled = false;
                    
                    let path = this.editor.path;
                    if (path.length == 0) path = [0]
                    this.selectQuiz(qid, path, true);

                    this.editMode(false)
                }
            }
        }).createChild(Icon, {}, "save");

        buttons.createChild("button", {
            content: "Cancel",
            events: {
                click: (e) => {
                    if (this.selectedQID == null) {
                        this.selectQuiz(getAllQuizes()[0].qid);
                    }  else {
                        let path = this.editor.path;
                        if (path.length == 0) path = [0];

                        this.selectQuiz(this.selectedQID, path, true)
                    }
                    this.editMode(false)
                }
            }
        }).createChild(Icon, {}, "close")

        this.symbols = this.createChild(SearchWidget);

        let quizWindow = this.createChild("div", {class: "quiz-window"});

        this.quizView = quizWindow.createChild(QuizView);
        this.quizView.onInteraction = this.onQuizViewInteraction.bind(this);

        this.popup = this.createChild(PopupPromt);

        this.addEventListener("image-search-query", (e) => {
            let getURL = async () => {
                let res = await this.symbols.getSymbol();
                return res?.url
            }
            e.queryPromise = getURL();
        });
    }

    async editMode(bool) {
        this.disabled = 1;
        await this.waveTransition((t) => {
            this.styles = {"--edit-p": t}
        }, 700, bool)
        this.disabled = false;
    }

    async onconnect(){
        await this.initialise();
        document.querySelector("squidly-loader").hide(0.3);

    }

    async initialise(){
        await initialise((user) => {
            if (user) {
                this.selectQuiz(getAllQuizes()[0].qid);
            } else {
                this.selectQuiz(null);
            }
        });
    }

    set disabled(bool) {
        this.styles = {
            opacity: bool === true ? 0.8 : 1,
            "pointer-events": bool ? "none" : null
        }
    }
   
    selectQuiz(qid, path = [0], force = false) {
        if (!force && qid === this.selectedQID) return;
        let quiz = qid == null ?  getEmptyQuiz(1) : getQuiz(qid);
        this.selectedQID = qid;
        this.lastQuestion = null;
        this.editor.value = quiz;
        this.editor.path = path;
        this.quizList.selectQuizByQID(qid)
        this.displayQuestion(path);
    }

    /**
     * Called when the user interacts with the quiz view
     * @param {("answer"|"back"|"next")})}
     */
    onQuizViewInteraction(type) {
        let path;
        let qi = this.quizView.questionIndex;
        switch (type) {
            case "answer": 
                let answers = this.quizView.answerBoard.selected;
                path = answers.length > 0 ? [qi, answers.pop()] : [qi]
                this.editor.path = path;
                break;
            
            case "back": 
                if (qi > 0) {
                    path = [qi - 1];
                    this.editor.path = path;
                    this.displayQuestion(path);
                }
                break;

            case "next": 
                let n = this.value.questions.length;
                if (qi < n-1) {
                    path = [qi + 1];
                    this.editor.path = path;
                    this.displayQuestion(path);
                }
                break;
        }
    }

    /** Updates quiz view info
     * @param {number} i
     * 
     * @return {Question}
     */
    setQuestionInfo(i) {
        let quiz = this.value;
        let n = quiz.questions.length;
        let question = quiz.questions[i]
        this.quizView.setQuestionInfo(question, [i, n]); 
        return question;
    }


    /**
     * Called when the editor makes changes
     */
    onQuizUpdate(){
        let {quizView} = this;
        let path = this.editor.path; // get the path of the editor.
        
        if (path.length > 0) {
            quizView.disabled = false;

            // update the question info and answer on quiz view.
            quizView.answers = this.setQuestionInfo(path[0]).answers;

            // Select the answer that is selected in the editor.
            quizView.answerBoard.selected = path.slice(1);

            // potentially the user has moved the question.
            this.lastQuestion = path[0]
        } else {
            quizView.disabled = true;
        }
    }

    /**
     * Called when either the path changes because either the 
     * user selects a new path using the editor, or the user navigates
     * to another question using the quiz view.
     */
    displayQuestion(path) {
        if (path.length > 0) {
            let {lastQuestion, quizView} = this;
            quizView.disabled = false;
            let [i, j] = path;
            if (i !== lastQuestion) {
                let answers = this.setQuestionInfo(i).answers; 
                let dir = typeof lastQuestion === "number" ? (lastQuestion < i) : null
                if (dir == null) quizView.answers = answers;
                else quizView.transitionAnswers(answers, dir, [j]);
            } else {
                quizView.answerBoard.selected = [j]
            }
            this.lastQuestion = i;
        } else {
            this.quizView.disabled = true;
        }
    }

    /** @return {Quiz} */
    get value() {
        return this.editor.value;
    }
}
