const marked = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

class MarkdownUtil {
    constructor() {
        this.toc = [];
        this.content = '';
    }

    parseMarkdown(markDownString) {
        const that = this;
        const renderer = {
            heading(text, level, raw) {
                const tocItem = {label: raw, level};
                that.toc.push(tocItem);

                return `<a id="${raw}"><h${level}>${text}</h${level}></a>`;
            },
            paragraph(text) {
                return text.replace(/\n/g, "<br/>");
            }
        }
        marked.use({renderer});
        this.content = marked(markDownString).replace(/<pre>/g, "<pre class='hljs'>");
    }
}

module.exports = MarkdownUtil;