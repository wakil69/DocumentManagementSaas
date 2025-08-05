// @ts-check


const apps = [
    {
        name: "frontend",
        script: "npm",
        args: "run start",
        interpreter: "cmd.exe",
        node_args: "--max-old-space-size=2048"
    }
];

const config = {
    apps
}

module.exports = apps
