import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { BaseContract } from 'ethers'

async function runTests() {

  let erc: BaseContract
  const accs = await ethers.getSigners()
  const owner = accs[0],
        person1 = accs[1],
        person2 = accs[2]
  const args = require('../arguments')
  const zeroAddress = ethers.constants.AddressZero
  
  describe('ERC20 Token test', async () => {
    beforeEach(async function() {
      const _erc = await ethers.getContractFactory('ERC', owner)
      erc = await _erc.deploy(args[0], args[1], args[2], args[3])
      await erc.deployed()
    })

    it("SHOULD BE SUCCESS  | deploy with correct address", async function() {
      expect(erc.address)
        .to.be.properAddress
    })

    it("SHOULD BE SUCCESS  | get dufault args", async function() {
      const name = await erc.connect(owner).name()
      expect(name).to.be.eq(args[0])

      const symbol = await erc.connect(owner).symbol()
      expect(symbol).to.be.eq(args[1])

      const supply = await erc.connect(owner).totalSupply()
      expect(supply).to.be.eq(args[2])

      const decimals = await erc.connect(owner).decimals()
      expect(decimals).to.be.eq(args[3])
    })

    it("SHOULD BE REVERTED | try mint to zero address", async function() {
      await expect(erc.connect(owner).mint(zeroAddress, 200))
        .to.be.revertedWith("Cant mint to zero address")
    })

    it("SHOULD BE REVERTED | try burn from zero address", async function() {
      await expect(erc.connect(owner).burn(zeroAddress, 200))
        .to.be.revertedWith("Cant burn from zero address")
    })

    it("SHOULD BE REVERTED | try burn out of balance", async function() {
      await expect(erc.connect(owner).burn(person1.address, 200))
        .to.be.revertedWith("Amount out of balance")
    })  

    it("SHOULD BE REVERTED | not owner try mint or burn", async function() {
      await expect(erc.connect(person1).burn(owner.address, 200))
        .to.be.revertedWith("You are not an owner")

      await expect(erc.connect(person1).mint(owner.address, 200))
        .to.be.revertedWith("You are not an owner")
    })

    it("SHOULD BE SUCCESS  | mint and burn change balance", async function() {
      await erc.connect(owner).mint(owner.address, 200)
      let balance = await erc.connect(owner).balanceOf(owner.address)
      expect(balance).to.be.eq(200)

      await erc.connect(owner).burn(owner.address, 100)
      balance = await erc.connect(owner).balanceOf(owner.address)
      expect(balance).to.be.eq(100)
    })
  });

  describe('ERC20 Token test | step 2', async () => {
    beforeEach(async function() {
      const _erc = await ethers.getContractFactory('ERC', owner)
      erc = await _erc.deploy(args[0], args[1], args[2], args[3])
      await erc.deployed()

      await erc.connect(owner).mint(owner.address, 100_000)
    })

    it("SHOULD BE REVERTED | try to transfer to the null address", async function() {
      await expect(erc.connect(owner).transfer(zeroAddress, 100))
        .to.be.revertedWith("Cannot transfer to the null address")
    })

    it("SHOULD BE REVERTED | try to transfer out of balance", async function() {
      await expect(erc.connect(owner).transfer(person1.address, 100_000_000))
        .to.be.revertedWith("Cannot transfer out of balance")
    })

    it("SHOULD BE SUCCESS  | correctly transfer", async function() {
      await erc.connect(owner).transfer(person1.address, 100)
      
      const balance = await erc.connect(owner).balanceOf(person1.address)
      expect(balance).to.be.eq(100)
    })

    it("SHOULD BE REVERTED | try to approve to the null address", async function() {
      await expect(erc.connect(owner).approve(zeroAddress, 100))
        .to.be.revertedWith("Cannot approve to the null address")
    })

    it("SHOULD BE SUCCESS  | approve changed allowance", async function() {
      await erc.connect(owner).approve(person1.address, 100)
      const allowance = await erc.connect(owner).allowance(owner.address, person1.address)
      expect(allowance).to.be.eq(100)
    })

    it("SHOULD BE REVERTED | try to spend out of allowance", async function() {
      await erc.connect(owner).approve(person1.address, 100)
      await expect(erc.connect(person1).transferFrom(owner.address, person2.address, 200))
        .to.be.revertedWith("Cannot spend out of allowance")
    })

    it("SHOULD BE REVERTED | try to transfer from null address", async function() {
      await expect(erc.connect(owner).transferFrom(zeroAddress, person2.address, 200))
        .to.be.revertedWith("Cannot transfer from the null address")
    })

    it("SHOULD BE SUCCESS  | transfer from", async function() {
      await erc.connect(owner).approve(person1.address, 100)
      await erc.connect(person1).transferFrom(owner.address, person2.address, 100)
      const balance = await erc.connect(owner).balanceOf(person2.address)
      expect(balance).to.be.eq(100)
    })
  })
}

runTests()
