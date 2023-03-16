import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";
import verify from "../utils/verify";
import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";

const NftMarketplaceDeploy: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  const { deployer } = await getNamedAccounts();

  const args: any[] = [];
  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(nftMarketplace.address, args);
  }
};

export default NftMarketplaceDeploy;
// module.exports.tags = ["all", "nftmarketplace"];
NftMarketplaceDeploy.tags = ["all", "nftmarketplace"];
