import React from 'react'

const StyledText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      {text.split('\n').map((line, index) => {
        const isHashTagLine = line.trimStart().startsWith('#')
        const words = line.split(' ').map((word, i) => {
          const isIpAddress = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(
            word
          )
          if (isIpAddress) {
            return (
              <span key={i} style={{ color: 'blue' }}>
                {word}{' '}
              </span>
            )
          }
          return word + ' '
        })

        return (
          <div key={index} style={{ color: isHashTagLine ? 'green' : 'black' }}>
            {words}
          </div>
        )
      })}
    </div>
  )
}

export default StyledText
