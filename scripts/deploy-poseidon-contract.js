// License: LGPL-3.0+

import ethers from "ethers"

import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import * as envfile from "envfile"
const parsedENVFile = envfile.parse(fs.readFileSync(".env"))

import { createCode, generateABI } from "../src/poseidon_gencontract.js"

async function main() {
    // Creating provider and signer.
    const provider = new ethers.providers.JsonRpcProvider(process.env.URL)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // Creating PoseidonT3 factory.
    const poseidonT3Factory = new ethers.ContractFactory(
        generateABI(2),
        createCode(2),
        signer
    )

    // Creating PoseidonT4 factory.
    const poseidonT4Factory = new ethers.ContractFactory(
        generateABI(3),
        createCode(3),
        signer
    )

    // Deploying PoseidonT3 library.
    const poseidonT3 = await poseidonT3Factory.deploy()
    await poseidonT3.deployed()
    const poseidonT3Address = poseidonT3.address
    console.log("PoseidonT3 deployed to:", poseidonT3Address)

    // Deploying PoseidonT4 library.
    const poseidonT4 = await poseidonT4Factory.deploy()
    await poseidonT4.deployed()
    const poseidonT4Address = poseidonT4.address
    console.log("PoseidonT4 deployed to:", poseidonT4Address)

    // Setting .env variables.
    parsedENVFile.POSEIDON_T3 = poseidonT3Address
    parsedENVFile.POSEIDON_T4 = poseidonT4Address
    fs.writeFileSync('.env', envfile.stringify(parsedENVFile))

    // Exiting.
    process.exit()
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
    process.exit()
})
