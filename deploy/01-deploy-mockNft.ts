import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";
import verify from "../utils/verify";
import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";

const mockNftDeploy: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  const { deployer } = await getNamedAccounts();

  const args: any[] = [];
  const MockNft = await deploy("MockNft", {
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
    await verify(MockNft.address, args);
  }
};

export default mockNftDeploy;
// module.exports.tags = ["all", "mocknft"];
mockNftDeploy.tags = ["all", "mocknft"];
