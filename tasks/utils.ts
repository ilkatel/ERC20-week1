import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import { ContractTransaction as tx} from 'ethers'

dotenv.config()

class utils {

    printHash(result:tx) {
        console.log(` >>> tx hash: ${result.hash}`)
    }

    log(msg:string) {
        console.log(` >>> ${msg}`)
    }

    address = process.env.ADDRESS

    async getOwner(hre:any) {
        const [owner] = await hre.ethers.getSigners()
        return owner
    }

    async getContract(hre:any) { 
        const metadata = require('../artifacts/contracts/ERC.sol/ERC.json')

        const erc = new hre.ethers.Contract(
            this.address,
            metadata.abi,
            await this.getOwner(hre)
        )

        return erc
    }

    toEther(_wei:string) {
        return ethers.utils.formatEther(_wei)
    }

    toWei(_eth:string) {
        return ethers.utils.parseEther(_eth)
    }
}

export { utils }
