global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    }
  },
  storage: {
    sync: {
      get: jest.fn()
    },
    onChanged: {
      addListener: jest.fn()
    },
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  declarativeNetRequest: {
    getDynamicRules: jest.fn(),
    RuleActionType: {
      REDIRECT: 'redirect'
    },
    ResourceType: {
      MAIN_FRAME: 'main_frame'
    }
  }
}
globalThis.chrome = chrome
