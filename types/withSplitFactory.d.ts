import * as React from 'react';
import SplitIO from '@splitsoftware/splitio/types/splitio';
import { ISplitFactoryChildProps } from './types';
/**
 * High-Order Component for SplitFactory.
 * The wrapped component receives all the props of the container,
 * along with the passed props from SplitFactory (see ISplitFactoryChildProps).
 *
 * @param config Config object used to instantiate a Split factory
 * @param factory Split factory instance to use instead of creating a new one with the config object.
 */
export declare function withSplitFactory(config?: SplitIO.IBrowserSettings, factory?: SplitIO.ISDK): <OuterProps>(WrappedComponent: React.ComponentType<OuterProps & ISplitFactoryChildProps>, updateOnSdkUpdate?: boolean, updateOnSdkTimedout?: boolean, updateOnSdkReady?: boolean) => (props: OuterProps) => JSX.Element;
export default withSplitFactory;
