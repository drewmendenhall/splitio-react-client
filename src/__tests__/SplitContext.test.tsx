import React from 'react';
import { shallow } from 'enzyme';
import SplitContext, { ISplitContextValues } from '../SplitContext';

/**
 * Test default SplitContext value
 */
test('SplitContext.Consumer shows default value', () => {
  shallow(<SplitContext.Consumer>{(value: ISplitContextValues) => {
    expect(value.factory).toBe(null);
    expect(value.client).toBe(null);
    expect(value.isReady).toBe(false);
    expect(value.isTimedout).toBe(false);
    expect(value.lastUpdate).toBe(0);
    return null;
  }}</SplitContext.Consumer>);
});
