import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Artifact } from 'hardhat/types';
import { Signers } from '../types';
import '@nomiclabs/hardhat-waffle';
import { ethers, artifacts, waffle } from 'hardhat';
const { deployContract } = waffle;

describe('ETHPP', async () => {
  var ETHPP = await artifacts.readArtifact('/mnt/Documents/CRYPTO/hardhat/scam/AUTOscam v2.sol');
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: before, beforeEach, after, afterEach.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // before and beforeEach callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  /* create named accounts for contract roles */

  before(async () => {
    /* before tests */
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  beforeEach(async () => {
    /* before each context */
  });

  it('should revert if ...', () => {
    //Using .deploy() on artifact loaded (using ethers library)
    return ETHPP.deploy()
      .then(instance => {
        return instance.publicOrExternalContractMethod(argument1, argument2, { from: externalAddress });
      })
      .then(result => {
        assert.fail();
      })
      .catch(error => {
        assert.notEqual(error.message, 'assert.fail()', 'Reason ...');
      });
  });

  context('testgroup - security tests - description...', () => {
    //deploy a new contract
    before(async () => {
      /* before tests */
      const newETHPP = await ETHPP.new();
    });

    beforeEach(async () => {
      /* before each tests */
    });

    it('fails on initialize ...', async () => {
      return assertRevert(async () => {
        await newETHPP.initialize();
      });
    });

    it('checks if method returns true', async () => {
      assert.isTrue(await newETHPP.thisMethodShouldReturnTrue());
    });
  });
});
