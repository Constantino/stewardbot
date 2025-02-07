const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}
);

const assistantId = process.env.OPENAI_ASSITANT;
let pollingInterval;

const setUpPollingInterval = (interval) => {
    pollingInterval = interval
}

// Set up a thread
const createThread = async () => {
    console.log("creating a thread")
    const thread = await openai.beta.threads.create();
    return thread
}

const addMessage = async (threadId, message) => {
    console.log("adding a new message to thread: ", threadId)
    const response = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: message
        }
    )
    return response
}

async function runAssistant(threadId) {
    console.log('Running assistant for thread: ' + threadId)
    const response = await openai.beta.threads.runs.create(
        threadId,
        { 
          assistant_id: assistantId
          // Make sure to not overwrite the original instruction, unless you want to
        }
      );

    console.log(response)

    return response;
}

async function checkingStatus(res, threadId, runId) {
    const runObject = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    const status = runObject.status;
    console.log(runObject)
    console.log('Current status: ' + status);
    
    if(status == 'completed') {
        clearInterval(pollingInterval);

        const messagesList = await openai.beta.threads.messages.list(threadId);
        let messages = []
        
        messagesList.body.data.forEach(message => {
            messages.push(message.content);
        });

        return res.json({ messages });
    }
}

const startChat = async () => {

    const thread = await createThread();
    const threadId = thread.id

    console.log("threadId: ", threadId)

    const message = "what do you think about bitcoin?"
    
    addMessage(threadId, message).then(message => {
        // res.json({ messageId: message.id });

        // Run the assistant
        runAssistant(threadId).then(run => {
            const runId = run.id;           
            
            // Check the status
            pollingInterval = setInterval(() => {
                checkingStatus(res, threadId, runId);
            }, 5000);
        });
    });


    return "This is a response from AI service";

}

module.exports = {
    startChat,
    createThread,
    addMessage,
    runAssistant,
    checkingStatus,
    setUpPollingInterval
}