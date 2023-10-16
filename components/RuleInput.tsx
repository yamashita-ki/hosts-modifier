import { useHosts } from '@/components/HostsContext'
import type { Host } from '@/interfaces/Host'
import type { RuleInputProps } from '@/interfaces/RuleInputProps'
import { Textarea } from '@mui/joy'
import parse from 'html-react-parser'
import React from 'react'

const RuleInput: React.FC<RuleInputProps> = ({ hostId, placeholder }) => {
  const { state, dispatch } = useHosts()
  const selectedHost = (Array.isArray(state?.hosts) ? state.hosts : []).find(
    (host: Host) => host.id === hostId
  )
  const selectedHostRules = selectedHost ? selectedHost.rules : ''
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_RULES', hostId, rules: e.target.value })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault()
      const cursorPosition = e.currentTarget.selectionStart
      const newText = toggleCommentOnCurrentLine(
        selectedHostRules,
        cursorPosition
      )
      dispatch({ type: 'UPDATE_RULES', hostId, rules: newText })
    }
  }

  const toggleCommentOnCurrentLine = (text: string, cursorPosition: number) => {
    const lines = text.split('\n')
    const { lineIndex } = findLineAndCharIndex(lines, cursorPosition)
    lines[lineIndex] = toggleComment(lines[lineIndex])
    return lines.join('\n')
  }

  const findLineAndCharIndex = (lines: string[], position: number) => {
    let currentPosition = 0
    for (let i = 0; i < lines.length; i++) {
      if (currentPosition + lines[i].length >= position) {
        return { lineIndex: i, charIndex: position - currentPosition }
      }
      currentPosition += lines[i].length + 1
    }
    return {
      lineIndex: lines.length - 1,
      charIndex: lines[lines.length - 1].length
    }
  }

  const toggleComment = (line: string) => {
    const isCommented = line.startsWith('#')
    if (isCommented) {
      return line.startsWith('# ') ? line.substring(2) : line.substring(1)
    } else {
      return '# ' + line
    }
  }
  return (
    <>
      {hostId === '00000-info' ? (
        <div style={{ width: '50vh', height: '50vh', fontSize: '14px' }}>
          {parse(
            '<h2>How to use</h2> <p>Each entry should be kept on an individual line.<br/>The host name should come after the IP address, which is positioned in the initial column.<br/> ex) 127.0.0.1 sample.com<br/>Furthermore, lines starting with a "#" will be ignored. </p> <p>Thanks you for adding this extension🚀</p>'
          )}
        </div>
      ) : (
        <Textarea
          style={{ width: '50vh', height: '50vh' }}
          spellCheck="false"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder={placeholder}
          value={selectedHostRules}
        />
      )}
    </>
  )
}
export default RuleInput
