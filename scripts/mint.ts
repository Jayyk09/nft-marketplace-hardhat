import { deployments, ethers } from "hardhat";

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
  const accounts = await ethers.getSigners();
  const [deployer, owner, buyer1] = accounts;

  const IDENTITIES = {
    [deployer.address]: "DEPLOYER",
    [owner.address]: "OWNER",
    [buyer1.address]: "BUYER1",
  };

  // await deployments.fixture("MockNft");
  // const myContract = await deployments.get("MockNft");

  // const mockNftContract = await ethers.getContractAt(
  //   "MockNft",
  //   myContract.address
  // );

  // @ts-ignore
  const mockNftContract = await ethers.getContract("MockNft");

  console.log("minting Nft from acc");
  const mintTx = await mockNftContract.connect(owner).mint();
  const mintTxReceit = await mintTx.wait(1);
  const tokenId = await mintTxReceit.events[0].args.tokenId;
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
