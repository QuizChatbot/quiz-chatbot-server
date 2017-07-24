const firebase = require('./firebase.js')
const utillArray = require('./utill_array')

/**
 * Create buttons object include choices,subject,question
 * @param {string} id 
 * @return {object} 
 * @async
 */
const createButtonFromQuestionId = async (id) => {
  let question = await firebase.getQuestionFromId(id)
  console.log("questions in createButtonFromQuestionId = ", question)
  //shuffle choices
  let choices = utillArray.shuffleChoices(question.choices)
  console.log("choices in createButtonFromQuestionId = ", choices)
  //push key and value to button 
  //but we will delete the 'subject' and 'question' key later'
  let buttons = []

  choices.forEach((element) => {
    buttons.push({
      type: "postback",
      title: element,
      payload: JSON.stringify({ "answer": element, "question": id, "point": question.point })
    })
  }, this)

  console.log("buttons =", buttons)

  return {
    buttons: buttons,
    subject: question.subject,
    question: question.question
  }
}

/**
 * Create buttons ready to send
 * @param {string} recipientId 
 * @param {object} buttons 
 * @return {object}
 */
const createButtonMessageWithButtons = (recipientId, buttons) => {
  //delete 'subject' and 'question' key that comes with buttons
  let subject = buttons.subject
  let question = buttons.question
  delete buttons.subject
  delete buttons.question

  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: subject + "\n" + question,
          buttons: buttons.buttons
        }
      }
    }
  };
  console.log("mssgdata buttons= ", buttons)
  return messageData
}

/**
 * Create button asked for next round
 * @param {string} recipientId 
 * @return {object}
 */
const createButtonNextRound = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Do you want to play the next round?",
          buttons: [{
            type: "postback",
            title: "Yes",
            payload: JSON.stringify({ "nextRound": true })
          }, {
            type: "postback",
            title: "No",
            payload: JSON.stringify({ "nextRound": false })
          }]
        }
      }
    }
  };

  return messageData
}

/**
 * Create button asked for next question 
 * @param {string} recipientId
 * @return {object} 
 */
const createButtonNext = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Wanna play next question?",
          buttons: [{
            type: "postback",
            title: "Yes",
            payload: JSON.stringify({ "nextQuestion": true })
          }, {
            type: "postback",
            title: "No",
            payload: JSON.stringify({ "nextQuestion": false })
          }]
        }
      }
    }
  };

  return messageData
}

/**
 * Create button asked which category to play
 * @param {string} recipientId 
 * @return {object}
 */
const createButtonCategory = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Choose category, please.",
          buttons: [{
            type: "postback",
            title: "12 Factors App",
            payload: JSON.stringify({ "category": "12 factors app" })
          }, {
            type: "postback",
            title: "Design Patterns",
            payload: JSON.stringify({ "category": "design patterns" })
          },
          {
            type: "postback",
            title: "Rules of Thumb",
            payload: JSON.stringify({ "category": "rules of thumb" })
          }]
        }
      }
    }
  };

  return messageData
}

