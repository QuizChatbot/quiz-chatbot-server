const prepareSummary = (done, numberOfQuestions,keys, round, skill, grade, score, totalScore) => {
    let summaryObj = {}

    summaryObj.done = done
    summaryObj.round = round
    summaryObj.keysQuestionLeft = keys
    summaryObj.skill = skill
    summaryObj.grade = grade
    summaryObj.score = score
    summaryObj.totalScore = totalScore
    if(done == numberOfQuestions)   summaryObj.isDone = true
    else    summaryObj.isDone = false

    return summaryObj
}
//score for one question that user just answered 
const calculateScoreForThatQuestion = (point, result, duration) => {
    let score = 0
    //Correct
    if (result) {
        if (duration <= 60000) score = point + 5 //answer within 1 min
        else if (duration > 60000) score = point + 3 //answer not within 1 min
    }

    return score
}

const calculateTotalScore = (totalQuestions) => {
    let totalScore = totalQuestions * 15
    return totalScore
}

const calculateGrade = (totalScore, userScore) => {
    let grade
    if (userScore >= totalScore * 86 / 100) grade = 'A+'
    else if (userScore >= totalScore * 83 / 100) grade = 'A'
    else if (userScore >= totalScore * 80 / 100) grade = 'A-'
    else if (userScore >= totalScore * 76 / 100) grade = 'B+'
    else if (userScore >= totalScore * 73 / 100) grade = 'B'
    else if (userScore >= totalScore * 70 / 100) grade = 'B-'
    else if (userScore >= totalScore * 66 / 100) grade = 'C+'
    else if (userScore >= totalScore * 63 / 100) grade = 'C'
    else if (userScore >= totalScore * 60 / 100) grade = 'C-'
    else if (userScore >= totalScore * 56 / 100) grade = 'D+'
    else if (userScore >= totalScore * 53 / 100) grade = 'D'
    else if (userScore >= totalScore * 50 / 100) grade = 'D-'
    else grade = 'F'

    return grade
}

module.exports = { prepareSummary, calculateTotalScore, calculateGrade, calculateScoreForThatQuestion }