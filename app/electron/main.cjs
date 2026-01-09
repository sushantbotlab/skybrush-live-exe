const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;

function startServer() {
  const serverPath = path.join(__dirname, "../../server");
  serverProcess = spawn(
    "uv",
    ["run", "skybrushd", "-c", "etc/conf/skybrush-outdoor.jsonc"],
    {
      cwd: serverPath,
      stdio: "inherit",
      shell: true
    }
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      contextIsolation: true
    }
  });

  // Load Skybrush Live UI
  mainWindow.loadFile(
    path.join(__dirname, "../build/index.html")
  );
}

app.whenReady().then(() => {
  startServer();

  // Give server time to boot
  setTimeout(createWindow, 3000);
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

