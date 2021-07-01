# xeokit-bim-viewer-demo

# Installing

````bash
npm install

npm run build
````

# Usage

### Creating a Project

1. Create a project from some model files (in this case IFC):

````bash
node createProject.js -p myProject -s ./demoModels/**/*.ifc
````

2. Start a Web server:

````bash
http-server -p 8080
````

3. View the project in your browser:

[http://localhost:8080/projectId=myProject](http://localhost:8080/projectId=myProject)

### Deleting a Project

````bash
node deleteProject.js -p myProject
````

### Creating the Demo Project

Run this command to create a demo project containing all our sample models:

````bash
node createProject.js -p demoProject -s ./demoModels/**/*
````

[http://localhost:8080/projectId=myProject](http://localhost:8080/projectId=myProject)

### Deleting the Demo Project

When you no longer need the demo project, delete it with:

````bash
node deleteProject.js -p demoProject
````

