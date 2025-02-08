import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'
// import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
import { SvgPlus } from '../SvgPlus/4.js';

const MD = new markdownIt();


function markdown(text, multi){
    let html;
    
    if (!multi) {
        html = MD.renderInline(text);
    } else {
        html = MD.render(text);
    }
    
    return html;
}

function tokeniseMath(text) {
    let matches = [...text.matchAll(/\$\$/g)];

    let si = 0;
    let strs = [];
    let tokens = []
    if (matches.length > 1) {
        for (let i = 0; i < matches.length; i+= 2) {
            let open = matches[i].index;
            let close = matches[i + 1].index + 2;
            let token = `!${(new Date).getTime()}${i}!`
            
            strs.push(text.slice(si, open));
            strs.push(token);
            tokens.push([token, "$"+text.slice(open, close)+"$"])

            si = close;
        }
        strs.push(text.slice(si, text.length))
    } else {
        strs = [text]
    }
    
    return [strs.join(""), tokens]
}

export class MarkdownElement extends SvgPlus {
    constructor(el, content, multi = false){
        super(el)
        this.loading = this.build(content, multi);
    }
    async build(content, multi){
        
        let [contentTokenised, tokens] = tokeniseMath(content);

        let html = markdown(contentTokenised, multi);

        for (let token of tokens) {
            html = html.replace(...token)
        }

        this.innerHTML =  html
        
        await MathJax.typeset([this])        
    }
}