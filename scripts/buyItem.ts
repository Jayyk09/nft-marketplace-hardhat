import { deployments, ethers } from "hardhat";

const TOKEN_ID = 0;

async function buyItem() {
  const accounts = await ethers.getSigners();
  const [deployer, owner, buyer1] = accounts;

  const IDENTITIES = {
    [deployer.address]: "DEPLOYER",
    [owner.address]: "OWNER",
    [buyer1.address]: "BUYER1",
  };

  const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
  const mockNftContract = await ethers.getContract("MockNft");

  console.log("BuyingNft");
  const nftListing = await nftMarketplaceContract.getListing(
    mockNftContract.address,
    TOKEN_ID
  );

  const price = nftListing.price;
  const tx = await nftMarketplaceContract
    .connect(buyer1)
    .buyItem(mockNftContract.address, TOKEN_ID, {
      value: price,
    });

  await tx.wait(1);
  console.log("NFT Bought!");

  const newOwner = await mockNftContract.ownerOf(TOKEN_ID);
  console.log(`
        New owner of Token ID ${TOKEN_ID} is ${newOwner} with identity of 
    ${IDENTITIES[newOwner]}`);
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
