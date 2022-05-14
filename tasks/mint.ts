import { task } from "hardhat/config"
import { utils } from "./utils"
import { ContractTransaction as tx} from 'ethers'

const u = new utils()

export default task("mint", "Mint tokens")
    .addParam("address", "Account address")
    .addParam("amount", "Amount tokens")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.mint(taskArgs.address, u.toWei(taskArgs.amount)).then((result:tx) => u.printHash(result))
})
