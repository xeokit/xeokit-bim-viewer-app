# xeokit-bim-viewer-app

[![Twitter Follow](https://img.shields.io/twitter/follow/xeolabs?style=social)](https://twitter.com/xeolabs) 

[![Screenshot](https://github.com/xeokit/xeokit-bim-viewer/raw/master/images/xeokit-bim-viewer.png)](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)

---

**[xeokit-bim-viewer-app](https://github.com/xeokit/xeokit-bim-viewer-app)** is a BIM model viewer application,
built around [xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer), that loads XKT files and metadata
from a data directory.

The viewer comes with a Node.js CLI script that batch-converts model files, of various source formats (including IFC,
CityJSON, LAZ and glTF), into XKT files and metadata within the data directory.

Then we can serve our viewer with GitHub pages or our own HTTP server, point our browser at it, and view our models.

Using this viewer is as simple as cloning the repo, building it, dropping in your own IFC/CityJSON/LAZ/glTF models, then
running the script on those models.

Read the documentation below to get started.

--- 

* [Source Code](https://github.com/xeokit/xeokit-bim-viewer-app)
* [xeokit SDK](http://xeokit.io)

---

## Contents

- [Installing](#installing)
- [Usage](#usage)
    + [Creating a Project](#creating-a-project)
    + [Deleting a Project](#deleting-a-project)
    + [Creating the Demo Project](#creating-the-demo-project)
    + [Deleting the Demo Project](#deleting-the-demo-project)
    
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

That will create directory ````./data/myProject```` and modify ````./data/projects/index.json````.

2. Start a Web server:

````bash
http-server -p 8080
````

3. View the project in your browser:

[http://localhost:8080/?projectId=myProject](http://localhost:8080/?projectId=myProject)

4. Publish the project to the Web, eg. via GitHub Pages:

````
git add ./data
git commit -m "Added new project"
git push origin main
````

### Deleting a Project

````bash
node deleteProject.js -p myProject
````

That will delete directory ````./data/myProject```` and modify ````./data/projects/index.json````.

### Creating the Demo Project

Run this command to create a demo project containing all our sample models:

````bash
node createProject.js -p demoProject -s ./demoModels/**/*
````

We've actually already created and published that demo project, which you can view here:

[https://xeokit.github.io/xeokit-bim-viewer-app/?projectId=demoProject&modelId=DenHaag_01](https://xeokit.github.io/xeokit-bim-viewer-app/?projectId=demoProject&modelId=DenHaag_01)

### Deleting the Demo Project

When you no longer need the demo project, delete it with:

````bash
node deleteProject.js -p demoProject
````

