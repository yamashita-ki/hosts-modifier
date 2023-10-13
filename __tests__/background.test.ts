import { updateRules } from '@/background'
import type { HostStorage } from '@/interfaces/HostStorage'

describe('updateRules', () => {
  let result: { hosts: HostStorage }

  beforeEach(() => {
    result = {
      hosts: [
        {
          active: true,
          rules:
            '127.0.0.1 example.com\n# 127.0.0.1 example.org\n# markdown comment',
          id: '1',
          name: 'test',
          editable: true
        },
        {
          active: true,
          rules: '127.0.0.1 example.net',
          id: '2',
          name: 'test2',
          editable: true
        },
        {
          active: false,
          rules: '127.0.0.1 example.net',
          id: '3',
          name: 'test3',
          editable: true
        }
      ]
    }
    chrome.storage.local.get = jest
      .fn()
      .mockImplementation((keys, callback) => {
        callback(result)
      })
    chrome.declarativeNetRequest.getDynamicRules = jest
      .fn()
      .mockImplementation((callback) => {
        callback([])
      })
    chrome.declarativeNetRequest.updateDynamicRules = jest
      .fn()
      .mockImplementation((rules, callback) => {
        if (typeof callback === 'function') {
          callback([])
        }
      })
  })

  it('should call chrome.storage.local.get and chrome.declarativeNetRequest.getDynamicRules once', () => {
    updateRules()

    expect(chrome.storage.local.get).toHaveBeenCalledWith(
      ['hosts'],
      expect.any(Function)
    )
    expect(chrome.declarativeNetRequest.getDynamicRules).toHaveBeenCalledWith(
      expect.any(Function)
    )
  })

  it('should pass only active rules to chrome.declarativeNetRequest.updateDynamicRules', () => {
    updateRules()

    expect(
      chrome.declarativeNetRequest.updateDynamicRules
    ).toHaveBeenCalledWith(
      {
        removeRuleIds: [],
        addRules: [
          {
            id: 1,
            priority: 1,
            action: {
              redirect: {
                regexSubstitution: 'http://127.0.0.1\\1'
              },
              type: 'redirect'
            },
            condition: {
              regexFilter: '^http://(?:example.com)(/.*)?$',
              resourceTypes: ['main_frame']
            }
          },
          {
            id: 2,
            priority: 1,
            action: {
              redirect: {
                regexSubstitution: 'https://127.0.0.1\\1'
              },
              type: 'redirect'
            },
            condition: {
              regexFilter: '^https://(?:example.com)(/.*)?$',
              resourceTypes: ['main_frame']
            }
          },
          {
            id: 3,
            priority: 1,
            action: {
              redirect: {
                regexSubstitution: 'http://127.0.0.1\\1'
              },
              type: 'redirect'
            },
            condition: {
              regexFilter: '^http://(?:example.net)(/.*)?$',
              resourceTypes: ['main_frame']
            }
          },
          {
            id: 4,
            priority: 1,
            action: {
              redirect: {
                regexSubstitution: 'https://127.0.0.1\\1'
              },
              type: 'redirect'
            },
            condition: {
              regexFilter: '^https://(?:example.net)(/.*)?$',
              resourceTypes: ['main_frame']
            }
          }
        ]
      },
      expect.any(Function)
    )
  })
})
