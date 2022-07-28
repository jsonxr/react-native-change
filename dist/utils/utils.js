"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iosRequiredPaths = exports.loadAndroidManifest = exports.loadAppJson = exports.getBundlePath = exports.getFiles = exports.stat = void 0;
const cheerio_1 = require("cheerio");
const promises_1 = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const stat = async (src) => {
    try {
        const result = await promises_1.default.stat(src);
        return result;
    }
    catch (err) { } // ignore
};
exports.stat = stat;
const getFiles = async (filename) => {
    let files = [];
    const file = await (0, exports.stat)(filename);
    if (file) {
        if (file?.isDirectory()) {
            files = await promises_1.default.readdir(filename);
        }
        else {
            files = ['']; // We want just the filename...
        }
    }
    return files;
};
exports.getFiles = getFiles;
const getBundlePath = (bundleId) => {
    if (!bundleId) {
        throw new Error('Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"');
    }
    const bundlePath = bundleId.replace(/\./g, '/');
    const id = bundleId.split('.');
    if (id.length < 2) {
        throw new Error('Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"');
    }
    const validBundleID = /^([a-zA-Z]([a-zA-Z0-9_])*\.)+[a-zA-Z]([a-zA-Z0-9_])*$/u;
    if (!validBundleID.test(bundleId)) {
        throw new Error('Invalid Bundle Identifier. It must have at least two segments (one or more dots). Each segment must start with a letter. All characters must be alphanumeric or an underscore [a-zA-Z0-9_]');
    }
    return bundlePath;
};
exports.getBundlePath = getBundlePath;
const loadAppJson = async (dir) => {
    const text = await (0, promises_1.readFile)(path_1.default.join(dir, 'app.json'), {
        encoding: 'utf-8',
    });
    return JSON.parse(text);
};
exports.loadAppJson = loadAppJson;
const loadAndroidManifest = async (dir) => {
    const filename = path_1.default.join(dir, 'android/app/src/main/AndroidManifest.xml');
    const data = await (0, promises_1.readFile)(filename);
    const $data = (0, cheerio_1.load)(data);
    const bundleId = $data('manifest').attr('package');
    if (!bundleId) {
        throw new Error(`Could not load android manifest "${filename}"`);
    }
    return bundleId;
};
exports.loadAndroidManifest = loadAndroidManifest;
function iosRequiredPaths(name) {
    return [`ios/${name}`];
}
exports.iosRequiredPaths = iosRequiredPaths;
//# sourceMappingURL=utils.js.map