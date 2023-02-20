# project-tracker (LAB-09)

## Project: Side Project Completion Tracker Back-end

### Author: Steve Gant & Tyler Bennett

### Problem Domain  

Allows users to submit/update their projects and see their average side project completion rate

### Links and Resources

- [ci/cd](https://github.com/tyler-bennett52/project-tracker/actions) (GitHub Actions)
- [back-end server url](https://project-tracker-uka9.onrender.com) (when applicable)

### Setup

#### `.env` requirements (where applicable)

DATABASE_URL requires a postgres DB url

#### How to initialize/run your application (where applicable)

- `node index.js`

#### How to use your library (where applicable)

#### Features / Routes

/ - GET to receive some instructions
/signup - POST with username/password/role to receive credentials
/signin - POST with BASIC auth to receive credentials
/projects - GET & POST projects/:id - GET & POST & DELETE

#### Tests

npm test

#### UML & WRRC

![Lab-09 UML](assets/lab09-UML.png)

#### Attribution

Built from completed Lab-08 which was built from starter code
