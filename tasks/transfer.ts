import { task } from "hardhat/config"
import { utils } from "./utils"
import { ContractTransaction as tx} from 'ethers'

const u = new utils()

export default task("transfer", "Transfer tokens")
    .addParam("to", "Account address")
    .addParam("value", "Amount tokens")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.transfer(taskArgs.to, u.toWei(taskArgs.value)).then((result:tx) => u.printHash(result))
})
