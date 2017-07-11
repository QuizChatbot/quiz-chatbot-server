import React, { Component } from 'react'

export class Footer extends Component {
  render () {
    return (
      <div
        style={{
          padding: '48px 24px',
          backgroundColor: 'rgb(33, 33, 33)',
          textAlign: 'center'
        }}
      >
        <p
          style={{
            margin: '0px auto',
            padding: '0px',
            color: 'rgba(255, 255, 255, 0.54)'
          }}
        >
          Hand crafted with love by our awesome {' '}
          <a
            href='https://github.com/QuizChatbot/quiz-chatbot/graphs/contributors'
            style={{ color: 'rgba(255, 255, 255, 0.87)' }}
          >
            contributors
          </a>
          .
        </p>
        <p
          style={{
            margin: '0px auto',
            padding: '0px',
            color: 'rgba(255, 255, 255, 0.54)'
          }}
        >
          Repository on {' '}
          <a
            href='https://github.com/QuizChatbot/quiz-chatbot'
            style={{ color: 'rgba(255, 255, 255, 0.87)' }}
          >
            Github
          </a>
          .
        </p>

      </div>
    )
  }
}

export default Footer
