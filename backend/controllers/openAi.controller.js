const { request, response } = require('express');
const { startChat,
    createThread,
    addMessage,
    runAssistant,
    checkingStatus,
    setUpPollingInterval
 } = require('../services/openAi.service')


const getThreadId = async (req = request, res = response) => {
    const query = req.query;

    const thread = await createThread();
    const threadId = thread.id

    res.json({
        threadId: threadId
    })
}

const getAIResponse = async (req = request, res = response) => {

    console.log("body: ", req.body)

    const query = req.query;
    const { threadId, message } = req.body

    if(!threadId || !message) {
        return res.status(404).json({
            message: "Missing parameters review the threadId and message."
        })
    }

    //const message = await startChat();
    
    // const thread = await createThread();
    // const threadId = thread.id

    console.log("threadId: ", threadId)

    // const message = "What's the best wine of the world?"
    
    addMessage(threadId, message).then(message => {
        

        // Run the assistant
        runAssistant(threadId).then(run => {
            const runId = run.id;           
            
            // Check the status
            setUpPollingInterval( 
                setInterval(() => {
                    checkingStatus(res, threadId, runId);
                }, 5000) 
            )
            
        });
    });
}

module.exports = { 
    getAIResponse,
    getThreadId
}