"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. 모듈포함
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fabric_network_1 = require("fabric-network");
const ccpPath = path_1.default.resolve("..", "..", "fabric-samples", "test-network", "organizations", "peerOrganizations", "org1.example.com", "connection-org1.json");
const ccp = JSON.parse(fs_1.default.readFileSync(ccpPath, "utf8"));
const app = (0, express_1.default)();
const PORT = 3000;
const HOST = "0.0.0.0";
console.log(__dirname);
console.log(process.cwd());
console.log(path_1.default.join());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "src", "html")));
app.use("/css", express_1.default.static(path_1.default.join(__dirname, "..", "..", "src", "css")));
app.use("/js", express_1.default.static(path_1.default.join(__dirname, "..", "..", "src", "js")));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const login = (res, error) => __awaiter(void 0, void 0, void 0, function* () {
    const walletPath = path_1.default.join(__dirname, "..", "..", "wallet");
    const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the admin user.
    const identity = yield wallet.get("appUser");
    if (!identity) {
        console.log(`An identity for the user does not exists in the wallet`);
        const res_str = `{"result":"failed","msg":"An identity for the user does not exists in the wallet"}`;
        error(JSON.parse(res_str));
        return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new fabric_network_1.Gateway();
    yield gateway.connect(ccp, { wallet, identity: "appUser", discovery: { enabled: true, asLocalhost: true } });
    // Get the network (channel) our contract is deployed to.
    const network = yield gateway.getNetwork("mychannel");
    // Get the contract from the network.
    const contract = network.getContract("ramyun");
    yield res(wallet, gateway, network, contract);
    gateway.disconnect();
});
const fix = (contract, name, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const str = Buffer.from(yield contract.evaluateTransaction(name, ...args)).toString('utf8');
    return JSON.parse(str);
});
app.post("/ramyun/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        yield contract.submitTransaction("CreateRamyun", req.body.name, req.body.price, req.body.amount, req.body.seller, req.body.company);
        res.status(200).json(null);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun/name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryRamyunByName", req.query.name);
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun/seller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryRamyunBySeller", req.query.name);
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun/company", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryRamyunByCompany", req.query.name);
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun/price", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryRamyunByPriceBetween", req.query.min, req.query.max);
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun/can", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryRamyunCanBuyByPrice", req.query.price);
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
app.get("/ramyun", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield login((wallet, gateway, network, contract) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield fix(contract, "QueryAllRamyuns");
        console.log(data);
        res.status(200).json(data);
    }), err => {
        res.status(400).json(err);
    });
}));
// 5. 서버시작
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
