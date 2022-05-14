import { task } from "hardhat/config"
import { utils } from "./utils"

const u = new utils()

export default task("balanceOf", "Return token balance")
    .addParam("owner", "Account address")
    .setAction(async (taskArgs, hre) => {
        const erc = await u.getContract(hre)
        await erc.balanceOf(taskArgs.owner).then((result:string) => u.log(u.toEther(result)))
})
