import { deployments, ethers } from "hardhat";

const PRICE_ = ethers.utils.parseEther("0.1");

async function mintAndList() {
  const accounts = await ethers.getSigners();
  const [deployer, owner, buyer1] = accounts;

  const IDENTITIES = {
    [deployer.address]: "DEPLOYER",
    [owner.address]: "OWNER",
    [buyer1.address]: "BUYER1",
  };

  const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
  const mockNftContract = await ethers.getContract("MockNft");

  console.log("minting Nft from acc");
  const mintTx = await mockNftContract.connect(owner).mint();
  const mintTxReceit = await mintTx.wait(1);
  const tokenId = await mintTxReceit.events[0].args.tokenId;

  console.log("Approving marketplace");
  const approveTx = await mockNftContract
    .connect(owner)
    .approve(nftMarketplaceContract.address, tokenId);
  await approveTx.wait(1);

  console.log("Listing NFT....");
  const listTx = await nftMarketplaceContract
    .connect(owner)
    .listItem(mockNftContract.address, tokenId, PRICE_);
  await approveTx.wait(1);

  const mintedBy = await mockNftContract.ownerOf(tokenId);
  console.log(`
        NFT with ID ${tokenId} minted and listed by owner ${mintedBy} 
with identity ${IDENTITIES[mintedBy]}.`);
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
