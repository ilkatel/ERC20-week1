import { task } from "hardhat/config"
import { utils } from "./utils"
import { ContractTransaction as tx} from 'ethers'

const u = new utils()

export default task("approve", "Give rights to spend tokens")
    .addParam("spender", "Account address")
    .addParam("value", "Amount tokens")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.approve(taskArgs.spender, u.toWei(taskArgs.value)).then((result:tx) => u.printHash(result))
})
