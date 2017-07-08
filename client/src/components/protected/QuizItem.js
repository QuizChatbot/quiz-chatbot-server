import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuizInput from './QuizInput'
import IconButton from 'material-ui/IconButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import Paper from 'material-ui/Paper'

const style = {
  width: '50%',
  margin: 10,
  padding: 10,
  textAlign: 'left',
  display: 'inline-block'
}

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
      <div style={{ textAlign: 'center' }}>
        <IconButton tooltip='Delete' style={{ textAlign: 'center' }}>
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
      <Paper style={style} zDepth={1}>
        <Element
          idx={idx}
          quest={quest}
          deleteQuiz={deleteQuiz}
          editQuiz={editQuiz}
        />
      </Paper>
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
