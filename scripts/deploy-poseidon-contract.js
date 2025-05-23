import dotenv from "dotenv";
dotenv.config();

import ethers from "ethers";
import fs from "fs";
import * as envfile from "envfile";

import { createCode, generateABI } from "../src/poseidon_gencontract.js";

const parsedENVFile = envfile.parse(fs.readFileSync(".env"));

const main = async () => {
    try {
        // Creating provider.
        const provider = new ethers.providers.JsonRpcProvider(process.env.URL);

        // Logging chain data.
        const chainId = (await provider.getNetwork()).chainId;
        console.log("Deploying on chain ID:", chainId);

        // Creating signer.
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        // Getting gas price and gas limit.
        const gasPrice = (await provider.getFeeData()).gasPrice;
        const gasLimit = ethers.BigNumber.from(6000000);

        // Creating poseidon factories.
        const poseidonT3Factory = new ethers.ContractFactory(generateABI(2), createCode(2), signer);
        const poseidonT4Factory = new ethers.ContractFactory(generateABI(3), createCode(3), signer);

        // Deploying poseidon libraries.
        const poseidonT3Address = await deployWithOptions("PoseidonT3", poseidonT3Factory, gasPrice, gasLimit);
        const poseidonT4Address = await deployWithOptions("PoseidonT4", poseidonT4Factory, gasPrice, gasLimit);

        // Setting environment variables.
        parsedENVFile.POSEIDON_T3_ADDRESS = poseidonT3Address;
        parsedENVFile.POSEIDON_T4_ADDRESS = poseidonT4Address;
        fs.writeFileSync(".env", envfile.stringify(parsedENVFile));

        // Logging success statement.
        console.log("Completed deployment");
    } catch (error) {
        // Logging error statement.
        console.error("Failed deployment");

        // Logging error data.
        if (error?.transaction) {
            console.error("Reason           :", error.reason);
            console.error("Method           :", error.method);
            console.error("Transaction from :", error.transaction.from);
            console.error("Transaction to   :", error.transaction.to);
            console.error("Transaction data :", error.transaction.data);
        } else {
            console.error(error);
        }
    }
};

const deployWithOptions = async (contractName, contractFactory, gasPrice, gasLimit) => {
    const contract = await contractFactory.deploy({ gasPrice: gasPrice, gasLimit: gasLimit });
    await contract.deployed();

    const contractAddress = contract.address;

    console.log(`${contractName} deployed to:`, contractAddress);

    return contractAddress;
};

main();
