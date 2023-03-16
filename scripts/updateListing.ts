import { deployments, ethers } from "hardhat";

const TOKEN_ID = 5;
const NEW_PRICE = ethers.utils.parseEther("0.5");

async function cancelListing() {
  const accounts = await ethers.getSigners();
  const [deployer, owner, buyer1] = accounts;

  const IDENTITIES = {
    [deployer.address]: "DEPLOYER",
    [owner.address]: "OWNER",
    [buyer1.address]: "BUYER1",
  };

  // await deployments.fixture(["NftMarketplace"]);
  // const myContract = await deployments.get("NftMarketplace");

  // const nftMarketplaceContract = await ethers.getContractAt(
  //   myContract.abi,
  //   myContract.address
  // );

  // await deployments.fixture(["MockNft"]);
  // const myContract1 = await deployments.get("MockNft");

  // const mockNftContract = await ethers.getContractAt(
  //   myContract1.abi,
  //   myContract1.address
  // );

  // @ts-ignore
  const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
  // @ts-ignore
  const mockNftContract = await ethers.getContract("MockNft");

  const tx = await nftMarketplaceContract
    .connect(owner)
    .updateListing(mockNftContract.address, TOKEN_ID, NEW_PRICE);
  const updateTxReceipt = await tx.wait(1);
  const updatedPrice = updateTxReceipt.events[0].args.price;
  console.log("updated price:  ", updatedPrice);
}

cancelListing()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