const createButtonShare = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Share",
            subtitle: "subtitle",
            image_url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBAVFRAVFhAXFRYVFxAWFRUVFRUWFhUVFRYYHSggGB4lGxUVITEiJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGBAQFysdHR0tLS8rLSsuLS0tLS0tKystLSsrLS0tKy0tNy0tLS0tLS0tKy0tLS0tKy0tKy0vLS0tLf/AABEIALcBFAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQUGAgMEBwj/xAA5EAABAwIEAwUHAwMFAQEAAAABAAIRAyEEBRIxQVFhBiJxgZETMqGxwdHwB0LhFXLxIzNSYoJDFP/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAIxEBAQACAwABBAMBAAAAAAAAAAECEQMhMRITIkFRYeHwBP/aAAwDAQACEQMRAD8A9hhDimsXBbZaSVkFiQmFUZpIlAQMBZBJqyCBlAQmFFCYQhAITQgSE0IBQvavN24TCvrOIBAhs8ypkleNfrHn+uq3CMPdZd8cyJj5eqmV1Fxm6oNeu6s91R7u88kkn7fHpK68Lh9tyfMDxJXJhqEkRfoFLhmgb9SRf/K4vTGVRulve+gAVg/S/Gexx+ie5VBbHCTcfEKm5jibEA+u6m+zlT2dSjVm4ezbxESsy6ybyx3g+gmrJY0zIlZL0vEEIQoBCEIMShNCoxSWSSIxKULJCoUITTQJIppFRWBUbmOZso3dYC5m0KSXlX6t4l7KjGAkBwnc3g32Ut0uM3Vnd25woMavRS2XdocNX9yoJ6kLwzCzvczvEIc+oz/bdEdbrHzrr9KPoljltAXieQ9vsThyG1Rrp33N46H88V6h2e7T4fGNmk8auLSRqHktzKVzywsTkJhAKarITQE0CQmhQCEJOKCPz7MW4ag+s4wGi08zsPVfMuZY41676rnai909LQPuPJeu/q3m04f2bTYPaSRzvE+C8awJEkngYiN3CYEfE/ysZV0wiXwbQ25FzcDeB15Lpq1OLgT5hq4aGIBJmRvtN+pMrVi8W4G0xz73xJWL474salHU8QNzdWLCd0Da0dfJROWusXlT2V05gnbb1WJHWveMAf8ATZ/az5BdCi+z2LbWoNc0zEsPiwlv0UmvTLt4Na6NCE0QkJoQYoTISQKEiE0KjFCaEQkJoRWCCmkUGC8//V3LS/DNrgToMO/tdx9fmvQVwZ3ghXoVKR/c0geO4PqpZuLLqvC8qAIE22t9lJ18vDht8QSojEUKlNztwWk7b+XCevBbMBnDnwyNMcTf5kSVyerX6LFZY4e6DHjI+C5We1oPD6RLHtnoI8lZ6NFhuXEuPPV8lsdlzKkw8u5xAAP93FNJbEv2S/UjVFPFwDYa23E/9uS9Kw2JZUaHMcC03BGy+fs0yQMJe0jV03AUx2B7TPou9g6pFPYAzDTfbxW5l+3HLD9PcAU5VYw2dk8b8l2f1oR1hX5Rj41MVKobclcVfMmt2uoHE5iXmCVyvxVp5z9vopclmKznNWdVEZxncd1pgRJUNi8XCqecZobjiSAfBS5VqYxz9rK5rMgbl0kegHzVLxdLvlrRIbbleJLvP7Kdq44iSRsCZ34hs9PeBUZhMSwG8STHgOfqfistflwVG1IgCY5wPTZaaQf+5mmJ96I8ZPyurSMOHNOpoBG4/aNyA48+MC+y0vy+k4guaHu71zLQOYDeA3vY22RrblwVVrtLJknlMfFWzLtLwKYgO4XvI2VSoUSKmkNDWhuqwAgbRx4qRyDCP/8A0FzqkTBaCSLz9ljKb6dsb1t7H+n1A0sO6m73g4uP/qfsrWq92Sfqa9w2BDeW0yrCuvHNYyPLy3edpoSQtuZwkhCASTQgSSaEChIhNBVGMITQgwSQhALFwWYCIQeX9s8pFLEF8f6dTaZgHiPX5qs18kZ7zLOXr/aTKxiaBb+8Xb4jgvKsXRqU3HTuNxtdc71Xp4stzSHh9L3uHPbzKn8vrj2ep23CbNHkLT6lcdOt7QQ9t+Nj9km4QN77wQwRps4u8uW/CEazjHNq+qdO077fEn6KvwA+R3XTcgQHdCeHipDEtfVdwawGwBv8blR+ZPDO6A4n/iRcj6hZY10sODzt7Ia51xETa3JdeHz8vcIMc5m9rQqlhXajpNiBLSZsQLgzwuBfnfa3dQpzwI2kHhqI7vkZCaZ2uTceNUnp6oq5gHGQeBtxIj/ChHVSI52+HPyKGgAzxAQSOIxWowTb7/4UDjKOo253ttHDwuV0Oq7kG8lo/wDM/wAeqGmWXAHhymYPWLeaCFxtACmBsHVDA/tbJ+YWGCwLZ9s+b+6LTwOo8ja3lzCmK9IEtGkwNRItMl5ZA497Swf+lni8O4uiJEd6BAAggkepIHlwVRCUwXGZgXFMcGjdxHXe/FdbSLybd4ddheeZ5rYMIQZJ0mTbfcWgbAn7rCngyxurV7zrA7kDmfLhv0UXbvwmFY5rqgHeMA9NOzfiuTAg+3bI2cNjwnjzW0nSGlryCDymb3AaNz8vNW/s/l9GfaGmA/8A7aSRPDoi/Lp6BkBb7Iad+PU81KKDy14bsFONK6SuNNCEKoSaEIBJNCBJJoQYoTQgxQmhBpWQWIWYCoYSWQCFBreF5B219vRxxAaCxxBaY70HcTxXsJCrvavJPbhlVol9OZH/ACadwscktnTrxZTHLt5RisypCoGuI1Gx6FZNovqEte619Ijb6lR/ans77N+oVIJJIMSCOKkezWogio7UQLEiD5dFz7ej7ddNDqQo2LoPWfp9Vw4gExqaKlM2tEtPOBYcbkA8FKZkw6iTyII4wfzdclPCuhuzgCNiJjhfmBHotONrR/TW91zDcHY3FyABfa0gC82udlIs/wBrWB3o7wvI/n+TxUgzLDubFw3iR4O4O28UqtIMJJAlwg3sZ4397h14HZVlxvbMaZ22+6dBuo2kAusJ3gfYfBdFBrSIaOAvvYEiD5Fykuz+WOe8OAkTPgZ6+J9FFQOKaQ6BuTFvK/SxXZSZ3eGxkfAkBTWf5CabnOa0lpDbG4uYI6bhRLRAvx5b3/BuhGnBESGuEloueJgu0/NSDqjWyIEmC4wYtP12H3UA06ahJE32vv4cBMmOCeZZ5Swv+47vHZvvO8el+PohpOigxxNpud7W5nr9lyVsM2ZdJPWYHWfJV2j2ra67WPeOn2BHou6nnVKoNVNsPm5iT5yZCm11fXazD09TYbxMEX4bcpVkypjhER8T69VAYB7nkSBv623FvgrLl1RrbWgWvEyqyseCrH8lWXDPloKqVGpeOCs+W+4FvFjJ2IQhaZCSaECQmkgEk0IEkskkCQmhBoC2ALCmFthAkLJJBjCZCcJoKT26yBlSnrY3/UvHnyVEweTvwrCah7x2Ak/VevZsJCpWbUZeJ28CVjL10xt0qlag4vG0HcHWYHO+x9fv2UcIG3BPRpgCTyn86LfWYNVjDeIvNtrhc2JxADSTOkTN4t1JWV9N2Iizfe8zeOm3wXDjH62kAweNpPn5c1Xc47SENPs2gt5n3bcrc+K5/wCs4/DOY3E4ZoFRjXsbBa9zHyWvaJOoG/DgeSTvuGVmPVWnLHme9B5ja4i59T6r0fsZhoaRzv5G6oHZyrSxUmmbjTLXSHN8R6r0vszDDp+3HwVnfZklc2y4VaZbG4hee5jkrmkgA8Lm5nx9F6puFD5vgx7wHiqzLp5FmmGNCk+q6bCfX+YVEqVGUsQ3E43DmvRf7QaNZp3gaSDB2mwIgwvVf1CwjjgqrWwC7SJOw7wuo1uS0Mfgm4eoNFVobItqa8DccxvB4g9V5efn+hccrPt3qunwvJjZj7+v4/Lzbs5mJOJYIBDnRpAgbSDyXrFDIKLap0sGqoGONuQdPyb6Kt9nP08dg63t8TUb7Jmznd3xgSZPBXbBVzUqOxMFtENDKQIguaP3R1v6p9b6vNLhdyTtMOP4YXfW/HI/AU2uMCLwdNgt2ptO9hfoCT9VqxD3F085vfaY8Of8pg6hEeG1/NehEjg8UdQ6q7ZW6WBed4QkOj7W8FeshqyzdaxZyS6EIW2QhCEAhCEQJJoQJJZJIEhNCDBoWSQWSAQhCKSE0II7NGmFWcTQBMlXDF09TSqzim39VnJrFWMfhtRNp5RaLc1D4vIjUY5riQIvBu20TMK0OFz/AB8JWvCva1xDhMxPEQeCy0877QdmD/T2OoCSA07GSBuPG2ypOQGrVxlBgJLg5gAJJ0taZIE7CJt1Xu7qNXDyG0hXwzyTpaQHtneJ3v6yuCkzC06pq0cBWNYj9zA0Tyc//K8eOfLxTLHXy35/bfJx48vcut+sM0wrKNejXYNNUNf7SB79IN7wcOPe0weCvORkEgjbh6SqjQyqu976+JcCXwBTaLMYP23nz5nwVw7OYctJmNIDY5jff0Xb/l48uPjmOXv+6ObKZZdeLEwrXiaWoELY1ZEL0OKk9psrdVApxYzPz+ihafZakSA8vDmnuOa51hwA4+S9FxWHDxGxGxUJmOFLdgpYu6rzcjw9Nwe8mo4be0c98eANlqzDFjaTA4cFvxLXH5j84qLrRBMmTY8D4HgsySdRe760tiZ2J635QOS2zczaLSLT91q0sbL3ACJgwFGOxznOhkaeJ+wlGtJ+kZkN5xP1Vx7L2ZxVIy0wL7GI29dpV97PNAYtY+s5eJoJoQtsBCaSAQhCIEIQgEIQgSaEIMAmhCBoQhFCaSECcFXM4ow5WQqMzehqbKlIqOkGVy1TB2v5gePVdZA1HaFg+D/IssOjRRxDp3Nt94FrLtpYlxNtue/oVGGmQbNmduF77qZy6lJBsDtPXjBRKk8BhzUU5QwwYLIy+gGieK6HrTLFrk9a5farB1ZTbpMLXSXXRUoBwuo0Y5jqnsmul/EC+nnJ2ClwpMpfDk47hrc1tW8xwEbj89FW6+CGqw9bL0LFUw4b/AKtVtOuA+TwsNuitYlUnOsI95030jgAD8So2jlrm/8AzdPOB9lfsZg6rhYT5Aqv1strF3fa0dSxl/gstytOAEODYI2sVfcsq+zaJ4qAynAEOGqD4T8tlZjR7sK4pkkKOIB4reCqdXrPoumSpXAZ011nWK3tz0nU1qp1AVsVDSTQgSE0kAhCEQIQhBiE0IQCE0IpJoQgFhUYCIKzQgqua4HQ4xsfzZVnMJbMOI8pXpGKwwe2CqnmeXimZIn5fysZRrGq1gcXVJmNTSYFj+eiumVUDZxaQTG9o9bqtUseWnkOgInhYq2ZMTEkRPPeVIuSeY2AglYtPMpOeFplxY/Ae0gte5jgZBaYB6OGxUXXrPaYduOPNTj6qis1cCCSJIuPELFx/L08PLesb3G3JcI2m0uAguJPrdSeocVE4fFggcF0trKySTpz5csssrcvXaXjlKicRSLqnuQBx6rt9osSeIP51Vrm0uZ+brnqUp/PwLrmd7FZCms7Vz4bDAcF2aUNYtoaqiIzHDSFVsVTcx3ToVfalKVAZtl9iVpJWrIs5juvKtdGqHCQvM6oLTaxCsuQZns1xSVbPzFsQsKb5C2KskhNCBJJoQJNCFRihCEDQhCAQhNQJCaEChc+Kw4eLhdKRCCDOEa0yBdb6VPiul9O6yYxZ01sNdHisX1Vm5q5arVLdEhVHFczqGo3WRcQkKynyb1YyZQC2GGrQ/Ela3PJUuRqtrsRyWTHrna1bqYWe611HS0fnJbmLTTW9gW451saFtDViwLc0LTLDQubF0ZaYXdC11W2VFAzrCuBLtP0UdhKxBBFufFWjPaAAMk+SqOoNdAuCpWsV8yPMNTYO6m2leeZZiS1w4K94KsHNBC1O2bNOlNJNEJCEIBCEIMU0IVAhCagIRCEIBCEIBCEINRalpWZThRWohaqjF0ELFwUEdVprlDN1K1GLnNJYsblR723WbWrpdRTFJTTW2hrVta1bRSW1tNXTO2DAt7AhrFta1ajNZMC3ALBoWwKoFi4LJYlURWbUu7tKoGbUYdyXpWKiCqZnlMEyIlKRDYavsVcezuMtpVJDd1MZFii1wKk9avj0Fqa1UHyAVtWmAhCEAhCFUJCEIoTQhQCEIQCEIQCEIQYFZBCFAELEhCEVg5qxLEIUGOhP2aEIGGLINQhBkGrMNQhBkAskIVAkUkINFdshVHPKW4CEIiuSs8tfpchCy6PQ8oqTTCkUIXRzCEIQCEIQf/Z",
            buttons: [{
              type: "element_share",
                      share_contents: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "I took Peter's 'Which Hat Are You?' Quiz",
                  subtitle: "My result: Fez",
                  image_url: "http://www.rd.com/wp-content/uploads/sites/2/2016/02/06-train-cat-shake-hands.jpg",
                  default_action: {
                    type: "web_url",
                    url: "https://m.me/petershats?ref=invited_by_24601"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://m.me/petershats?ref=invited_by_24601",
                      title: "Take Quiz"
                    }
                  ]
                }
              ]
            }
          }


        }
            }
            ]
          }]
        }
      }
    }
  };
  console.log("__Button 1 = ", messageData)
  return messageData
}

const createButtonShare2 = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {},
    buttons: [
      {
        type: "element_share",
        share_contents: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "I took Peter's 'Which Hat Are You?' Quiz",
                  subtitle: "My result: Fez",
                  image_url: "https://bot.peters-hats.com/img/hats/fez.jpg",
                  default_action: {
                    type: "web_url",
                    url: "https://m.me/petershats?ref=invited_by_24601"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://m.me/petershats?ref=invited_by_24601",
                      title: "Take Quiz"
                    }
                  ]
                }
              ]
            }
          }


        }
      }
    ]
  };
  console.log("__Buttons__ = ", messageData)
  return messageData
}


module.exports = { createButtonFromQuestionId, createButtonMessageWithButtons, createButtonNextRound, createButtonNext, createButtonCategory, createButtonShare, createButtonShare2 }
