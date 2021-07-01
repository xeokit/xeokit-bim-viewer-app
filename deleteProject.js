#!/usr/bin/env node

const commander = require('commander');
const package = require('./package.json');
const fs = require('fs');
const rimraf = require("rimraf");

const program = new commander.Command();

program.version(package.version, '-v, --version');

program
    .option('-p, --projectid [string]', 'ID of project to delete')
    .option('-d, --datadir [file]', 'optional path to target data directory - default is "./data"');

program.on('--help', () => {

});

program.parse(process.argv);

const options = program.opts();

if (options.projectid === undefined) {
    console.error('\n\nError: please specify ID of project to delete.');
    program.help();
    process.exit(1);
}

const projectId = options.projectid;
const dataDir = options.datadir || "./data";
const projectsDir = `${dataDir}/projects`;
const projectsIndexPath = `${projectsDir}/index.json`;
const projectDir = `${projectsDir}/${projectId}`;

deleteProject().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

async function deleteProject() {

    if (!fs.existsSync(dataDir)) {
        console.log(`Data directory not found: ${dataDir}`);
        process.exit(0);
    }

    if (!fs.existsSync(projectsDir)) {
        console.log(`Data projects directory not found: ${projectsDir}`);
        process.exit(0);
    }

    if (!fs.existsSync(projectDir)) {
        console.log(`Project directory not found: ${projectDir}`);
        process.exit(0);
    }

    if (!fs.existsSync(projectsIndexPath)) {
        console.log(`Projects index not found: ${projectsIndexPath}`);
        process.exit(0);

    }

    const projectsIndex = JSON.parse(await fs.readFileSync(projectsIndexPath));

    if (!projectsIndex.projects) {
        console.log(`Invalid projects index ("projects" list not found): ${projectsIndexPath}`);
        process.exit(1);
    }

    console.log(`[deleteProject] Deleting project directory: ${projectDir}`);

     rimraf.sync(projectDir);

    for (let i = 0, len = projectsIndex.projects.length; i < len; i++) {
        const projectInfo = projectsIndex.projects[i];
        if (projectInfo.id === projectId) {

            console.log(`[deleteProject] Updating projects index: ${projectsIndexPath}`);

            projectsIndex.projects.splice(i, 1);
            await fs.promises.writeFile(projectsIndexPath, JSON.stringify(projectsIndex, null, "\t"));

            break;
        }
    }

    console.log(`[deleteProject] Project "${projectId}" deleted.`);
    process.exit(0);
}
