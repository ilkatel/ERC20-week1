import { task } from "hardhat/config"
import { utils } from "./utils"
import { ContractTransaction as tx} from 'ethers'

const u = new utils()

export default task("transferFrom", "Transfer tokens from another address")
    .addParam("from", "Account address")
    .addParam("to", "Account address")
    .addParam("value", "Amount tokens")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.transferFrom(taskArgs.from, taskArgs.to, u.toWei(taskArgs.value)).then((result:tx) => u.printHash(result))
})
