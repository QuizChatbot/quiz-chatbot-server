const prepareSummary = (done, keys, round, skill, grade, score) => {
    let summaryObj = {}
    
    summaryObj.done = done
    summaryObj.round = round
    summaryObj.keysQuestionLeft = keys
    summaryObj.skill = skill
    summaryObj.grade = grade
    summaryObj.score = score

    return summaryObj
}

const calculateUserScore = (result) => {
    let score = 0
    if(result){
         score = 10
    }
   
    return score
}

const calculateTotalScore = (totalQuestions) => {
    let totalScore = totalQuestions * 10
    return totalScore
}

const calculateGrade = (totalScore, userScore) => {
    let grade
    if(userScore >= totalScore*80/100)  grade = 'A'
    else if(userScore >= totalScore*70/100)  grade = 'B'
    else if(userScore >= totalScore*60/100)  grade = 'C'
    else if(userScore >= totalScore*50/100)  grade = 'D'
    else grade = 'F'

    return grade
}

module.exports = {prepareSummary, calculateTotalScore, calculateGrade, calculateUserScore}