# xeokit-bim-viewer-demo

# Installing

````bash
git clone https://github.com/xeokit/xeokit-bim-viewer-ex1.git
cd ./xeokit-bim-viewer-ex1
npm install
npm run build
````

# Usage

### Creating a Project

1. Create a project from some model files (in this case IFC):

````bash
node createProject.js -p myProject -s ./demoModels/**/*.ifc
````

That will create directory ````./data/demoModels```` and modify ````./data/projects/index.json````.

2. Start a Web server:

````bash
http-server -p 8080
````

3. View the project in your browser:

[http://localhost:8080/?projectId=myProject](http://localhost:8080/?projectId=myProject)

4. Publish the project to the Web, eg:

````
git add ./data
git commit -m "Added new project"
git push origin main
````

### Deleting a Project

````bash
node deleteProject.js -p myProject
````

That will delete directory ````./data/demoModels```` and modify ````./data/projects/index.json````.

### Creating the Demo Project

Run this command to create a demo project containing all our sample models:

````bash
node createProject.js -p demoProject -s ./demoModels/**/*
````

We've actually already created and published that demo project, which you can view here:  

[https://xeokit.github.io/xeokit-bim-viewer-ex1/?projectId=demoProject&modelId=DenHaag_01](https://xeokit.github.io/xeokit-bim-viewer-ex1/?projectId=demoProject&modelId=DenHaag_01)

### Deleting the Demo Project

When you no longer need the demo project, delete it with:

````bash
node deleteProject.js -p demoProject
````

