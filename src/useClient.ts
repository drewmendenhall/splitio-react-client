import { useContext } from 'react';
import SplitContext from './SplitContext';

/**
 * 'useClient' is a custom hook that returns a client from the Split context.
 * It uses the 'useContext' hook to access the context, which is updated by
 * SplitFactory and SplitClient components in the hierarchy of components.
 *
 * @return A Split Client instance, or null if used outside the scope of SplitFactory
 * @see {@link https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#advanced-instantiate-multiple-sdk-clients}
 */
const useClient = (key?: SplitIO.SplitKey, trafficType?: string): SplitIO.IClient | null => {
  const { factory, client } = useContext(SplitContext);
  if (key) {
    return factory ? factory.client(key, trafficType) : null;
  }
  return client;
};

export default useClient;
