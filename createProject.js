#!/usr/bin/env node

const commander = require('commander');
const package = require('./package.json');
const fs = require('fs');
const glob = require('glob');
const path = require("path");
const puppeteer = require('puppeteer');
const httpServer = require("http-server");
const convert2xkt = require("@xeokit/xeokit-xkt-utils/dist/convert2xkt.cjs.js");

const SERVER_PORT = 3000;
const SCREENSHOT_SIZE = [200, 200];
const HEADLESS = false;

const date = new Date('14 Jun 2017 00:00:00 PDT');
const dateUTC = date.toUTCString();

const chromeOptions = {
    product: 'chrome',
    headless: HEADLESS,
    args: [`--window-size=${SCREENSHOT_SIZE[0]},${SCREENSHOT_SIZE[1]}`],
    defaultViewport: {
        width: SCREENSHOT_SIZE[0],
        height: SCREENSHOT_SIZE[1]
    }
};

const program = new commander.Command();

program.version(package.version, '-v, --version');

program
    .option('-s, --source [file]', 'path to source model file(s)')
    .option('-p, --projectid [string]', 'ID for new project')
    .option('-d, --datadir [file]', 'optional path to target data directory - default is "./data"');

program.on('--help', () => {

});

program.parse(process.argv);

const options = program.opts();

if (options.source === undefined) {
    console.error('\n\nError: please specify path to source model file(s).');
    program.help();
    process.exit(1);
}

if (options.projectid === undefined) {
    console.error('\n\nError: please specify project ID.');
    program.help();
    process.exit(1);
}

const source = options.source;
const projectId = options.projectid;
const dataDir = options.datadir || "./data";
const projectsDir = `${dataDir}/projects`;
const projectsIndexPath = `${projectsDir}/index.json`;
const projectDir = `${projectsDir}/${projectId}`;
const projectIndexPath = `${projectDir}/index.json`;
const projectModelsDir = `${projectDir}/models`;

function log(msg) {
    console.log("[createProject] " + msg);
}

createProject().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

