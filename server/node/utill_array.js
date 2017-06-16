const shuffleKeyFromQuestions = function(questions) {
   let keys = []

   //get all key in questions
   for (let key in questions) {
       keys.push(key)
   }
   //shuffle key and return thr first element
    for (let i = keys.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [keys[i - 1], keys[j]] = [keys[j], keys[i - 1]];
    }

    return keys[0]
    
   
}

module.exports={shuffleKeyFromQuestions}