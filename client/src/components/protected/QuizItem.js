import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuizInput from './QuizInput'
import styled from 'styled-components'
import IconButton from 'material-ui/IconButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import Paper from 'material-ui/Paper'

const PaperStyled = styled(Paper)`
  text-align: left;
`

export const Element = ({ idx, quest, deleteQuiz, editQuiz }) => {
  function handleSave (id, quiz, isChoice) {
    editQuiz(`${id}`, quiz, isChoice)
  }

  return (
    <div>
      <QuizInput
        idx={idx}
        quest={quest}
        onSave={(quiz, isChoice) => handleSave(quest.id, quiz, isChoice)}
      />
      <div style={{ textAlign: 'right' }}>
        <IconButton tooltip='Delete'>
          <ActionDelete onTouchTap={() => deleteQuiz(quest.id)} />
        </IconButton>
      </div>
    </div>
  )
}

class QuizItem extends Component {
  render () {
    const { idx, quest, deleteQuiz, editQuiz } = this.props
    return (
      <PaperStyled zDepth={2}>
        <Element
          idx={idx}
          quest={quest}
          deleteQuiz={deleteQuiz}
          editQuiz={editQuiz}
        />
      </PaperStyled>
    )
  }
}

QuizItem.propTypes = {
  idx: PropTypes.number,
  quest: PropTypes.object,
  editQuiz: PropTypes.func,
  deleteQuiz: PropTypes.func
}

export default QuizItem
