import React from 'react';
import { shallow, mount } from 'enzyme';

/** Mocks */
import { mockSdk, Event } from './utils/mockSplitSdk';
jest.mock('@splitsoftware/splitio', () => {
  return { SplitFactory: mockSdk() };
});
import { SplitFactory as SplitSdk } from '@splitsoftware/splitio';
import { sdkBrowser } from './utils/sdkConfigs';

/** Test target */
import { ISplitTreatmentsChildProps } from '../types';
import SplitTreatments from '../SplitTreatments';
import SplitClient from '../SplitClient';
import SplitFactory from '../SplitFactory';
jest.mock('../constants', () => {
  const actual = jest.requireActual('../constants');
  return {
    ...actual,
    getControlTreatmentsWithConfig: jest.fn(actual.getControlTreatmentsWithConfig),
  };
});
import { getControlTreatmentsWithConfig, WARN_ST_NO_CLIENT } from '../constants';
import { getClientWithStatus } from '../utils';

describe('SplitTreatments', () => {

  it('passes as treatments prop the value returned by the function "getControlTreatmentsWithConfig" if the SDK is not ready.', (done) => {
    const splitNames = ['split1', 'split2'];
    mount(
      <SplitFactory config={sdkBrowser} >{
        ({ factory }) => {
          return (
            <SplitClient splitKey='user1' >
              <SplitTreatments names={splitNames} >
                {({ treatments }: ISplitTreatmentsChildProps) => {
                  const clientMock: any = factory?.client('user1');
                  expect(clientMock.getTreatmentsWithConfig.mock.calls.length).toBe(0);
                  expect(treatments).toEqual(getControlTreatmentsWithConfig(splitNames));
                  done();
                  return null;
                }}
              </SplitTreatments>
            </SplitClient>);
        }
      }
      </SplitFactory>);
  });

  it('passes as treatments prop the value returned by the method "client.getTreatmentsWithConfig" if the SDK is ready.', (done) => {
    const splitNames = ['split1', 'split2'];
    const outerFactory = SplitSdk(sdkBrowser);
    getClientWithStatus(outerFactory);
    (outerFactory as any).client().__emitter__.emit(Event.SDK_READY);
    setTimeout(() => {
      mount(
        <SplitFactory factory={outerFactory} >{
          ({ factory, isReady }) => {
            expect(getClientWithStatus(outerFactory).isReady).toBe(isReady);
            expect(isReady).toBe(true);
            return (
              <SplitTreatments names={splitNames} >
                {({ treatments }: ISplitTreatmentsChildProps) => {
                  const clientMock: any = factory?.client();
                  expect(clientMock.getTreatmentsWithConfig.mock.calls.length).toBe(1);
                  expect(treatments).toBe(clientMock.getTreatmentsWithConfig.mock.results[0].value);
                  expect(splitNames).toBe(clientMock.getTreatmentsWithConfig.mock.calls[0][0]);
                  done();
                  return null;
                }}
              </SplitTreatments>);
          }
        }
        </SplitFactory>);
    }, 0);
  });

  it('logs error and passes control treatments ("getControlTreatmentsWithConfig") if rendered outside an SplitProvider component.', () => {
    const splitNames = ['split1', 'split2'];
    const logSpy = jest.spyOn(console, 'log');
    let passedTreatments;
    mount(
      <SplitTreatments names={splitNames} >
        {({ treatments }: ISplitTreatmentsChildProps) => {
          passedTreatments = treatments;
          return null;
        }}
      </SplitTreatments>);
    expect(logSpy).toBeCalledWith(WARN_ST_NO_CLIENT);
    expect(getControlTreatmentsWithConfig).toBeCalledWith(splitNames);
    expect(getControlTreatmentsWithConfig).toHaveReturnedWith(passedTreatments);
  });

  // This test might change if sCU is updated to perform a deep comparison of split names and attributes.
  it('does not rerender if names and attributes are the same object.', () => {
    const names = ['split1', 'split2'];
    const attributes = { att1: 'att1' };
    let renderTimes = 0;
    const wrapper = mount(
      <SplitTreatments names={names} attributes={attributes} >
        {() => {
          renderTimes++;
          return null;
        }}
      </SplitTreatments>);
    wrapper.setProps({ names, attributes });
    expect(renderTimes).toBe(1);
  });

  // This test might change if sCU is updated to perform a deep comparison of split names and attributes.
  it('rerenders if names or attributes are a different object.', () => {
    const names = ['split1', 'split2'];
    const attributes = { att1: 'att1' };
    let renderTimes = 0;
    const wrapper = mount(
      <SplitTreatments names={names} attributes={attributes} >
        {() => {
          renderTimes++;
          return null;
        }}
      </SplitTreatments>);
    wrapper.setProps({ names, attributes: { ...attributes } });
    expect(renderTimes).toBe(2);
  });

  test('rerenders when Split context changes.', (done) => {
    const outerFactory = SplitSdk(sdkBrowser);
    const names = ['split1', 'split2'];
    const attributes = { att1: 'att1' };
    let renderTimes = 0;

    mount(
      <SplitFactory factory={outerFactory} >
        <SplitTreatments names={names} attributes={{ ...attributes }} >
          {() => {
            renderTimes++;
            return null;
          }}
        </SplitTreatments>
      </SplitFactory>);

    setTimeout(() => {
      (outerFactory as any).client().__emitter__.emit(Event.SDK_READY);
      setTimeout(() => {
        expect(renderTimes).toBe(2);
        done();
      });
    });

  });

});
