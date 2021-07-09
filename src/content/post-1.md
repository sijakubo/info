---
title: "Samples"
date: "2021-07-08"
draft: true
path: "/notes/example-title"
---
# H1

## H2

### H3

#### H4

##### H5

###### H6

Paragraph

---

> This is a quote

---

[Example.com](example.com)

---

`const foo = bar`

```javascript
const foo = bar
console.log(foo);
```

---

| Hello | World |
|-------|------ |
| Foo   | Bar   |

## An Code example with PrismJS
Gatsby-Starter-Julia uses the Atom Editor Theme.

```js
console.log("Hello World");
```

## Default NodeJS server

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
