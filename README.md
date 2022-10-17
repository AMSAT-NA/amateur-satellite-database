A searchable, sortable table listing all the ham satellites in space

## Requirements

- [Node.js](https://nodejs.org/en/) version 12, 14 or 16, though at minimum 12.20, 14.14, or 16.0.
- [Node Package Manager](https://www.w3schools.com/whatis/whatis_npm.asp)

## Contributing

Clone the repository and move into the directory. Install the static-site framework.

```bash
npm install
```

Kickstart the local development server.

```bash
npm start
```

Visit localhost:3000 in your web browser. Changes you make the source code should appear immediately. Commit and push them to the repository's main branch and they will be automatically published by GitLab's continuous deployment system.

## About the site

This site is generated using [`@datagraphics/baker`](https://github.com/datadesk/baker), a build tool by and for the Los Angeles Times. The Times uses it to build the static pages published at latimes.com/projects. You can use it however you'd like.

An example of how The Times puts the package to use is available at datadesk/baker-example-page-template.