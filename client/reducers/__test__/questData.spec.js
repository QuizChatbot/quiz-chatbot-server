import React from 'react'
import { Shallow, mount, render } from 'enzyme'
import questData from '../questData'

describe('questData reducer', () => {
  const types = {
    setQuestData: 'quest/set-quest-data',
    foo: 'bar'
  }

  it('should handle if state is undefined or new object', () => {
    const action = {
      type: types.foo,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }

    expect(
      questData(undefined, {
        type: action.type,
        data: action.data
      })
    ).toEqual({
      quests: []
    })

    expect(
      questData(
        {},
        {
          type: action.type,
          data: action.data
        }
      )
    ).toEqual({
      quests: []
    })
  })

  it('should handle if quests in state is empty array []', () => {
    const state = {
      quests: []
    }
    const action = {
      type: types.foo,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }

    expect(
      questData(state, [
        {
          type: action.type,
          data: action.data
        }
      ])
    ).toEqual({
      quests: []
    })
  })

  it('should handle if action type is unexpected', () => {
    const state = {
      quests: [{ id: 1 }, { id: 2 }]
    }
    const action = {
      type: types.foo,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }

    expect(
      questData(state, {
        type: action.type,
        data: action.data
      })
    ).toEqual({
      quests: state.quests
    })
  })

  it('should handle if action type is quest/set-quest-data', () => {
    const state = {
      quests: [{ id: 1 }, { id: 2 }]
    }
    const action = {
      type: types.setQuestData,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }

    expect(
      questData(state, {
        type: action.type,
        data: action.data
      })
    ).toEqual({
      quests: action.data
    })
  })
})
