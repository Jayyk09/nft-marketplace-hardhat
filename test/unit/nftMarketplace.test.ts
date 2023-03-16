import { expect, use } from "chai";
import { Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { it } from "mocha";
import { NftMarketplace } from "../../typechain-types";
import { MockNft } from "../../typechain-types";
import { token } from "../../typechain-types/@openzeppelin/contracts";

describe("NftMarketplace", function () {
  let nftMarketplace: NftMarketplace, mockNft: MockNft;
  const PRICE = ethers.utils.parseEther("0.1");
  const TOKEN_ID = 0;
  let deployer: Signer;
  let user: Signer;

  beforeEach(async () => {
    const accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];
    await deployments.fixture(["all"]);

    nftMarketplace = await ethers.getContract("NftMarketplace");
    nftMarketplace.connect(deployer);
    mockNft = await ethers.getContract("MockNft");
    await mockNft.mint();
    await mockNft.approve(nftMarketplace.address, TOKEN_ID);
  });

  describe("mint and list nft", () => {
    it("exclusively items that haven't been listed", async function () {
      await nftMarketplace.listItem(mockNft.address, TOKEN_ID, PRICE);
      await expect(
        nftMarketplace.listItem(mockNft.address, TOKEN_ID, PRICE)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        `NftMarketplace__AlreadyListed`
      );
    });

    it("revert if not owner", async () => {
      await expect(
        nftMarketplace.connect(user).listItem(mockNft.address, TOKEN_ID, PRICE)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "NftMarketplace__NotOwner"
      );
    });

    it("item listed", async () => {
      await expect(
        nftMarketplace.listItem(mockNft.address, TOKEN_ID, PRICE)
      ).to.emit(nftMarketplace, "ItemListed");
    });

    it("price not met", async () => {
      await expect(
        nftMarketplace
          .connect(deployer)
          .listItem(mockNft.address, TOKEN_ID, ethers.utils.parseEther("0"))
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "NftMarketplace__PriceMustBeAboveZero"
      );
    });
  });

  describe("cancel Listing", function () {
    it("reverts if there is no listing", async () => {
      await expect(
        nftMarketplace.cancelListing(mockNft.address, TOKEN_ID)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "NftMarketplace__NotListed"
      );
    });

    it("revert if not owner", async () => {
      nftMarketplace
        .connect(deployer)
        .listItem(mockNft.address, TOKEN_ID, PRICE);
      await expect(
        nftMarketplace.connect(user).cancelListing(mockNft.address, TOKEN_ID)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "NftMarketplace__NotOwner"
      );
    });
  });
});
