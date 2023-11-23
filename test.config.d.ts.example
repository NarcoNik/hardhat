import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  AlphaHomoraFacet,
  CompoundV2Facet,
  Diamond,
  DLP,
  InfoFacet,
  MockToken,
  MockUniswapV2Router,
  MockWETH,
  MultiDelegateFacet,
  ServiceFacet,
  SushiswapFacet,
  SwapTokensFacet,
  TransferTokensFacet,
  UniswapV2Facet,
  UniswapV3Facet
} from './build/typechain';

declare module 'mocha' {
  export interface Context {
    // SIGNERS
    signers: SignerWithAddress[];
    owner: SignerWithAddress;
    alice: SignerWithAddress;
    bob: SignerWithAddress;
    carol: SignerWithAddress;
    tema: SignerWithAddress;
    misha: SignerWithAddress;

    weth: MockWETH;
    usdt: MockToken;
    usdc: MockToken;
    dai: MockToken;
    dlp: DLP;

    diamond: Diamond;
    infoFacet: InfoFacet;
    uniswapV2: UniswapV2Facet;
    uniswapV3: UniswapV3Facet;
    compound: CompoundV2Facet;
    alphaHomora: AlphaHomoraFacet;
    sushiswap: SushiswapFacet;
    swapTokens: SwapTokensFacet;
    transferTokens: TransferTokensFacet;
    serviceFacet: ServiceFacet;
    multiDelegateFacet: MultiDelegateFacet;

    //uniswapv2
    uniswapV2Router: MockUniswapV2Router;
  }
}
