import { task } from "hardhat/config"
import { utils } from "./utils"

const u = new utils()

export default task("verif", "Verify contract")
    .setAction(async (_, hre) => {
        const args = require('../arguments')
        await hre.run("verify:verify", {
            address: u.address,
            constructorArguments: args
        })
})
