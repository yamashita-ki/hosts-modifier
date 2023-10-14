import type { Host } from '@/interfaces/Host'
import type { HostStorage } from '@/interfaces/HostStorage'

export function updateRules(): void {
  chrome.storage.local.get(['hosts'], (result: HostStorage) => {
    const hosts = Array.isArray(result.hosts) ? result.hosts : []
    const activeHosts = hosts.filter((host: Host) => host.active) || []
    let ruleIdCounter = 1
    const newRules: chrome.declarativeNetRequest.Rule[] | undefined = []
    for (const host of activeHosts) {
      const lines = host.rules.split('\n')
      for (const line of lines) {
        const pairs: string[] = line
          .split(' ')
          .filter((pair: string) => pair.trim() !== '')
        if (pairs.length < 2) continue
        if (pairs[0].startsWith('#')) continue
        const ipAddress: string = pairs[0]
        const domain: string = pairs[1]

        ;['http', 'https'].forEach((scheme: string) => {
          const newRule: chrome.declarativeNetRequest.Rule = {
            id: ruleIdCounter++,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: {
                regexSubstitution: `${scheme}://${ipAddress}\\1`
              }
            },
            condition: {
              regexFilter: `^${scheme}://(?:${domain})(/.*)?$`,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME
              ]
            }
          }
          newRules.push(newRule)
        })
      }
    }

    // Remove all existing rules to avoid id conflicts :)
    chrome.declarativeNetRequest.getDynamicRules(
      (rules: chrome.declarativeNetRequest.Rule[]) => {
        const ruleIdsToRemove = rules.map((rule) => rule.id)
        chrome.declarativeNetRequest.updateDynamicRules(
          { removeRuleIds: ruleIdsToRemove, addRules: newRules },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError)
            }
          }
        )
      }
    )
  })
}

// Set a listener when the host switches to active
chrome.storage.onChanged.addListener(
  (changes: { hosts?: { oldValue: Host[]; newValue: Host[] } }) => {
    if (changes.hosts) {
      updateRules()
    }
  }
)

// Update rules on initialization
updateRules()
