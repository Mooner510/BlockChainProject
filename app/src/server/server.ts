// 1. 모듈포함
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

import { Contract, Gateway, Network, Wallet, Wallets } from "fabric-network";

const ccpPath = path.resolve("..", "..", "fabric-samples", "test-network", "organizations", "peerOrganizations", "org1.example.com", "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

console.log(__dirname)
console.log(process.cwd())
console.log(path.join())
app.use(express.static(path.join(__dirname, "..", "..", "src", "html")));
app.use("/css", express.static(path.join(__dirname, "..", "..", "src", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "..", "src", "js")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const login = async (res: (wallet: Wallet, gateway: Gateway, network: Network, contract: Contract) => Promise<void>, error: (response: any) => void) => {
  const walletPath = path.join(__dirname, "..", "..", "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get("appUser");
  if (!identity) {
    console.log(`An identity for the user does not exists in the wallet`);
    const res_str = `{"result":"failed","msg":"An identity for the user does not exists in the wallet"}`;
    error(JSON.parse(res_str));
    return;
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: "appUser", discovery: { enabled: true, asLocalhost: true } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork("mychannel");

  // Get the contract from the network.
  const contract = network.getContract("ramyun");

  await res(wallet, gateway, network, contract);

  gateway.disconnect();
}

const fix = async (contract: Contract, name: string, ...args: string[]) => {
  const str = Buffer.from(await contract.evaluateTransaction(name, ...args)).toString('utf8');
  return JSON.parse(str);
}

app.post("/ramyun/create", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    await contract.submitTransaction("CreateRamyun", req.body.name, req.body.price, req.body.amount, req.body.seller, req.body.company);
    res.status(200).json(null);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun/name", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryRamyunByName", req.query.name as string);
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun/seller", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryRamyunBySeller", req.query.name as string);
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun/company", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryRamyunByCompany", req.query.name as string);
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun/price", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryRamyunByPriceBetween", req.query.min as string, req.query.max as string);
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun/can", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryRamyunCanBuyByPrice", req.query.price as string);
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

app.get("/ramyun", async (req, res) => {
  await login(async (wallet, gateway, network, contract) => {
    const data = await fix(contract, "QueryAllRamyuns");
    console.log(data)
    res.status(200).json(data);
  }, err => {
    res.status(400).json(err);
  });
})

// 5. 서버시작
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);