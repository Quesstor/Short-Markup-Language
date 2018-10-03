'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "smlcompiler" is now active!');

    compile();

    context.subscriptions.push(commands.registerCommand('extension.smlCompile', () => {
        compile();
    }));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(compile, null));
    context.subscriptions.push(window.onDidChangeActiveTextEditor(compile, null));
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function compile() {
    if (!window.activeTextEditor) return;
    let smlcode = window.activeTextEditor.document.getText();
    let lines = smlcode.split(/\r?\n/);
    let html = new HtmlWriter();
    let tabSpaces = 4;
    let indent = 0;
    let lastLineWasTag = false;
    for (let i = 0; i < lines.length; i++) {
        let l = lines[i];
        if (l.match(/^ *$/)) continue;

        let lineIndent = countLeadingSpaces(l) / tabSpaces;
        if(lineIndent == indent && lastLineWasTag) html.closeCurrentTag();
        while (indent > lineIndent){
            html.closeCurrentTag();
            indent -= 1;
        } 

        indent = lineIndent;
        let tagMatch = l.match(/^ *</);
        if (tagMatch) {
            let tag = l.split(">");
            html.openTag(tag[0].trim().substring(1));
            if(tag.length > 1) html.writeStr(tag[1]);
            lastLineWasTag = true;
        } else {
            html.writeStr(l);
            lastLineWasTag = false;
        }
    }


    let smlpath = window.activeTextEditor.document.fileName;
    let htmlpath = smlpath.substring(0, smlpath.length - 4) + ".html";
    fs.writeFileSync(htmlpath, html.getHtml(), 'utf8');

    // window.showInformationMessage(smlcode);
}

function countLeadingSpaces(str: string) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] != " ") return i;
    }
    return str.length;
}

class HtmlWriter{
    private tagStack: string[] = [];
    private html: string = "";

    openTag(tag: string){
        this.html += this.getIndent() + "<" + tag + ">\n";
        this.tagStack.push(tag.split(" ")[0]);
    }
    writeStr(str: string){
        str = str.trim();
        if(str.length > 0) this.html += this.getIndent() + str + "\n";
    }
    closeCurrentTag(){
        if(this.tagStack.length == 0) return;
        let tag = this.tagStack.pop();
        this.html += this.getIndent() + "</" + tag + ">\n";
    }
    getHtml(){
        while (this.tagStack.length > 0) this.closeCurrentTag();
        return this.html;
    }
    getIndent(): string{
        let str = "";
        for (var i = 0; i < this.tagStack.length * 4; i++) str += " ";
        return str;
    }
}