async function createProject() {

    if (!fs.existsSync(dataDir)) {
        log(`Creating ${dataDir}`);
        fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(projectsDir)) {
        log(`Creating ${projectsDir}`);
        fs.mkdirSync(projectsDir);
    }

    if (!fs.existsSync(projectDir)) {
        log(`Creating ${projectDir}`);
        fs.mkdirSync(projectDir);
    }

    if (!fs.existsSync(projectsIndexPath)) {

        const projectsIndex = {
            "projects": []
        };

        projectsIndex.projects.push({
            id: projectId,
            name: projectId
        });

        await fs.promises.writeFile(projectsIndexPath, JSON.stringify(projectsIndex, null, "\t"));

    } else {

        const projectsIndex = JSON.parse(await fs.readFileSync(projectsIndexPath));

        if (!projectsIndex.projects) {
            log(`Invalid projects index ("projects" list not found): ${projectsIndexPath}`);
            process.exit(-1);
        }

        for (let i = 0, len = projectsIndex.projects.length; i < len; i++) {
            const projectInfo = projectsIndex.projects[i];
            if (projectInfo.id === projectId) {
                log(`Project already exists: "${projectId}" (use ./deleteProject to delete it)`);
                process.exit(1);
            }
        }

        projectsIndex.projects.push({
            id: projectId,
            name: projectId
        });

        log(`Creating new project "${projectId}" ...`);

        fs.writeFileSync(projectsIndexPath, JSON.stringify(projectsIndex, null, "\t"));
    }

    fs.mkdirSync(projectModelsDir);

    const projectIndex = {
        "id": projectId,
        "name": projectId,
        created: dateUTC,
        "models": [],
        "viewerConfigs": {},
        "viewerContent": {},
        "viewerState": {}
    }

    const stats = {};

    const promises = [];

    glob.sync(source).map(async modelSrc => {

        const modelId = path.basename(modelSrc, path.extname(modelSrc));
        const modelDestDir = `${projectDir}/models/${modelId}`;
        const xktDest = `${modelDestDir}/geometry.xkt`;
        const screenshotDestDir = `${projectDir}/models/${modelId}/screenshot/`;
        const propsDestDir = `${projectDir}/models/${modelId}/props/`;
        const sourceDestDir = `${projectDir}/models/${modelId}/source/`;

        if (!fs.existsSync(modelDestDir)) {
            fs.mkdirSync(modelDestDir);
        }

        if (!fs.existsSync(screenshotDestDir)) {
            fs.mkdirSync(screenshotDestDir);
        }

        if (!fs.existsSync(propsDestDir)) {
            fs.mkdirSync(propsDestDir);
        }

        if (!fs.existsSync(sourceDestDir)) {
            fs.mkdirSync(sourceDestDir);
            //...TODO: copy
        }

        try {

            const projectsIndexModel = {
                id: modelId,
                name: modelId,
                metadata: {}
            };

            projectIndex.models.push(projectsIndexModel);

            promises.push(convert2xkt({
                source: modelSrc,
                output: xktDest,
                outputObjectProperties: (id, props) => {
                    fs.writeFileSync(`${propsDestDir}/${id}.json`, JSON.stringify(props, null, "\t"));
                },
                outputStats: (stats) => {
                    const metadata = projectsIndexModel.metadata;
                    metadata.sourceFormat = stats.sourceFormat || "";
                    metadata.schemaVersion = stats.schemaVersion || "";
                    metadata.title = stats.title || "";
                    metadata.author = stats.author || "";
                    metadata.created = stats.created || "";
                    metadata.numObjects = stats.numObjects || 0;
                    metadata.numTriangles = stats.numTriangles || 0;
                    metadata.numVertices = stats.numVertices || 0;
                    metadata.xktSizeKb = stats.xktSize || 0;
                    metadata.aabb = stats.aabb ? Array.from(stats.aabb) : null;
                },
                log: (msg) => {
                    //console.log(msg)
                }
            }));

        } catch (e) {
            //console.log(e)
        }
    });

    Promise.all(promises).then(() => {
        fs.writeFileSync(projectIndexPath, JSON.stringify(projectIndex, null, "\t"));
        log(`Project "${projectId}" created.`);
        process.exit(0);
    });


    async function createScreenshots(testStats) {
        log("Creating screenshots...\n");
        let server = httpServer.createServer();
        server.listen(SERVER_PORT);
        const modelStats = testStats.modelStats;
        for (let i = 0, len = SOURCE_FILES.length; i < len; i++) {
            const fileInfo = SOURCE_FILES[i];
            const modelId = fileInfo.modelId;
            const stats = modelStats[modelId];
            if (!stats) {
                continue;
            }
            const xktDest = stats.xktDest;
            if (!xktDest) {
                continue;
            }
            const screenshotDir = `${OUTPUT_DIR}/${modelId}/screenshot`;
            const screenshotPath = `${screenshotDir}/screenshot.png`;
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir);
            }
            const browser = await puppeteer.launch(chromeOptions);
            const page = await browser.newPage();
            if (!testStats.browserVersion) {
                testStats.browserVersion = await page.browser().version();
            }
            await page.setDefaultNavigationTimeout(3000000);
            await page.goto(`http://localhost:${SERVER_PORT}/perfTests/perfTestXKT.html?xktSrc=../${xktDest}`);
            await page.waitForSelector('#percyLoaded')
            const element = await page.$('#percyLoaded')
            const value = await page.evaluate(el => el.innerText, element)
            const pageStats = JSON.parse(value);
            await page.screenshot({path: screenshotPath});
            await page.close();
            await browser.close();
            stats.loadingTime = pageStats.loadingTime;
            stats.fps = pageStats.fps;
            stats.screenshot = "screenshot.png";
        }
        server.close();
        log("All XKT models tested in xeokit.\n");
    }

}
