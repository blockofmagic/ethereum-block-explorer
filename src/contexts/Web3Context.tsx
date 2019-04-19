import React from 'react';
import Web3 from 'web3';
import actionComposer from '../utils/actionComposer';
import { Block, Eth } from 'web3-eth';
import { BlockHeader } from 'web3/eth/types';

// @ts-ignore
const { RAZZLE_PRODUCT_ID } = process.env;

// Initial Values
//
const initialState: Web3Context.State = {
  web3: new Web3(new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${RAZZLE_PRODUCT_ID}`
  )),
  headerSubscription: undefined,
  blocks: {},
  blockRangeVisible: [Infinity, -Infinity],
};

const initialContext: Web3Context.Value = {
  state: initialState,
  actions: {
    setBlock: (block: { [blockNumber: number]: Block }) => undefined,
    getMoreBlocks: () => undefined,
    showNewerBlocks: () => undefined,
  },
};

// Reducer
//
const themeReducer = (
  state: Web3Context.State = initialState,
  action: ActionType
) => {
  switch (action.type) {
  case 'SET_WEB3':
    return { ...state, web3: action.payload };
  case 'SET_BLOCK':
    return { ...state, blocks: { ...state.blocks, ...action.payload } };
  case 'SET_SUBSCRIPTION':
    return { ...state, headerSubscription: action.payload };
  case 'UPDATE_BLOCK_RANGE':
    return { ...state, blockRangeVisible: action.payload };
  default:
    return state;
  }
};

// Exports
//
export const Web3Context = React.createContext(initialContext);

export const Web3ContextProvider = (props: any) => {
  /**
   * Set provider at root of project so make reducer hook available
   * anywhere with the consumer
   */

  // Create Reducer
  //
  const [_state, dispatch] = React.useReducer(themeReducer, initialState);
  const state = _state!;

  // Curate Actions
  //
  const setBlock: DispatchFunction = actionComposer(dispatch, 'SET_BLOCK');
  const showNewerBlocks: DispatchFunction = () => actionComposer(dispatch, 'UPDATE_BLOCK_RANGE')([
    state.blockRangeVisible[0],
    (Object.values(state.blocks)[Object.values(state.blocks).length - 1] as Block).number,
  ]);
  // Web3Context Bootstrap Functions
  //

  //  Get block by number
  const getBlock = (blockNumber: number) => {
    state.web3.eth.getBlock(blockNumber, true, (err: Error, block: Block) => {
      if (err) {
        console.log(err);
        return;
      }
      setBlock({ [blockNumber]: block });
    });
  };

  const getMoreBlocks = () => {
    const range = state.blockRangeVisible;
    const earliestBlock = range[0] - 20;
    let i = range[0];
    
    while (i-- > earliestBlock) {
      getBlock(i);
      range[0] = Math.min(i, range[0]);
    }
    actionComposer(dispatch, 'UPDATE_BLOCK_RANGE')(range);
  };

  // Get either missed (reconnected) or last 20 blocks (fresh init)
  const getRecentBlocks = () => {
    state.web3.eth.getBlockNumber()
      .then((blockNumber: number) => {
        let i = blockNumber;
        let range = [Infinity, -Infinity];
        const receivedBlockNumbers = Object.keys(state.blocks);
        const firstBlockNumber = receivedBlockNumbers.length
          ? receivedBlockNumbers[receivedBlockNumbers.length - 1]
          : blockNumber - 20;

        while (i-- >= firstBlockNumber) {
          getBlock(i);
          range = [Math.min(i, range[0]), Math.max(i, range[1])];
        }
        actionComposer(dispatch, 'UPDATE_BLOCK_RANGE')(range);
      })
      .catch(() => {
        console.log('Could not get current block number...');
      });
  };

  // Subscribe to websocket and get recent blocks
  const subscribe = (web3Eth: Eth) => {
    getRecentBlocks();

    const headerSubscription = web3Eth.subscribe('newBlockHeaders')
      .on('data', (block: BlockHeader) => {
        getBlock(block.number - 1);
      });

    actionComposer(dispatch, 'SET_SUBSCRIPTION')(headerSubscription);
  };

  // On mount, subscribe to newBlockHeaders pub/sub feed
  React.useEffect(() => {
    subscribe(state.web3.eth);
  }, []);
  

  // Create context value
  const web3ContextValue: Web3Context.Value = {
    state,
    actions: {
      setBlock,
      getMoreBlocks,
      showNewerBlocks,
    },
  };

  return (
    <Web3Context.Provider value={web3ContextValue}>
      {props.children}
    </Web3Context.Provider>
  );
};