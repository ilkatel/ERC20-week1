import { ethers } from "hardhat"
const args = require('../arguments')


async function deploy() {
  const [owner] = await ethers.getSigners()
  
  const Erc = await ethers.getContractFactory("ERC", owner)
  const erc = await Erc.deploy(args[0], args[1], args[2], args[3])
  await erc.deployed()

  console.log("Contract deployed. Address:", erc.address)
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
