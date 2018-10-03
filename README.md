# Short-Markup-Language (SML)
This is a simple approach to reduce html overhead and redundancy by making it indentation and line-sensitive.

# How does it work
To open a tag simply write `<[tagname] [attrName]=[attrValue]` like standard html, either a `>` or a newline character ends the tag opening.

To write something into this tag, simply indent the next line more than the opening line.

To close the tag simply write your next code with the same (or less) indentation as the opening tag.

## Example
The following sml
```
Hello,
<a href="web.html"
    click
    <b>here
to get to the web
```
compiles to the html
```
Hello,
<a href="web.html">
    click
    <b>
        here
    </b>
</a>
to get to the web
```

# Install
Copy both folders to your vscode extensions folder, 
which can be found at `%USERPROFILE%\.vscode\extensions` on windows.

# Usage
1. create a `.sml` file
2. start writing sml.

 The extension creates a `.html` file with the same name as the `.sml` file and writes the html code automatically into the `.html` file.