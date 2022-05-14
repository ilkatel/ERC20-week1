import { task } from "hardhat/config"
import { utils } from "./utils"

const u = new utils()

export default task("allowance", "Return allowance")
    .addParam("owner", "Account address")
    .addParam("spender", "Account address")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.allowance(taskArgs.owner, taskArgs.spender).then((result:string) => u.log(result))
})
